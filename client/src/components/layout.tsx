
import { Outlet } from "react-router-dom";
import Header from "./partials/Header";
import Footer from "./partials/Footer";

const Layout = () => {
  return (
    <div>
      <Header />

      <main className="p-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
