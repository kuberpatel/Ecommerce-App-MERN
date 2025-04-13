import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Verify = () => {
  const [searchParams] = useSearchParams()
  const success = searchParams.get('success')
  const orderId = searchParams.get('orderId')
  const [isLoading, setIsLoading] = useState(true)
  const [verificationAttempted, setVerificationAttempted] = useState(false)

  const navigate = useNavigate()
  const { token, setCartItems, backendUrl } = useContext(ShopContext)

  const verifyPayment = async (currentToken) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/verifyStripe`,
        { 
          success, 
          orderId
        },
        { 
          headers: { 
            Authorization: `Bearer ${currentToken}` 
          }
        }
      )

      if (response.data.success) {
        setCartItems({})
        toast.success('Payment successful!')
        navigate('/order')
      } else {
        toast.error('Payment verification failed')
        navigate('/cart')
      }
    } catch (error) {
      console.error('Verification error:', error)
      toast.error('Payment verification failed')
      navigate('/cart')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Only attempt verification if we haven't tried yet and have a token
    if (!verificationAttempted && token && success && orderId) {
      setVerificationAttempted(true)
      verifyPayment(token)
    }
  }, [token, verificationAttempted])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl mb-4">Verifying your payment...</h2>
        <p className="text-gray-600">Please wait while we confirm your payment.</p>
      </div>
    </div>
  )
}

export default Verify
