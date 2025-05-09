import React from 'react';
import ReactDOM from 'react-dom';

interface ModalConfirmProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ModalConfirm = ({ isOpen, title, message, onConfirm, onCancel }: ModalConfirmProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#000] bg-opacity-30 flex justify-center items-center top-0 left-0 z-50">
            <div className="w-[90%] max-w-[650px] bg-[#FFFFE5] py-10 px-7 rounded-3xl shadow-xl transition-transform transform-gpu scale-110 animate-zoomOut flex flex-col gap-3 justify-center items-center border-b-[2px] border-brown">
                <div onClick={onCancel} className='absolute top-10 right-7 w-[36px] h-[36px] flex justify-end items-center cursor-pointer'>
                    <img src="/icons/icn-close.svg" />
                </div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className='text-lg font-normal text-center'>{message}</p>
                <div className="grid grid-cols-2 gap-4 w-full">
                    <button onClick={onCancel} className="w-full border-b-[2px] border-brown rounded-full font-bold text-base bg-[#FFE49A] text-brown hover:border-none py-2 hover:py-[9px] px-6" >
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="w-full border-b-[2px] border-brown rounded-full font-bold text-base bg-light-orange-200 text-brown hover:border-none hover:bg-light-orange-100 h-10 leading-10">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirm;