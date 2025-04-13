import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function Login() {
  const [currentState, setCurrentState] = useState('Login')
  const { setToken, navigate, backendUrl, token } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const OnSubmitHandler = async event => {
    event.preventDefault()
    setIsLoading(true)
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          toast.success('Registration successful!')
          navigate('/')
        } else {
          toast.error(response.data.message)
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          toast.success('Login successful!')
          navigate('/')
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={OnSubmitHandler}
        className="bg-white p-8 rounded-lg shadow-md w-[90%] sm:max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">
            {currentState}
          </h2>
          <p className="text-gray-600 mt-2">
            {currentState === 'Login'
              ? 'Welcome back! Please login to your account.'
              : 'Create an account to get started.'}
          </p>
        </div>

        {currentState === 'Sign Up' && (
          <div className="mb-4">
            <input
              onChange={e => setName(e.target.value)}
              value={name}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <input
            onChange={e => setEmail(e.target.value)}
            value={email}
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            required
          />
        </div>

        <div className="mb-6">
          <input
            onChange={e => setPassword(e.target.value)}
            value={password}
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors
            ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Please wait...' : currentState}
        </button>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            {currentState === 'Login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentState('Sign Up')}
                  className="text-blue-600 hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentState('Login')}
                  className="text-blue-600 hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login
