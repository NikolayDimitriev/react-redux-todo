import { useSelector } from "react-redux";

export function useAuth() {
  const user = useSelector((state) => state.user);

  return {
    isAuth: user ? !!user.email : null,
    email: user ? user.email : null,
    token: user ? user.token : null,
    id: user ? user.id : null,
  };
}
