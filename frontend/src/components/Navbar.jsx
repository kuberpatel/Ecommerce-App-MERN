import React, { useState, useContext, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'

function Navbar() {
  const [visible, setVisible] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  
  const navigate = useNavigate()
  const { setToken, setCartItems, token, getCartCount, products } = useContext(ShopContext)

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setSearchResults([])
      return
    }

    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.subCategory.toLowerCase().includes(query.toLowerCase())
    )
    setSearchResults(filtered)
  }

  const handleSearchItemClick = (productId) => {
    setShowSearch(false)
    setSearchQuery('')
    setSearchResults([])
    navigate(`/products/${productId}`)
  }

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }

  // Close search results if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSearch(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        <NavLink to="/collection" className="hover:text-black transition-colors">
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
        {/* Search icon and search bar */}
        <div className="search-container relative">
          <div className="flex items-center">
            <img
              src={assets.search_icon}
              className="w-6 h-6 cursor-pointer transition-all duration-300"
              alt="search"
              onClick={() => setShowSearch(!showSearch)}
            />
            {showSearch && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search products..."
                className="ml-2 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                autoFocus
              />
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearch && searchResults.length > 0 && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto z-50">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleSearchItemClick(product._id)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b"
                >
                  <img 
                    src={product.image[0]} 
                    alt={product.name} 
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
                <Link to="/profile" className="cursor-pointer hover:text-black">
                  My Profile
                </Link>
                <Link to="/order" className="cursor-pointer hover:text-black">
                  Orders
                </Link>
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
