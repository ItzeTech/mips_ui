import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchUser, updateUser, clearUser, UserState } from '../features/user/userSlice';
import { useAuth } from './useAuth';

export function useUserInfo() {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useAuth();

  const userState = useSelector<RootState, UserState>((state) => state.user);

  // Fetch user info on mount (optional)
  useEffect(() => {
    if (!token) return;
    if (!userState.id) {
      dispatch(fetchUser());
    }
  }, [dispatch, token, userState.id]);

  // Wrapper to update user info partially
  const updateUserInfo = (updates: Partial<UserState>) => {
    return dispatch(updateUser(updates));
  };

  // Clear user info from store
  const clearUserInfo = () => {
    dispatch(clearUser());
  };

  return {
    user: userState,
    loading: userState.loading,
    error: userState.error,
    fetchUser: () => dispatch(fetchUser()),
    updateUser: updateUserInfo,
    clearUser: clearUserInfo,
  };
}
