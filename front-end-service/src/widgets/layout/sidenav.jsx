import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import antaresLogo from "/img/logo/logo_antares.svg";
import { useNavigate } from "react-router-dom";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      // Clear the token or any user data from local storage/session storage
      localStorage.removeItem('token'); // or sessionStorage.removeItem('token');

      // Optionally, reset any application state related to authentication here if you're using context or state management

      // Redirect to the login page
      navigate('/auth/sign-in'); // Adjust the route to your login page
    }
  };

  return (
    <aside
      className={`bg-main ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 h-full w-72 rounded-none transition-transform duration-300 xl:translate-x-0 `}
    >
      <div
        className={`relative`}
      >
        <Link to="/" className="py-6 px-8 text-center justify-center">
          <img src={antaresLogo} alt="alternative" className="mx-auto my-2 md:my-5"/>
          <Typography
            variant="h6"
            color={"white"}
          >
            {brandName}
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4">
        {routes.map(({ layout, title, pages, style }, key) => (
          <ul key={key} className={style + " mb-4 flex flex-col gap-1"}>
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path, style='' }) => (
              <li key={name} className={style}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "bg-orange-700" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "orange"
                          ? "white"
                          : "bg-orange-400"
                      }
                     
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      <div className="text-gray-300">
                        {icon}
                      </div>
                      
                      <Typography
                        className="font-medium capitalize text-gray-300"
                      >
                        {name}
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}
        <Button className="w-full bg-gray-500" onClick={handleLogout}>
          <Typography className="text-base capitalize font-medium">
            Log Out
          </Typography>
        </Button>
      </div>
      
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "ANTARES DEVICE MANAGEMENT",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
