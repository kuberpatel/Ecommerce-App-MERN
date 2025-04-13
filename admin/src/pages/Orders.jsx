import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [deletingOrder, setDeletingOrder] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const orderStatuses = [
    'Order Placed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Refund Pending',
    'Refunded'
  ]

  const fetchAllOrders = async () => {
    if (!token) return
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      )
      if (response.data.success) {
        setOrders([...response.data.orders].reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return
    }

    setDeletingOrder(orderId)
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/delete`,
        { orderId },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success('Order deleted successfully')
        await fetchAllOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      toast.error('Failed to delete order')
    } finally {
      setDeletingOrder(null)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(orderId)
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Order status updated successfully')
        await fetchAllOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus)

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Order Management</h3>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">All Orders</option>
          {orderStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <div 
            key={order._id} 
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            {/* Order Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold">Order ID: {order._id}</h4>
                <p className="text-sm text-gray-600">
                  Date: {new Date(order.date).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Customer: {order.address.firstName} {order.address.lastName}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{currency}{order.amount}</p>
                <p className={`text-sm ${order.payment ? 'text-green-600' : 'text-orange-600'}`}>
                  {order.payment ? 'Paid' : 'Payment Pending'}
                </p>
                <p className="text-sm">Method: {order.paymentMethod}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4 mb-4">
              <h5 className="font-medium">Order Items:</h5>
              <div className="grid gap-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded">
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
                      <p className="text-sm text-gray-600">
                        Price: {currency}{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-4">
              <h5 className="font-medium mb-2">Shipping Address:</h5>
              <div className="text-sm text-gray-600">
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                <p>{order.address.country}</p>
                <p>Phone: {order.address.phone}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center gap-4">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  disabled={updatingStatus === order._id}
                  className="p-2 border rounded-md"
                >
                  {orderStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                {updatingStatus === order._id && (
                  <span className="text-sm text-gray-500">Updating...</span>
                )}
              </div>

              <button
                onClick={() => handleDeleteOrder(order._id)}
                disabled={deletingOrder === order._id}
                className={`px-4 py-2 rounded-md text-sm ${
                  deletingOrder === order._id
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {deletingOrder === order._id ? 'Deleting...' : 'Delete Order'}
              </button>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found for the selected status.
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
