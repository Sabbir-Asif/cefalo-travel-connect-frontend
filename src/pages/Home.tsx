import { Outlet } from "react-router";
import Navbar from "../components/general/Navbar";

const Home = () => {
    return (
        <div className="container mx-auto">
            <Navbar />
            <Outlet />
        </div>
    );
};

export default Home;