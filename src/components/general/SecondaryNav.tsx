import { NavLink } from "react-router";
import { IoIosBook } from "react-icons/io";
import { FaMagnifyingGlassLocation, FaRegBookmark } from "react-icons/fa6";
import { CiHome } from "react-icons/ci";

const navItems = [
  {
    to: '/',
    label: "Home",
    icon: <CiHome className="text-2xl" />
  },
  {
    to: "/blogs",
    label: "Blogs",
    icon: <IoIosBook className="text-2xl" />,
  },
  {
    to: "/travel-places",
    label: "Travel Places",
    icon: <FaMagnifyingGlassLocation className="text-2xl" />,
  },
  {
    to: "/wishlists",
    label: "Wishlists",
    icon: <FaRegBookmark className="text-2xl" />,
  },
];

const SecondaryNav: React.FC = () => {
  return (
    <div className="flex flex-row gap-8 justify-center text-xl">
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `p-2 font-nunito font-bold hover:bg-gray-300 transition ${
              isActive ? "border-b-2 border-primary text-primary" : ""
            }`
          }
        >
          <span className="flex gap-2 items-center">{icon}{label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default SecondaryNav;
