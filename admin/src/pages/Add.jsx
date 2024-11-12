import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import imageCompression from 'browser-image-compression'

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState(false)

  const LoadingModal = ({ isLoading }) => {
    if (!isLoading){
      return null
    } 
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-5 rounded shadow-md flex flex-col items-center justify-center">
          <div className="loader mb-2"></div>
          <p>Adding product...</p>
        </div>
      </div>
    )
  }

  const handleImageChange = async (e, setImage) => {
    const file = e.target.files[0]

    if (file) {
      try {
        const options = {
          maxSizeMB: 3,
          useWebWorker: true,
        }
        
        const compressedFile = await imageCompression(file, options)

        const img = new Image()
        img.src = URL.createObjectURL(compressedFile)
  
        img.onload = async () => {
          const canvas = document.createElement("canvas")
          canvas.width = 390
          canvas.height = 450
  
          const ctx = canvas.getContext("2d")
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  
          canvas.toBlob((blob) => {
            const resizedFile = new File([blob], compressedFile.name, {
              type: compressedFile.type,
            })
            setImage(resizedFile)
          }, compressedFile.type)
        }
      } catch (error) {
        console.error(error)
        toast.error("Error compressing the image.")
      }
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setPrice('')
        setSizes([])
        setBestseller(false)
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)

    } finally {
      setLoading(false) 
    }
  }

  return (
    <>
      <LoadingModal isLoading={loading} />
      <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
        <div>
          <p className='mb-2'>Upload Image</p>
          <div className='flex gap-2'>
            <label htmlFor="image1">
              <img className='w-20 h-[90px]' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
              <input onChange={(e) => handleImageChange(e, setImage1)} type="file" id="image1" hidden />
            </label>
            <label htmlFor="image2">
              <img className='w-20 h-[90px]' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
              <input onChange={(e) => handleImageChange(e, setImage2)} type="file" id="image2" hidden />
            </label>
            <label htmlFor="image3">
              <img className='w-20 h-[90px]' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
              <input onChange={(e) => handleImageChange(e, setImage3)} type="file" id="image3" hidden />
            </label>
            <label htmlFor="image4">
              <img className='w-20 h-[90px]' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
              <input onChange={(e) => handleImageChange(e, setImage4)} type="file" id="image4" hidden />
            </label>
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product Name</p>
          <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
        </div>
        <div className='w-full'>
          <p className='mb-2'>Product Description</p>
          <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' placeholder='Write description here' required />
        </div>
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
          <div>
            <p className='mb-2'>Product category</p>
            <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2 bg-white'>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <p className='mb-2'>Sub category</p>
            <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2 bg-white'>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>
          <div>
            <p className='mb-2'>Product price</p>
            <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' placeholder='100$' type="number" />
          </div>
        </div>
        <div>
          <p className='mb-2'>Product Sizes</p>
          <div className='flex gap-3'>
            <div onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"])}>
              <p className={`${sizes.includes("S") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>S</p>
            </div>
            <div onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"])}>
              <p className={`${sizes.includes("M") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>M</p>
            </div>
            <div onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"])}>
              <p className={`${sizes.includes("L") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>L</p>
            </div>
            <div onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"])}>
              <p className={`${sizes.includes("XL") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XL</p>
            </div>
            <div onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"])}>
              <p className={`${sizes.includes("XXL") ? "bg-pink-200" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XXL</p>
            </div>
          </div>
        </div>
        <div className='flex gap-2 mt-2'>
          <input className='focus:outline-none accent-pink-500' onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id="bestseller" />
          <label htmlFor="bestseller" className='cursor-pointer'>Add to bestseller</label>
        </div>
        <button type='submit' className='w-28 py-3 mt-4 bg-black text-white' disabled={loading}>ADD</button>
      </form>
    </>
  )
}

export default Add