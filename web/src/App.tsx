import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { RequireAuth } from "./routes/RequireAuth";
import { RequireRole } from "./routes/RequireRole";
import { AuthProvider } from "./store/auth/AuthProvider";
import { ClientLayout } from "./pages/client/ClientLayout";
import { ClientTicketsPage } from "./pages/client/ClientTicketsPage";
import { ClientTicketDetailPage } from "./pages/client/ClientTicketDetailPage";
import { ClientNewTicketPage } from "./pages/client/ClientNewTicketPage";
import { ClientProfileRoute } from "./pages/client/ClientProfileRoute";
import { ClientChangePasswordRoute } from "./pages/client/ClientChangePasswordRoute";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { TechLayout } from "./pages/tech/TechLayout";
import { TechTicketsPage } from "./pages/tech/TechTicketsPage";
import { TechTicketDetailPage } from "./pages/tech/TechTicketDetailPage";
import { TechProfileRoute } from "./pages/tech/TechProfileRoute";
import { TechChangePasswordRoute } from "./pages/tech/TechChangePasswordRoute";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminTicketsPage } from "./pages/admin/AdminTicketsPage";
import { AdminTicketDetailPage } from "./pages/admin/AdminTicketDetailPage";
import { AdminServicesPage } from "./pages/admin/AdminServicesPage";
import { AdminTechniciansPage } from "./pages/admin/AdminTechniciansPage";
import { AdminTechnicianProfilePage } from "./pages/admin/AdminTechnicianProfilePage";
import { AdminClientsPage } from "./pages/admin/AdminClientsPage";
import { RouteErrorPage } from "./routes/RouteErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: "/admin",
    element: (
      <RequireAuth>
        <RequireRole roles={["ADMIN"]}>
          <AdminLayout />
        </RequireRole>
      </RequireAuth>
    ),
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/admin/tickets" replace /> },
      { path: "tickets", element: <AdminTicketsPage /> },
      { path: "tickets/:ticketId", element: <AdminTicketDetailPage /> },
      { path: "services", element: <AdminServicesPage /> },
      { path: "technicians", element: <AdminTechniciansPage /> },
      {
        path: "technicians/:technicianId",
        element: <AdminTechnicianProfilePage />,
      },
      { path: "clients", element: <AdminClientsPage /> },
    ],
  },
  {
    path: "/tech",
    element: (
      <RequireAuth>
        <RequireRole roles={["TECH"]}>
          <TechLayout />
        </RequireRole>
      </RequireAuth>
    ),
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/tech/tickets" replace /> },
      { path: "tickets", element: <TechTicketsPage /> },
      { path: "tickets/:ticketId", element: <TechTicketDetailPage /> },
      { path: "profile", element: <TechProfileRoute /> },
      { path: "profile/password", element: <TechChangePasswordRoute /> },
    ],
  },
  {
    path: "/client",
    element: (
      <RequireAuth>
        <RequireRole roles={["CLIENT"]}>
          <ClientLayout />
        </RequireRole>
      </RequireAuth>
    ),
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/client/tickets" replace /> },
      { path: "tickets", element: <ClientTicketsPage /> },
      { path: "tickets/new", element: <ClientNewTicketPage /> },
      { path: "tickets/:ticketId", element: <ClientTicketDetailPage /> },
      { path: "profile", element: <ClientProfileRoute /> },
      { path: "profile/password", element: <ClientChangePasswordRoute /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
