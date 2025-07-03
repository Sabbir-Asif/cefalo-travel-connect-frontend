import { Outlet, useLocation } from "react-router";
import Navbar from "../components/general/Navbar";
import SecondaryNav from "../components/general/SecondaryNav";

const Home = () => {
    const { pathname } = useLocation();
    return (
        <div className="container mx-auto max-w-6xl space-y-12 mt-4">
            <div id="global-toast-container" className="toast toast-top toast-end z-50" />
            <Navbar />
            <div>
                {pathname === '/' && (
                    <h2 className="text-5xl font-bold text-center">Where to?</h2>
                )}
            </div>
            <SecondaryNav />
            <Outlet />
        </div>
    );
};

export default Home;