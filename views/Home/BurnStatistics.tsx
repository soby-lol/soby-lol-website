import { useSobySMC } from '@/hooks/useSobyContract'
import { APP_BURN_ADDRESS, DECIMAL, EXPLORER_URL } from '@/types/common';
import { FormatBigNumber, formatLargeNumber, truncateAddress } from '@/utils/helpers';
import { formatUnits } from 'viem';

export default function BurnStatistics() {
  const { sobyBurnAmount, sobyBurnPercent } = useSobySMC();
  return (
    <div className="max-w-7xl w-full px-5 lg:px-0 mx-auto mt-20">
      <div className="bg-light-orange-300 py-6 rounded-3xl border-b-2 border-brown flex flex-col gap-3 h-full">
        <div className="text-[32px] font-bold pb-2 text-center">
          <span className='text-[#C79300]'>Burn</span> Statistics
        </div>
        <div className="w-full flex-col md:flex-row flex justify-center md:justify-between items-center md:items-start h-full relative">
          <img src="/images/burn-coin.png" className='w-[140px] -mt-10' />
          <div className='flex flex-col gap-4 justify-start items-start px-5 w-full text-base'>
            <div className='w-full flex justify-between items-center rounded-lg border-b-2 border-brown bg-[#FFE49A] py-[17px] px-[20px]'>
              <strong>Total $SOBY Destroyed</strong>
              <span>{formatLargeNumber(formatUnits(sobyBurnAmount, DECIMAL))}</span>
            </div>
            <div className='w-full flex justify-between items-center rounded-lg border-b-2 border-brown bg-[#FFE49A] py-[17px] px-[20px]'>
              <strong>Amount of Burned $SOBY (%)</strong>
              <span>{sobyBurnPercent.toFixed(2)}%</span>
            </div>
            <div className='w-full flex justify-between items-center rounded-lg border-b-2 border-brown bg-[#FFE49A] py-[17px] px-[20px]'>
              <strong>Destroyed Address</strong>
              <a href={`${EXPLORER_URL}/address/${APP_BURN_ADDRESS}`} target="_blank" className="flex gap-2 items-baseline">
                {truncateAddress(APP_BURN_ADDRESS, 10)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
