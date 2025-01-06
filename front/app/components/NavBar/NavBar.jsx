import { Link } from 'react-router';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaHome, FaShoppingCart, FaTachometerAlt, FaShoppingBag } from 'react-icons/fa';
import { GiSushis } from "react-icons/gi";
import { Tooltip } from 'react-tooltip';

export const NavBar = ({ collapsed, setCollapsed }) => {
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-2xl transition-all duration-300 ${collapsed ? 'w-24' : 'w-64'}`}>
      <div className="relative flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h2 className='h-9'>
          <span className={`${collapsed ? 'hidden' : 'text-2xl font-semibold'} transition-all duration-300`}>Tienda</span>
        </h2>
        <button
          onClick={toggleSidebar}
          className={`text-white bg-gray-700 hover:bg-gray-600 rounded p-2 absolute ${collapsed ? 'right-8' : 'right-3'}`}
          data-tooltip-content={collapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
          data-tooltip-id="toggle-tooltip"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
        <Tooltip id="toggle-tooltip" place="right" />
      </div>

      <ul className="mt-4 space-y-2">
        {/* <li>
          <Link
            to="/"
            className="flex items-center px-4 py-2 text-lg font-medium hover:bg-gray-700 transition-colors"
            data-tooltip-content="Ir a Home"
            data-tooltip-id="home-tooltip"
          >
            <FaHome className={`text-2xl ${collapsed ? 'mx-auto' : ''}`} />
            <span className={`${collapsed ? 'hidden' : 'ml-3'}`}>Inicio</span>
          </Link>
          <Tooltip id="home-tooltip" place="right" effect="solid" />
        </li> */}
        <li>
          <Link
            to="/products"
            className="flex items-center px-4 py-2 text-lg font-medium hover:bg-gray-700 transition-colors"
            data-tooltip-content="Ver productos"
            data-tooltip-id="products-tooltip"
          >
            <GiSushis className={`text-2xl ${collapsed ? 'mx-auto' : ''}`} />
            <span className={`${collapsed ? 'hidden' : 'ml-3'}`}>Productos disponibles</span>
          </Link>
          <Tooltip id="products-tooltip" place="right" effect="solid" />
        </li>
        <li>
          <Link
            to="/orders"
            className="flex items-center px-4 py-2 text-lg font-medium hover:bg-gray-700 transition-colors"
            data-tooltip-content="Mis pedidos"
            data-tooltip-id="orders-tooltip"
          > 
            <FaShoppingBag className={`text-2xl ${collapsed ? 'mx-auto' : ''}`} />
            <span className={`${collapsed ? 'hidden' : 'ml-3'}`}>Mis Pedidos</span>
          </Link>
          <Tooltip id="orders-tooltip" place="right" effect="solid" />
        </li>
      </ul>
    </div>
  );
};