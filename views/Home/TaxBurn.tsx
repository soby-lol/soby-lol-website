import React from 'react'
import TaxBurnPercent from '@/components/TaxBurnPercent'
export default function TaxBurn() {
  return (
    <div className="px-5 mt-20">
      <div className="bg-light-orange-300 py-6 rounded-3xl border-b-2 border-brown flex flex-col gap-3 h-full">
        <div className="text-[32px] font-bold pb-2 text-center">
          <span className='text-[#C79300]'>Tax</span> Burn
        </div>
        <div className="flex flex-col gap-3 items-center justify-center">
          <TaxBurnPercent />
        </div>
      </div>
    </div>
  )
}
