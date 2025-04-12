import React, { useState, useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'

function Navbar() {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const { setToken, setCartItems, token, getCartCount } =
    useContext(ShopContext)

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }

  return (
    <div className="relative flex items-center justify-between py-4 px-6 bg-white shadow-md fixed w-full z-50">
      <Link to="/" className="flex items-center">
        <img src={assets.logo} className="w-40" alt="logo" />
      </Link>

      {/* Main Navigation Links */}
      <ul className="hidden sm:flex gap-8 text-sm text-gray-800">
        <NavLink to="/" className="hover:text-black transition-colors">
          Home
        </NavLink>
        <NavLink
          to="/collection"
          className="hover:text-black transition-colors"
        >
          Collection
        </NavLink>
        <NavLink to="/about" className="hover:text-black transition-colors">
          About
        </NavLink>
        <NavLink to="/contact" className="hover:text-black transition-colors">
          Contact
        </NavLink>
      </ul>

      {/* Right side icons (Profile, Cart, Search icon) */}
      <div className="flex items-center gap-6">
        {/* Search icon */}
        <img
          src={assets.search_icon}
          className="w-6 h-6 cursor-pointer transition-all duration-300"
          alt="search"
        />

        {/* Profile icon and dropdown */}
        <div className="group relative">
          <img
            className="w-6 cursor-pointer"
            src={assets.profile_icon}
            alt="profile"
          />
          {token && (
            <div className="group-hover:block hidden absolute right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 px-5 py-3 bg-gray-100 text-gray-700 rounded shadow-md">
                <p className="cursor-pointer hover:text-black">My Profile</p>
                <p
                  onClick={() => navigate('/order')}
                  className="cursor-pointer hover:text-black"
                >
                  Orders
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cart icon */}
        <Link to="/cart" className="relative">
          <img
            src={assets.cart_icon}
            className="w-6 cursor-pointer"
            alt="cart"
          />
          <p className="absolute right-[-5px] top-[-5px] w-5 h-5 text-center leading-4 bg-black text-white aspect-square rounded-full text-xs">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile menu icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-6 cursor-pointer sm:hidden"
          alt="menu"
        />
      </div>

      {/* Sidebar menu for small screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-200"
          >
            <img
              className="h-4 rotate-180"
              src={assets.dropdown_icon}
              alt="back"
            />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b hover:bg-gray-100"
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b hover:bg-gray-100"
            to="/collection"
          >
            Collection
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b hover:bg-gray-100"
            to="/about"
          >
            About
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b hover:bg-gray-100"
            to="/contact"
          >
            Contact
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Navbar
