import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import { useNavigate } from 'react-router-dom'

const BestSeller = () => {
  const { products } = useContext(ShopContext)
  const [bestseller, setBestSeller] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (products.length > 0) {
      const bestProduct = products.filter(item => item.bestseller)
      setBestSeller(bestProduct.slice(0, 5))
      setLoading(false)
    }
  }, [products])

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title
          text1={'BEST'}
          text2={<span className="text-purple-600">SELLERS</span>}
        />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our bestsellers! Shop the most loved and trending products,
          handpicked just for you. Quality and style guaranteed!
        </p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading best sellers...</p>
      ) : bestseller.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No best sellers found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {bestseller.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default BestSeller
