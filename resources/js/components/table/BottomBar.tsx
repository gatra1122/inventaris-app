import React, { useEffect, useState } from 'react';
import {
    ChevronRightIcon as CevRightI,
    ChevronDoubleRightIcon as CevDRightI,
    ChevronLeftIcon as CevLeftI,
    ChevronDoubleLeftIcon as CevDLeftI
} from '@heroicons/react/16/solid';
import { Table } from '@tanstack/react-table';

type PaginationControlsProps<T> = {
    table: Table<T>;
};

// Menampilkan 3 halaman total, kompensasi jika dekat awal/akhir
function getCenteredPagination(current: number, total: number, maxPagesToShow = 3): number[] {
    let start: number;
    let end: number;

    if (maxPagesToShow >= total) {
        // Jika total halaman lebih kecil dari max, tampilkan semua
        start = 1;
        end = total;
    } else {
        const evenOffset = maxPagesToShow % 2 === 0 ? 1 : 0;
        const half = Math.floor(maxPagesToShow / 2);

        start = current - half + evenOffset;
        end = current + half;

        if (start < 1) {
            end += 1 - start;
            start = 1;
        }

        if (end > total) {
            start -= end - total;
            end = total;
        }
    }

    // Buat range
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return pages;
}


const BottomBar = <T,>({ table }: PaginationControlsProps<T>) => {
    const pageIndex = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount();

    const currentPage = pageIndex + 1;
    const pagesToShow = getCenteredPagination(currentPage, pageCount);

    const [inputPage, setInputPage] = useState<number | "">(currentPage);
    useEffect(() => {
        setInputPage(currentPage);
    }, [currentPage]);


    return (
        <div className='bg-white px-4 py-2 rounded-b-md'>
            <div className="flex flex-wrap justify-between items-center gap-2">
                <div className='inline-flex gap-3 items-center'>
                    <span className="flex items-center gap-1">
                        <div>Page</div>
                        <strong>{currentPage} of {pageCount}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                        | Go to page:
                        <input
                            type="number"
                            min="1"
                            max={pageCount}
                            value={inputPage}
                            onChange={e => {
                                const value = e.target.value;
                                setInputPage(value === '' ? '' : Number(value));

                                const page = value ? Number(value) - 1 : 0;
                                if (!isNaN(page)) {
                                    table.setPageIndex(page);
                                }
                            }}
                            className="p-1 rounded w-16 border"
                        />
                    </span>
                </div>
                <div className='inline-flex gap-1 items-center flex-wrap'>
                    <button
                        className='px-2 py-1 border rounded disabled:opacity-75'
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <CevDLeftI className='size-4 inline' />
                    </button>
                    {pagesToShow.map((page) => (
                        <button
                            key={page}
                            className={`px-3 py-1 border rounded transition-colors disabled:opacity-75`}
                            onClick={() => table.setPageIndex(page - 1)}
                            disabled={page === currentPage}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        className='px-2 py-1 border rounded disabled:opacity-75'
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <CevDRightI className='size-4 inline' />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BottomBar;
