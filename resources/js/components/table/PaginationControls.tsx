import React from 'react'
import {
    MagnifyingGlassIcon as MagGlassI, ChevronRightIcon as CevRightI,
    ChevronDoubleRightIcon as CevDRightI, ChevronLeftIcon as CevLeftI, ChevronDoubleLeftIcon as CevDLeftI
} from '@heroicons/react/16/solid';
import { Table } from '@tanstack/react-table';
import { KategoriType } from '../../types';

type PaginationControlsProps<T> = {
    table: Table<T>;
}

const PaginationControls = <T,>({ table }: PaginationControlsProps<T>) => {
    return (
        <>
            <div className='bg-white px-4 py-2'>
                <div className="flex justify-between items-center gap-2">
                    <div className='inline-flex gap-1'>
                        <span className="flex items-center gap-1">
                            <div>Page</div>
                            <strong>
                                {table.getState().pagination.pageIndex + 1} of{' '}
                                {table.getPageCount().toLocaleString()}
                            </strong>
                        </span>
                        <span className="flex items-center gap-1">
                            | Go to page:
                            <input
                                type="number"
                                min="1"
                                max={table.getPageCount()}
                                defaultValue={table.getState().pagination.pageIndex + 1}
                                onChange={e => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                                    table.setPageIndex(page)
                                }}
                                className="p-1 rounded w-16"
                            />
                        </span>
                    </div>
                    {table.getPageCount() > 1 &&
                        <div className='inline-flex gap-1'>
                            <button
                                className='inline-flex items-center justify-center'
                                onClick={() => table.firstPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <CevDLeftI className='size-5' />First
                            </button>
                            <button
                                className='inline-flex items-center justify-center'
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <CevLeftI className='size-5' />Previous
                            </button>
                            <button
                                className='inline-flex items-center justify-center'
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <CevRightI className='size-5' />Next
                            </button>
                            <button
                                className='inline-flex items-center justify-center'
                                onClick={() => table.lastPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <CevDRightI className='size-5' />Last
                            </button>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default PaginationControls