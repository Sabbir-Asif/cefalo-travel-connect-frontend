import type React from "react";
import { useAuth } from "../../context/useAuth";
import { IoIosSend } from "react-icons/io";
import { RiUserReceived2Fill } from "react-icons/ri";
import { NavLink } from "react-router";

const RequestPageNav: React.FC = () => {
    const { user } = useAuth();
    const navItems = [
        {
            to: `/dashboard/${user?.id}/requests/sent`,
            label: "Sent",
            icon: <IoIosSend className="text-2xl" />
        },
        {
            to: `/dashboard/${user?.id}/requests/recieved`,
            label: "Received",
            icon: <RiUserReceived2Fill className="text-2xl" />
        }
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

export default RequestPageNav;