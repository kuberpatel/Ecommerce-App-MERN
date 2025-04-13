// App.jsx
import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify'
import Verify from './pages/Verify'
import ProtectedRoute from './components/ProtectedRoute'
import { ShopContext } from './context/ShopContext'
import 'react-toastify/dist/ReactToastify.css'
import Profile from './pages/Profile'

export const backendUrl = 'http://your-backend-url.com' // Define backend URL here

function App() {
  const { token } = useContext(ShopContext)

  return (
    <div className="px-4 sm:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      {token && <Navbar />}
      {token && <SearchBar />}
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={token ? <Navigate to="/" replace /> : <Login />} 
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collection"
          element={
            <ProtectedRoute>
              <Collection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:productId"
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/place-order"
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verify"
          element={
            <ProtectedRoute>
              <Verify />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch all route - redirect to login if not authenticated, home if authenticated */}
        <Route 
          path="*" 
          element={token ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} 
        />
      </Routes>
      {token && <Footer />}
    </div>
  )
}

export default App
