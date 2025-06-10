import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const useAuth = () => {
  const { isAuthenticated, roles, user, accessToken, status, error } = useSelector((state: RootState) => state.auth);
  return { isAuthenticated, roles, user, token: accessToken, status, error };
};
