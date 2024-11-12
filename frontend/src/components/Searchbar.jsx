import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom'

const Searchbar = () => {

    const {search, setSearch, showSearch, setShowSearch} = useContext(ShopContext)
    const [visible, setVisble] = useState(false)
    const location = useLocation()

    useEffect(() => {
        if(location.pathname.includes('collection')){
            setVisble(true)
        }
        else {
            setVisble(false)
        }
    },[location])

    const handleClose = () => {
        setShowSearch(false)
        setVisible(false)
    }

    return (
        <div className={`border-t border-b bg-gray-50 text-center transition-all duration-500 ease-in-out transform ${showSearch && visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            {showSearch && visible && (
                <div>
                    <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
                        <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder='Search...' className='flex-1 outline-none bg-inherit text-sm'/>
                        <img src={assets.search_icon} className='w-4' alt="Search" />
                    </div>
                    <img onClick={handleClose} src={assets.cross_icon} className='inline w-3 cursor-pointer'alt="Close"/>
                </div>
            )}
        </div>
    )
}

export default Searchbar
