"use client";
import cn from '@/utils/cn';


type ButtonConnectProps = {
    label?: string;
    className?: string;
}

export default function ButtonConnect({ label, className }: ButtonConnectProps) {
    return <div className={cn(
        `flex justify-center items-center border-b-[2px] border-brown rounded-full font-bold text-base bg-light-orange-200 !text-brown hover:border-[transparent] hover:bg-light-orange-100 w-[180px] lg:w-[200px] ${className ? className : ''}`
    )}>
        <w3m-button balance="hide" label={label} />
    </div>
}