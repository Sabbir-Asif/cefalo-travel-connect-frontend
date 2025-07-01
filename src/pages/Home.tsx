import { Outlet } from "react-router";
import Navbar from "../components/general/Navbar";

const Home = () => {
    return (
        <div className="container mx-auto max-w-6xl space-y-12 mt-4">
            <div id="global-toast-container" className="toast toast-top toast-end z-50" />
            <Navbar />
            <Outlet />
        </div>
    );
};

export default Home;