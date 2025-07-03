import { NavLink } from "react-router";
import { IoIosBook } from "react-icons/io";
import { FaMagnifyingGlassLocation, FaRegBookmark } from "react-icons/fa6";
import { useAuth } from "../../../context/useAuth";


const DashboardNav: React.FC = () => {
    const { user } = useAuth();

    const navItems = [
        {
            to: `/dashboard/${user?.id}/blogs`,
            label: "Blogs",
            icon: <IoIosBook className="text-2xl" />,
        },
        {
            to: `/dashboard/${user?.id}/travel-plans`,
            label: "Travel Plans",
            icon: <FaMagnifyingGlassLocation className="text-2xl" />,
        },
        {
            to: `/dashboard/${user?.id}/wishlists`,
            label: "Wishlists",
            icon: <FaRegBookmark className="text-2xl" />,
        },
    ];

    return (
        <div className="flex flex-row gap-8 justify-center text-xl">
            {navItems.map(({ to, label, icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                        `p-2 font-nunito font-bold hover:bg-gray-300 transition ${isActive ? "border-b-2 border-primary text-primary" : ""
                        }`
                    }
                >
                    <span className="flex gap-2 items-center">{icon}{label}</span>
                </NavLink>
            ))}
        </div>
    );
};

export default DashboardNav;