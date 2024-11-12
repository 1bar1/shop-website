import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { toast } from 'react-toastify'

const Profile = () => {
  const { updateAddress, address } = useContext(ShopContext)
  const defaultFormData = {
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  }
  const [formData, setFormData] = useState(defaultFormData)
  const [confirm, setConfirm] = useState(false)


  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      await updateAddress(formData)
      toast.success("Address updated successfully")
    } catch (error) {
      toast.error("Failed to update address")
    }
  }

  const onChangeHandler = (e) => {
    const name = e.target.name
    const value = e.target.value
    setFormData(data => {
      const updatedData = { ...data, [name]: value }
      return updatedData
    })
  }

  const clearForm = async () => {
    await setFormData(defaultFormData)
    await updateAddress(defaultFormData)
    await setConfirm(false)
    window.location.reload()
  }

  const cancelClearForm = () => {
    setConfirm(false)
  }

  useEffect(() => {
    if (address.firstName && address.lastName) {
      setFormData(address)
    }

  }, [address])

  return (
    <div className="flex justify-center px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {/* form */}
      <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-top w-full max-w-[480px] mx-auto'>
        <div className='flex flex-col gap-4 w-full'>
          <div className='text-xl sm:text-2xl my-3'>
            <Title text1={'DEFAULT'} text2={'ADDRESS'} />
          </div>
          <div className='flex gap-3'>
            <input onChange={onChangeHandler} value={formData.firstName === defaultFormData.firstName ? undefined : formData.firstName} required name='firstName' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
            <input onChange={onChangeHandler} value={formData.lastName === defaultFormData.lastName ? undefined : formData.lastName} required name='lastName' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
          </div>
          <input onChange={onChangeHandler} value={formData.email === defaultFormData.email ? undefined : formData.email} required name='email' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
          <input onChange={onChangeHandler} value={formData.street === defaultFormData.street ? undefined : formData.street} required name='street' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
          <div className='flex gap-3'>
            <input onChange={onChangeHandler} value={formData.city === defaultFormData.city ? undefined : formData.city} required name='city' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
            <input onChange={onChangeHandler} value={formData.state === defaultFormData.state ? undefined : formData.state} required name='state' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
          </div>
          <div className='flex gap-3'>
            <input onChange={onChangeHandler} value={formData.zipcode === defaultFormData.zipcode ? undefined : formData.zipcode} required name='zipcode' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zip code' />
            <input onChange={onChangeHandler} value={formData.country === defaultFormData.country ? undefined : formData.country} required name='country' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
          </div>
          <input onChange={onChangeHandler} value={formData.phone === defaultFormData.phone ? undefined : formData.phone} required name='phone' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
          <button type="submit" className="mt-6 py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 w-full sm:max-w-[480px] mx-auto">{'Use this as default address'}</button>
          <button type="button" onClick={() => setConfirm(true)} className="text-slate-400 rounded-lg hover:text-black transition-colors duration-200 w-1/2 sm:max-w-[480px] mx-auto">Clear form</button>
        </div>
      </form>
      {/* confirmation modal */}
      {confirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full relative">
            <button onClick={cancelClearForm} className="absolute top-2 right-2 text-gray-500 font-bold">X</button>
            <h2 className="text-xl mb-4 text-center">Are you sure you want to remove your default address?</h2>
            <button onClick={clearForm} className="mt-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 w-full transition-colors duration-200">Yes</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile