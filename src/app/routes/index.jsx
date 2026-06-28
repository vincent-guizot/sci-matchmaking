import { createBrowserRouter, Navigate } from "react-router-dom";

import Layout from "../../layouts/Layout";
import Members from "../../pages/Members";
import MatchMaking from "../../pages/MatchMaking";
import Matches from "../../pages/Matches";
import ParticipantsLiked from "../../pages/ParticipantsLiked";
import MostLiked from "../../pages/MostLiked";
import AddPage from "../../pages/admin/AddPage";
import ListPage from "../../pages/admin/ListPage";
import Login from "../../pages/auth/Login";

// Guard — redirect ke /login kalau belum login
const ProtectedLayout = () => {
  const isAuth = localStorage.getItem("sci_auth");
  if (!isAuth) return <Navigate to="/login" replace />;
  return <Layout />;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Members />,
      },
      {
        path: "matchmaking",
        element: <MatchMaking />,
      },
      {
        path: "matches",
        element: <Matches />,
      },
      {
        path: "participants-liked",
        element: <ParticipantsLiked />,
      },
      {
        path: "most-liked",
        element: <MostLiked />,
      },
      {
        path: "admin",
        children: [
          {
            path: "add",
            element: <AddPage />,
          },
          {
            path: "list",
            element: <ListPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
