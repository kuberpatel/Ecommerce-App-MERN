import React from 'react'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox'

function Contact() {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'}/>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt='' />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-purple-600'>Our Store</p>
          <p className='text-gray-500'>76675 Steve Station<br/> Charlie 365, NewYork, USA</p>
          <p className='text-gray-500'>Tel: (212) 434-8906 <br/> Email: admin@zonefashion.com</p>
          <p className='font-semibold text-xl text-purple-500'>Career at Zone Fashion</p>
          <p className='text-gray-500'>Learn more about our teams and job opening.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-purple-600 hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default Contact
