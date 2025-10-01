const WS_BASE_URL = process.env.REACT_APP_WS_BASE_URL || "ws://127.0.0.1:5000/ws";

interface WSClientOptions {
  token: string;
  onTokenExpired?: () => Promise<string>; // Callback to refresh token
  maxReconnectAttempts?: number;
  reconnectInterval?: number; // Base interval in ms
  pingInterval?: number;
}

type ConnectionType = 'broadcast' | 'user';

interface ConnectionState {
  ws: WebSocket | null;
  reconnectAttempts: number;
  reconnectTimer: NodeJS.Timeout | null;
  pingTimer: NodeJS.Timeout | null;
  intentionallyClosed: boolean;
  messageHandler: ((msg: any) => void) | null;
}

export class WSClient {
  private token: string;
  private onTokenExpired?: () => Promise<string>;
  private maxReconnectAttempts: number;
  private reconnectInterval: number;
  private pingInterval: number;

  private connections: Map<ConnectionType, ConnectionState> = new Map();

  constructor(options: WSClientOptions) {
    this.token = options.token;
    this.onTokenExpired = options.onTokenExpired;
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 10;
    this.reconnectInterval = options.reconnectInterval ?? 1000;
    this.pingInterval = options.pingInterval ?? 30000;

    // Initialize connection states
    this.connections.set('broadcast', this.createConnectionState());
    this.connections.set('user', this.createConnectionState());
  }

  private createConnectionState(): ConnectionState {
    return {
      ws: null,
      reconnectAttempts: 0,
      reconnectTimer: null,
      pingTimer: null,
      intentionallyClosed: false,
      messageHandler: null
    };
  }

  // 🔹 Connect to broadcast channel
  connectBroadcast(onMessage: (msg: any) => void) {
    const state = this.connections.get('broadcast')!;
    state.messageHandler = onMessage;
    state.intentionallyClosed = false;
    this.connect('broadcast', `${WS_BASE_URL}/broadcast`);
  }

  // 🔹 Connect to user-specific channel
  connectUser(onMessage: (msg: any) => void) {
    const state = this.connections.get('user')!;
    state.messageHandler = onMessage;
    state.intentionallyClosed = false;
    this.connect('user', `${WS_BASE_URL}/user?token=${this.token}`);
  }

  // 🔹 Core connection logic
  private connect(type: ConnectionType, url: string) {
    const state = this.connections.get(type)!;

    // Clean up existing connection
    if (state.ws) {
      state.ws.close();
      state.ws = null;
    }

    // console.log(`🔌 Connecting to ${type} channel...`);

    try {
      state.ws = new WebSocket(url);

      state.ws.onopen = () => {
        // console.log(`✅ Connected to ${type} channel`);
        state.reconnectAttempts = 0; // Reset on successful connection
        this.startPingInterval(type);
      };

      state.ws.onmessage = (e: MessageEvent) => {
        if (state.messageHandler) {
          try {
            const data = JSON.parse(e.data);
            state.messageHandler(data);
          } catch {
            state.messageHandler(e.data);
          }
        }
      };

      state.ws.onerror = (error) => {
        // console.error(`❌ ${type} WebSocket error:`, error);
      };

      state.ws.onclose = async (event) => {
        // console.log(`🔌 ${type} channel closed (Code: ${event.code}, Reason: ${event.reason})`);
        
        this.stopPingInterval(type);

        // Don't reconnect if intentionally closed
        if (state.intentionallyClosed) {
          // console.log(`ℹ️ ${type} connection was intentionally closed`);
          return;
        }

        // Handle token expiration (4001 is our custom code)
        if (event.code === 4001 && type === 'user' && this.onTokenExpired) {
          // console.log('🔄 Token expired, attempting to refresh...');
          try {
            this.token = await this.onTokenExpired();
            // console.log('✅ Token refreshed');
            // Retry with new token immediately
            state.reconnectAttempts = 0;
            this.scheduleReconnect(type, `${WS_BASE_URL}/user?token=${this.token}`, 0);
          } catch (error) {
            // console.error('❌ Failed to refresh token:', error);
            // Fall through to normal reconnect logic
            this.scheduleReconnect(type, url);
          }
        } else {
          // Normal reconnect logic
          this.scheduleReconnect(type, url);
        }
      };
    } catch (error) {
      // console.error(`❌ Failed to create ${type} WebSocket:`, error);
      this.scheduleReconnect(type, url);
    }
  }

