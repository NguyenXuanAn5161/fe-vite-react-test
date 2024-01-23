import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Footer from "./components/Footer/index";
import Header from "./components/Header/index";
import HomePage from "./components/Home";
import BookPage from "./pages/book";
import ContactPage from "./pages/contact";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register/index";
import { doGetAccountAction } from "./redux/account/accountSlice";
import { callFetchAccount } from "./services/api";

const Layout = () => {
  const dispatch = useDispatch();
  const getAccount = async () => {
    const res = await callFetchAccount();
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data));
    }
  };
  useEffect(() => {
    getAccount();
  }, []);

  return (
    <div className="layout-app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <div>404 not found</div>,
      children: [
        { index: true, element: <HomePage /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "book",
          element: <BookPage />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
