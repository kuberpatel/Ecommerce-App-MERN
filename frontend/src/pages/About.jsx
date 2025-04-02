import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox'


function About() {
  return (
    <div>
      {/* About Us Section */}
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt='About us' />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'> 
          <p>Welcome to our store! We are dedicated to offering high-quality products that suit your lifestyle. Our carefully curated collection ensures that you find stylish, reliable, and affordable items for every occasion.</p>
          <p>Our team is committed to providing excellent service and a seamless shopping experience. Whether you're looking for the latest trends or timeless classics, we are here to help. Thank you for choosing us and being a part of our journey!</p>
          
          {/* Our Mission Section */}
          <b className='text-gray-800'>Our Mission</b>
          <p>Our mission is to empower our customers by providing high-quality, stylish, and affordable products that enhance their lifestyle. We are committed to sustainability, ethical sourcing, and creating a positive impact on our community. Your satisfaction drives our passion for excellence.</p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>We ensure that every product we offer meets the highest standards of quality. Our commitment to excellence means you can shop with confidence, knowing you're getting reliable and durable items.</p>
        </div>
        
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Shopping with us is easy and hassle-free. From user-friendly navigation to secure payment options and swift delivery, we prioritize your convenience at every step of the journey.</p>
        </div>
        
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Our dedicated support team is always here to help. Whether you have questions, need assistance, or require personalized recommendations, we are just a message away, ensuring your satisfaction.</p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
}

export default About;