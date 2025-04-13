import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import Stripe from 'stripe'
import dotenv from 'dotenv'
import razorpay from 'razorpay'

// load .env config
dotenv.config()

// money settings
const currency = 'usd'
const deliveryCharge = 10

// gateway setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// place order using COD
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body

    // create order data
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'COD',
      payment: false,
      date: Date.now(),
    }

    // save order
    const newOrder = new orderModel(orderData)
    await newOrder.save()

    // clear user cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} })

    res.json({ success: true, message: 'Order Placed' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// place order using stripe
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body
    const { origin } = req.headers

    // order details
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'Stripe',
      payment: false,
      date: Date.now(),
    }

    // save order in db
    const newOrder = new orderModel(orderData)
    await newOrder.save()

    // prepare stripe items
    const line_items = items.map(item => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }))

    // add delivery charge
    line_items.push({
      price_data: {
        currency,
        product_data: {
          name: 'Delivery Charges',
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    })

    // create stripe session
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
      metadata: {
        orderId: newOrder._id.toString(),
        userId: userId
      }
    })

    res.json({ success: true, session_url: session.url })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body
  const userId = req.body.userId // This comes from auth middleware

  try {
    // First check if the order exists and hasn't been verified already
    const order = await orderModel.findById(orderId)
    if (!order) {
      return res.json({ 
        success: false, 
        message: 'Order not found' 
      })
    }

    // If already verified, return success
    if (order.payment === true) {
      return res.json({ 
        success: true, 
        message: 'Payment already verified' 
      })
    }

    if (success === 'true') {
      // Update order status
      await orderModel.findByIdAndUpdate(orderId, { 
        payment: true,
        status: 'Payment Confirmed'
      })
      
      // Clear user's cart
      await userModel.findByIdAndUpdate(userId, { 
        cartData: {} 
      })
      
      res.json({ 
        success: true, 
        message: 'Payment verified successfully' 
      })
    } else {
      // If payment failed, mark the order as failed
      await orderModel.findByIdAndUpdate(orderId, { 
        status: 'Payment Failed' 
      })
      
      res.json({ 
        success: false, 
        message: 'Payment verification failed' 
      })
    }
  } catch (error) {
    console.error('Stripe verification error:', error)
    res.json({ 
      success: false, 
      message: 'Payment verification failed' 
    })
  }
}

// place order using razorpay 
const placeOrderRazorpay = async (req, res) => {
   try {
       const { userId, items, amount, address } = req.body

       // order details
       const orderData = {
         userId,
         items,
         address,
         amount,
         paymentMethod: 'Razorpay',
         payment: false,
         date: Date.now(),
       }

       // save order in db
       const newOrder = new orderModel(orderData)
       await newOrder.save()

       const options = {
        amount: amount * 100,
        currency: currency.toUpperCase(),
        receipt: newOrder._id.toString
       }

       await razorpayInstance.orders.create(options, (error,order)=>{
        if (error) {
          console.log(error)
          return res.json({success:false, message: error})
          
        }
        res.json({success:true,order})


       })
    
   } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })

    
   }
}

// verify razorpay payment
const verifyRazorpay =  async (req,res) => {
  try {
    const { userId, razorpay_order_id} = req.body
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
    if (orderInfo.status === 'paid') {
      await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
      await userModel.findByIdAndUpdate(userId,{cartData:{}})
      res.json({success: true,message: "payment Successful"})
      
    }else{
      res.json({success: false,message: "Payment Failed"})
    }
    
  } catch (error) {
    
     console.log(error)
     res.json({ success: false, message: error.message })
  }
}


// get all orders for admin
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
    res.json({ success: true, orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// get user orders
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body
    const orders = await orderModel.find({ userId })
    res.json({ success: true, orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// update order status from admin
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body
    await orderModel.findByIdAndUpdate(orderId, { status })
    res.json({ success: true, message: 'Status updated' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Update the deleteOrder function
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found"
      });
    }

    // Optional: Add additional checks before deletion
    // For example, prevent deletion of delivered orders older than X days
    const orderDate = new Date(order.date);
    const daysSinceOrder = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (order.status === "Delivered" && daysSinceOrder > 30) {
      return res.json({
        success: false,
        message: "Cannot delete orders that were delivered more than 30 days ago"
      });
    }

    // If payment was made, ensure proper status before deletion
    if (order.payment && !["Refunded", "Cancelled"].includes(order.status)) {
      return res.json({
        success: false,
        message: "Paid orders must be refunded or cancelled before deletion"
      });
    }

    await orderModel.findByIdAndDelete(orderId);

    res.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// exports
export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
  deleteOrder
}
