import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/login";

const Layout = () => {
  return <div>main page</div>;
};

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <div>404 not found</div>,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
