import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row' style={{ backgroundColor: 'rgb(255, 218, 214)' }}>
      {/*-------LEFT SIDE---------*/}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
        <div className='text-[#414141]'>
          <div className='flex items-center gap-2'>
            <p className='w-6 md:w-8 h-[2px] bg-[#414141]'></p>
            <p className='font-medium text-sm md:text-base'>WE ARE FOR YOU</p>
          </div>
          <h1 className='prata-regular text-5xl sm:py-3 lg:text-7xl leading-relaxed text-black'>Mishi, it's simple.</h1>
          <div className='flex items-center gap-2 mt-4'>
            <NavLink to='/collection'>
            <button className='bg-[#414141] text-white font-semibold text-sm md:text-base py-2 px-5 rounded-lg shadow-lg hover:bg-[#333] transition-colors duration-300'>SHOP NOW</button>
            </NavLink>
          </div>
        </div>
      </div>
      {/*---------RIGHT SIDE--------*/}
      <div className='w-full sm:w-1/2 h-full'>
        <img src={assets.hero_img} className='w-full h-full object-cover' alt="Hero Banner" />
      </div>
    </div>
  )
}

export default Hero