  // 🔹 Schedule reconnection with exponential backoff
  private scheduleReconnect(type: ConnectionType, url: string, customDelay?: number) {
    const state = this.connections.get(type)!;

    if (state.intentionallyClosed) {
      return;
    }

    if (state.reconnectAttempts >= this.maxReconnectAttempts) {
      // console.error(`❌ Max reconnection attempts (${this.maxReconnectAttempts}) reached for ${type}`);
      return;
    }

    state.reconnectAttempts++;

    // Exponential backoff: delay = base * 2^attempts (capped at 30s)
    const delay = customDelay !== undefined 
      ? customDelay 
      : Math.min(this.reconnectInterval * Math.pow(2, state.reconnectAttempts - 1), 30000);

    // console.log(
    //   `🔄 Scheduling reconnect for ${type} (attempt ${state.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`
    // );

    state.reconnectTimer = setTimeout(() => {
      this.connect(type, url);
    }, delay);
  }

  // 🔹 Start ping interval to keep connection alive
  private startPingInterval(type: ConnectionType) {
    const state = this.connections.get(type)!;

    // Clear existing interval
    this.stopPingInterval(type);

    state.pingTimer = setInterval(() => {
      if (state.ws?.readyState === WebSocket.OPEN) {
        state.ws.send(JSON.stringify({ type: 'ping' }));
        // console.log(`🔄 Ping sent to ${type}`);
      }
    }, this.pingInterval);
  }

  // 🔹 Stop ping interval
  private stopPingInterval(type: ConnectionType) {
    const state = this.connections.get(type)!;
    if (state.pingTimer) {
      clearInterval(state.pingTimer);
      state.pingTimer = null;
    }
  }

  // 🔹 Update token (useful for manual token refresh)
  updateToken(newToken: string) {
    this.token = newToken;
    
    // Reconnect user channel with new token if currently connected
    const userState = this.connections.get('user')!;
    if (userState.ws && !userState.intentionallyClosed) {
      // console.log('🔄 Reconnecting user channel with new token...');
      this.disconnect('user');
      if (userState.messageHandler) {
        this.connectUser(userState.messageHandler);
      }
    }
  }

  // 🔹 Disconnect specific channel
  disconnect(type: ConnectionType) {
    const state = this.connections.get(type)!;
    
    state.intentionallyClosed = true;
    
    // Clear timers
    if (state.reconnectTimer) {
      clearTimeout(state.reconnectTimer);
      state.reconnectTimer = null;
    }
    this.stopPingInterval(type);

    // Close WebSocket
    if (state.ws) {
      state.ws.close(1000, 'Client disconnect');
      state.ws = null;
    }

    // console.log(`🔌 ${type} channel disconnected`);
  }

  // 🔹 Close all connections
  close() {
    this.disconnect('broadcast');
    this.disconnect('user');
  }

  // 🔹 Get connection status
  getStatus(type: ConnectionType): 'connected' | 'connecting' | 'disconnected' {
    const state = this.connections.get(type)!;
    
    if (!state.ws) return 'disconnected';
    
    switch (state.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      default:
        return 'disconnected';
    }
  }

  // 🔹 Check if connected
  isConnected(type: ConnectionType): boolean {
    return this.getStatus(type) === 'connected';
  }
}


// 🔹 Example usage in React
/*
import { useEffect, useState } from 'react';

function useWebSocket(token: string) {
  const [wsClient, setWsClient] = useState<WSClient | null>(null);
  const [broadcastMessages, setBroadcastMessages] = useState<any[]>([]);
  const [userMessages, setUserMessages] = useState<any[]>([]);

  useEffect(() => {
    const client = new WSClient({
      token,
      maxReconnectAttempts: 10,
      reconnectInterval: 1000,
      pingInterval: 30000,
      onTokenExpired: async () => {
        // Refresh your token here
        const response = await fetch('/api/v1/auth/token/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: getRefreshToken() })
        });
        const data = await response.json();
        return data.access_token;
      }
    });

    // Connect to channels
    client.connectBroadcast((msg) => {
      setBroadcastMessages(prev => [...prev, msg]);
    });

    client.connectUser((msg) => {
      setUserMessages(prev => [...prev, msg]);
    });

    setWsClient(client);

    // Cleanup on unmount
    return () => {
      client.close();
    };
  }, [token]);

  return { wsClient, broadcastMessages, userMessages };
}
*/