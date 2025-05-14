import React from 'react'
import { MagnifyingGlassIcon as MagGlassI, PlusIcon, PrinterIcon } from '@heroicons/react/16/solid';

const TopBar = (
    { searchValue, onChangeSearch, onClickTambah }:
        {
            searchValue: string,
            onChangeSearch: React.ChangeEventHandler<HTMLInputElement> | undefined,
            onClickTambah: React.MouseEventHandler<HTMLButtonElement> | undefined
        }) => {
    return (
        <>
            <div className='flex justify-between bg-white rounded-md rounded-b-none px-4 p-2'>
                <div className="inline-flex items-center space-x-2 p-1 rounded-md bg-gray-50">
                    <MagGlassI className="w-5 h-5 text-blue-500" />
                    <input type="search" className="border-0 focus:ring-0 outline-none"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={onChangeSearch} />
                </div>
                <div className='inline-flex gap-1'>
                    <button onClick={onClickTambah}><PlusIcon className='size-4' /></button>
                    <button className='bg-emerald-500' onClick={() => console.log('Cetak')}><PrinterIcon className='size-4' /></button>
                </div>
            </div>
        </>
    )
}

export default TopBar