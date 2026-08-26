import { createBrowserRouter, Navigate } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { Dashboard } from "./components/Dashboard";
import { DocumentosPage } from "./components/DocumentosPage";
import { ValidacaoPage } from "./components/ValidacaoPage";
import { NotFoundPage } from "./components/NotFoundPage";
import { LoginPage } from "./components/LoginPage";
import { LoginLayout } from "./components/LoginLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginLayout,
    children: [{ index: true, Component: LoginPage }],
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "documentos", Component: DocumentosPage },
      { path: "validacao", Component: ValidacaoPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
