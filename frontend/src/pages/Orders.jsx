import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext)
  const [orderData, setOrderData] = useState([])
  const [loading, setLoading] = useState(true)

  const LoadingModal = ({ isLoading }) => {
    if (!isLoading) {
      return null
    }
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-5 rounded shadow-md flex flex-col items-center justify-center">
          <div className="loader mb-2"></div>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  const loadOrderData = async () => {
    setLoading(true)
    try {
      if (!token) {
        return
      } else {
        const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
        if (response.data.success) {
          const groupedOrders = response.data.orders.map(order => ({
            ...order,
            items: order.items.map(item => ({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            }))
          }))
          setOrderData(groupedOrders.reverse()) // reverse so latest order is on top
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <div className='border-t pt-16 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <Title text1={'MY'} text2={'ORDERS'} /> 
      <LoadingModal isLoading={loading} />
      {/* display orders */}
      {loading ? null : orderData.length === 0 ? (
        <div className='text-gray-500 flex flex-col justify-center items-center h-[350px]'>
          <p className='text-3xl'>No order history.</p>
          <p className='text-2xl'>Go to the Collections page and order some products!</p>
        </div>
      ) : (
        <div>
          {orderData.map((order, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div className='flex flex-col text-sm'>
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className='flex items-start gap-6 py-2'>
                      <img src={item.image[0]} className='w-16 sm:w-20' alt="" />
                      <div>
                        <p className='sm:text-base font-medium'>{item.name}</p>
                        <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                          <p>{currency}{item.price}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p>Size: {item.size}</p>
                        </div>
                        <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                        <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='md:w-1/2 flex justify-between'>
                  <div className='flex items-center gap-2'>
                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                    <p className='text-sm text-base'>{order.status}</p>
                  </div>
                  <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
