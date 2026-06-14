import { Outlet, Navigate } from "react-router";
import { useUsuario } from "../context/AppContext";
import { Toaster } from "./ui/sonner";

export function LoginLayout() {
  const usuario = useUsuario();
  if (usuario) return <Navigate to="/" replace />;
  return (
    <>
      <Outlet />
      <Toaster position="top-right" />
    </>
  );
}
