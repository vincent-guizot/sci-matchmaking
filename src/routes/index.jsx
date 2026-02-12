import { createBrowserRouter } from "react-router-dom";

import Layout from "../layouts/Layout";
import Members from "../pages/Members";
import MatchMaking from "../pages/MatchMaking";
import Matches from "../pages/Matches";
import ParticipantsLiked from "../pages/ParticipantsLiked";

// ⬇️ import page admin (buat dulu filenya kalau belum ada)
import AdminAdd from "../pages/admin/AdminAdd";
import AdminList from "../pages/admin/AdminList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true, // pengganti path "/"
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

      // ✅ ADMIN ROUTES
      {
        path: "admin",
        children: [
          {
            path: "add",
            element: <AdminAdd />,
          },
          {
            path: "list",
            element: <AdminList />,
          },
        ],
      },
    ],
  },
]);

export default router;
