import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '@/App';
import Main from '@/pages/Main';
import Game from '@/pages/Game';
import NotFound from '@/pages/NotFound';
import Login from './pages/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, path: '/', element: <Main /> },
      { path: '/login', element: <Login /> },
      { path: '/login/:id', element: <Login /> },
      { path: '/game', element: <Game /> },
      { path: '/game/:id', element: <Game /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);