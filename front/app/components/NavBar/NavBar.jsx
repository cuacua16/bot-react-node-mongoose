import { Link } from 'react-router';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaHome, FaInfoCircle, FaTachometerAlt } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

export const NavBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 ${collapsed ? 'w-24' : 'w-64'}`}
    >
      <div className="relative flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h2 className={`${collapsed ? 'hidden' : 'text-lg font-semibold'} transition-all duration-300`}>
          Pedidos
        </h2>
        <button
          onClick={toggleSidebar}
          className="text-white bg-gray-700 hover:bg-gray-600 rounded p-1"
          data-tooltip-content={collapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
          data-tooltip-id="toggle-tooltip"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
        <Tooltip id="toggle-tooltip" place="right" />
      </div>

      {/* Links */}
      <ul className="mt-4 space-y-2">
        <li>
          <Link
            to="/"
            className="flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
            data-tooltip-content="Ir a Home"
            data-tooltip-id="home-tooltip"
          >
            <FaHome className={`text-lg ${collapsed ? 'mx-auto' : ''}`} />
            <span className={`${collapsed ? 'hidden' : 'ml-3'}`}>Home</span>
          </Link>
          <Tooltip id="home-tooltip" place="right" effect="solid" />
        </li>
        <li>
          <Link
            to="/products"
            className="flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
            data-tooltip-content="Ver productos"
            data-tooltip-id="products-tooltip"
          >
            <FaInfoCircle className={`text-lg ${collapsed ? 'mx-auto' : ''}`} />
            <span className={`${collapsed ? 'hidden' : 'ml-3'}`}>Productos disponibles</span>
          </Link>
          <Tooltip id="products-tooltip" place="right" effect="solid" />
        </li>
        <li>
          <Link
            to="/orders"
            className="flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
            data-tooltip-content="Mis pedidos"
            data-tooltip-id="orders-tooltip"
          >
            <FaTachometerAlt className={`text-lg ${collapsed ? 'mx-auto' : ''}`} />
            <span className={`${collapsed ? 'hidden' : 'ml-3'}`}>Mis Pedidos</span>
          </Link>
          <Tooltip id="orders-tooltip" place="right" effect="solid" />
        </li>
      </ul>
    </div>
  );
};