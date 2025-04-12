import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'

const SearchBar = ({ showSearch, setShowSearch }) => {
  const { products } = useContext(ShopContext)
  const [search, setSearch] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])

  // Debouncing logic for search input
  useEffect(() => {
    if (search.length > 0) {
      const timeout = setTimeout(() => {
        // Filter products based on the search query
        const results = products.filter(
          product => product.name.toLowerCase().includes(search.toLowerCase()), // Case-insensitive search
        )
        setFilteredProducts(results)
      }, 500) // Delay search action for better UX (debouncing)

      return () => clearTimeout(timeout) // Cleanup on search change
    } else {
      setFilteredProducts([]) // Clear results when search is empty
    }
  }, [search, products])

  return (
    <>
      {/* Search bar */}
      {showSearch && (
        <div className="border-t border-b bg-gray-50 text-center">
          <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 outline-none bg-inherit text-sm"
              type="text"
              placeholder="Search products..."
            />
          </div>
          <img
            onClick={() => setShowSearch(false)} // Close the search bar on click
            className="inline w-3 cursor-pointer"
            src="/assets/cross_icon.png" // Assuming cross icon is in assets
            alt="Close Icon"
          />
        </div>
      )}

      {/* Show search results */}
      {search && filteredProducts.length > 0 && (
        <div className="search-results">
          <div className="text-center text-xl py-3">Search Results</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-6">
            {filteredProducts.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
              />
            ))}
          </div>
        </div>
      )}

      {/* No results found message */}
      {search && filteredProducts.length === 0 && (
        <div className="text-center py-4">
          <p>
            No products found for "<strong>{search}</strong>"
          </p>
        </div>
      )}
    </>
  )
}

export default SearchBar
