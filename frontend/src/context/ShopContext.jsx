import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

// Create the context outside of the provider component
export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  const currency = '$';
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token,setToken] = useState('');
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false)

  const addToCart = async (itemId, size) => {
    if(!size){
      toast.error('Select Product Size');
      return;
    }
    let cartData = JSON.parse(JSON.stringify(cartItems));
    
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }
    
    if (cartData[itemId][size]) {
      cartData[itemId][size] += 1;
    } else {
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`, 
          {itemId, size}, 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalCount += cartItems[items][item];
        }
      }
    }
    return totalCount;
  }

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = JSON.parse(JSON.stringify(cartItems));
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
    if(token){
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`, 
          {itemId, size, quantity}, 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  }

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = products.find((product) => product._id === items);
      if (!itemInfo) continue;
      
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.error("Error calculating cart amount:", error);
        }
      }
    }
    return totalAmount;
  }

  const getProductData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`)
      if(response.data.success){
        setProducts(response.data.products)
      }else{
        toast.error(response.data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      
    }
  }

  const getUserCart = async (savedToken) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { 
          headers: { 
            Authorization: `Bearer ${savedToken}`
          }
        }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error loading cart');
    }
  };

  useEffect(()=>{
    getProductData()
  },[])

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    }
  }, [token])

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    setCartItems,
  }

  if (!isInitialized) {
    return <div>Loading...</div>
  }

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
