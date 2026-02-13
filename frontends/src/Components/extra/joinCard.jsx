import React from 'react'

const JoinCard = ({ title, subttitle, btn, imaage, onClick }) => {
  return (
    <div className='w-[800px] h-[300px] rounded-lg flex justify-center items-center gap-4 p-4 join_card bg-gray-800'>
      
      <div className='w-[40%] h-[100%] font-inter flex flex-col gap-4 p-4 justify-center items-center'>
        <h1 className='text-3xl join_card_name'>{title}</h1>
        <p className='mmls'>{subttitle}</p>

        <button
          onClick={onClick}
          className='rounded-lg border-2 w-[150px] ml-6 card_Button bg-puregreys-100 hover:bg-puregreys-200 cursor-pointer'
        >
          {btn}
        </button>
      </div>

      <div className='w-[60%] h-[100%] overflow-hidden'>
        <img
          src={imaage}
          alt="This is the banner image"
          className='w-full h-full object-cover rounded-3xl'
          draggable="false"
          loading='lazy'
        />
      </div>

    </div>
  )
}

export default JoinCard
