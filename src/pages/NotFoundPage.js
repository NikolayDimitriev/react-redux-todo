import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("login");
  }, []);
  return null;
}
