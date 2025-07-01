import { Outlet } from "react-router";
import Navbar from "../components/general/Navbar";

const Home = () => {
    return (
        <div className="container mx-auto">
            <div id="global-toast-container" className="toast toast-top toast-end z-50" />
            <Navbar />
            <Outlet />
        </div>
    );
};

export default Home;