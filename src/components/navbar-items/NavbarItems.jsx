import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DropdownButton from 'components/ux/dropdown-button/DropdownButton';
import { AuthContext } from 'contexts/AuthContext';


const NavbarItems = ({ onHamburgerMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    // Use the context's logout function to clear auth state immediately
    logout();
    navigate('/login');
  };

  const dropdownOptions = [
    { name: 'Profile', onClick: () => navigate('/user-profile') },
    { name: 'Bookings', onClick: () => navigate('/user-profile') },
    { name: 'Logout', onClick: handleLogout },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <li className="p-4 hover:bg-brand-hover">
        <Link
          to="/"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/') && 'active-link'}`}
          onClick={onHamburgerMenuToggle}
        >
          Home
        </Link>
      </li>
      <li className="p-4 hover:bg-brand-hover">
        <Link
          to="/hotels"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/hotels') && 'active-link'}`}
          onClick={onHamburgerMenuToggle}
        >
          Hotels
        </Link>
      </li>
      <li className="p-4 hover:bg-brand-hover">
        <Link
          to="/about-us"
          className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/about-us') && 'active-link'}`}
          onClick={onHamburgerMenuToggle}
        >
          About us
        </Link>
      </li>
      <li className={`${!isAuthenticated && 'p-4 hover:bg-brand-hover'}`}>
        {isAuthenticated ? (
          <DropdownButton triggerType="click" options={dropdownOptions} />
        ) : (
          <Link
            to="/login"
            className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/login') && 'active-link'}`}
            onClick={onHamburgerMenuToggle}
          >
            Login/Register
          </Link>
        )}
      </li>
    </>
  );
};

export default NavbarItems;