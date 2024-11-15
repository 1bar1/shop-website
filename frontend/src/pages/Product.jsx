import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import RelatedProducts from '../components/RelatedProducts'
import { assets } from '../assets/assets'

const Product = () => {

  const { productId } = useParams()
  const { products, currency, addToCart } = useContext(ShopContext)
  const [productData, setProductData] = useState(false)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const allSizes = ['S', 'M', 'L', 'XL', 'XXL']

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null
      }
    })
  }

  useEffect(() => {
    fetchProductData()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSize('')
  }, [productId, products])

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in-out px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      {/* --------product data------ */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* ----product images-------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll scrollbar-hide justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.image.map((item, index) => (<img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' />))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img src={image} className='w-full h-auto' alt="" />
          </div>
        </div>
        {/* ----- product info ------- */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {allSizes.map((sizeOption, index) => (
                productData.sizes.includes(sizeOption) ? (
                  <button onClick={() => setSize(sizeOption)} className={`border py-2 px-4 bg-gray-100 ${sizeOption === size ? 'border-pink-300' : ''}`} key={`${sizeOption}-${index}`}>{sizeOption}</button>
                ) : (
                  <button disabled className={`border py-2 px-4 bg-gray-100 text-gray-400`} key={`${sizeOption}-${index}`}>{sizeOption}</button>
                )
              ))}
            </div>
          </div>
          <button onClick={() => addToCart(productData._id, size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>Add To Cart</button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original Product</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
      {/* ----------description and review --------- */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122) </p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
          <p>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        </div>
      </div>
      {/* -----------------display related products------------ */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product