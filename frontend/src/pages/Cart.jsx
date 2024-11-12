import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate, token } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if (products.length > 0 && Object.keys(cartItems).length > 0) {
      const tempData = []
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            tempData.push({
              _id: itemId,
              size: size,
              quantity: cartItems[itemId][size],
            })
          }
        }
      }
      setCartData(tempData)
      setLoading(false)
    }
  }, [cartItems, products, token])


  return (
    <div className='border-t pt-14 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>
      {loading ? (
        <div className='text-gray-500 flex flex-col justify-center items-center h-[350px]'>
          <p className='text-3xl'>Loading your cart...</p>
        </div>
      ) : (
        <div>
          {cartData.length === 0 ? (
            <div className='text-gray-500 flex flex-col justify-center items-center h-[350px]'>
              <p className='text-3xl'>Your cart is empty... ☹ </p>
              <p className='text-2xl'>Go to the 'Collections' page and add some products!</p>
            </div>
          ) : (
            cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id)
              return (
                <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                  <div className='flex items-start gap-6'>
                    <img src={productData.image[0]} className='w-16 sm:w-20' alt="" />
                    <div>
                      <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                      <div className='flex items-center gap-5 mt-2'>
                        <p>{currency}{productData.price}</p>
                        <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                      </div>
                    </div>
                  </div>
                  <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min={1} defaultValue={item.quantity} />
                  <img onClick={() => updateQuantity(item._id, item.size, 0)} src={assets.bin_icon} className='w-4 mr-4 sm:w-5 cursor-pointer' alt="" />
                </div>
              )
            })
          )}
        </div>
      )}
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
    </div>
  )
  
}

export default Cart
