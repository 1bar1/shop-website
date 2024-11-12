import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'



const Navbar = () => {

    const [visible, setVisible] = useState(false)
    const { showSearch, setShowSearch, getCartCount, navigate, token, setToken, setCartItems, name, setName, setAddress } = useContext(ShopContext)
    const location = useLocation()


    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        localStorage.removeItem('name')
        setToken('')
        setCartItems({})
        setName('')
        setAddress({
            firstName: '',
            lastName: '',
            email: '',
            street: '',
            city: '',
            state: '',
            zipcode: '',
            country: '',
            phone: ''
        })
    }

    useEffect(() => {
        if (location.pathname !== '/collection') {
            setShowSearch(false)
        }
    }, [location.pathname])

    return (
        <div className='flex items-center justify-between py-5 font-medium px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
            <Link to='/'>
                <img src={assets.mishi_logo} className='w-36' alt="" />
            </Link>
            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p>HOME</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                    <p>COLLECTION</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>ABOUT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                    <p>CONTACT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
            </ul>
            <div className='flex items-center gap-6'>
                <div className='flex items-center gap-2'>
                    {token && <span>Hello, {name}!</span>}
                </div>
                {location.pathname === '/collection' && (
                    <img onClick={() => setShowSearch(!showSearch)} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />
                )}
                <div className='group relative'>
                    <img src={assets.profile_icon} className='w-5 cursor-pointer' alt="" onClick={() => token ? null : navigate('/login')} />
                    {/* dropdown */}
                    {token &&
                        <div className='group-hover:block hidden absolute dropdown-menu pt-4 left-1/2 transform -translate-x-1/2 top-full'>
                            <div className='flex flex-col gap-2 w-[200px] py-3 px-5 bg-white text-gray-700 rounded-lg shadow-lg transition-all duration-200'>
                                <p onClick={() => navigate('/profile')} className='text-center cursor-pointer hover:text-black hover:bg-gray-200 rounded-lg py-2'>My Profile</p>
                                <p onClick={() => navigate('/orders')} className='text-center cursor-pointer hover:text-black hover:bg-gray-200 rounded-lg py-2'>Orders</p>
                                <p onClick={logout} className='text-center cursor-pointer hover:text-black hover:bg-gray-200 rounded-lg py-2'>Logout</p>
                            </div>
                        </div>
                    }

                </div>
                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                </Link>
                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            </div>
            {/* siderbar menu for small screens*/}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img src={assets.dropdown_icon} className='h-4 rotate-180' alt="" />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
                </div>
            </div>
        </div>
    )
}

export default Navbar
