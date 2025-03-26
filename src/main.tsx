import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "@/App";
import Main from "@/pages/Main";
import Game from "@/pages/Game";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import User from "@/pages/User";
import PostDetail from "@/pages/PostDetail";
import PostWrite from "@/pages/PostWrite";
import PostEdit from "@/pages/PostEdit";
import Post from "@/pages/Post";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, path: "/", element: <Main /> },
      { path: "/login", element: <Login /> },
      { path: "/login/:id", element: <Login /> },
      { path: "/game", element: <Game /> },
      { path: "/game/:id", element: <Game /> },
      { path: "/profile", element: <Profile /> },
      { path: "/user/:uid", element: <User /> },
      { path: "/post/:postId", element: <PostDetail /> },
      { path: "/post/write", element: <PostWrite /> },
      { path: "/post/edit/:postId", element: <PostEdit /> },
      { path: "/posts/all", element: <Post /> }
    ]
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
