import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function Profile() {
  const { backendUrl, token } = useContext(ShopContext)
  const [userDetails, setUserDetails] = useState(null)
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (response.data.success) {
          setUserDetails(response.data.user)
        }
      } catch (error) {
        console.error('Error fetching user details:', error)
        toast.error('Failed to load user details')
      }
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/order/userorders`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (response.data.success) {
          setOrders(response.data.orders)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to load orders')
      }
    }

    Promise.all([fetchUserDetails(), fetchOrders()])
      .finally(() => setIsLoading(false))
  }, [token])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl mb-4">Loading profile...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* User Details Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">My Profile</h2>
        {userDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{userDetails.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{userDetails.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Recent Orders</h2>
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order._id} 
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-medium">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.amount}</p>
                  <p className={`text-sm ${
                    order.payment ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {order.payment ? 'Paid' : 'Payment Pending'}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img 
                      src={item.image[0]} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Size: {item.size} | Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Status */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm">
                  Status: <span className="font-medium">{order.status}</span>
                </p>
                <p className="text-sm">
                  Payment Method: <span className="font-medium">{order.paymentMethod}</span>
                </p>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <p className="text-center text-gray-600">No orders found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile 