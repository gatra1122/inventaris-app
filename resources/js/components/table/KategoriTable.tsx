import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatWIB } from '../../utils/dateUtils';
import { KategoriType } from '../../types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    PaginationState,
    useReactTable,
} from '@tanstack/react-table'
import axiosClient from '../../utils/axios';
import { useEffect, useState } from 'react';
import Spinner from '../Spinner';
import {
    MagnifyingGlassIcon as MagGlassI, ChevronRightIcon as CevRightI,
    ChevronDoubleRightIcon as CevDRightI, ChevronLeftIcon as CevLeftI, ChevronDoubleLeftIcon as CevDLeftI
} from '@heroicons/react/16/solid';
import { useDebounce } from 'use-debounce';
// import ModalDialog from '@/components/ModalDialog';
import Modal, { ModalTypes } from '../Modal';
import { toast } from 'react-toastify';
import EditFormKategori from '../form/EditFormKategori';
// import EditKategori from '../form/kategori/EditKategori';

const KategoriTable = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);
    const [editformModal, setEditFormModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedKtg, setSelectedKtg] = useState<KategoriType | null>(null);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const { data, error, isFetching } = useQuery({
        queryKey: ['kategori', pagination.pageIndex, debouncedSearch],
        queryFn: () => {
            return axiosClient.get('/kategori', {
                params: {
                    page: pagination.pageIndex + 1,
                    per_page: pagination.pageSize,
                    search: debouncedSearch,
                },
            }).then(response => {
                return response.data.data;
            }).catch(error => {
                throw error;
            })
        },
        staleTime: 300000,
        placeholderData: (prev) => prev
    });

    const columnHelper = createColumnHelper<KategoriType>()
    const columns = [
        {
            id: 'row-number',
            header: '#',
            cell: (info: { row: { index: number; }; }) => {
                return pagination.pageIndex * pagination.pageSize + info.row.index + 1;
            },
        },
        columnHelper.accessor('kategori', {
            header: 'Kategori',
            cell: (info) => <span className='capitalize'>{info.cell.getValue()}</span>,
        }),
        columnHelper.accessor('updated_at', {
            cell: (info) => formatWIB(info.getValue()),
            header: 'Diperbarui',
        }),
        columnHelper.accessor('created_at', {
            cell: (info) => formatWIB(info.getValue()),
            header: 'Ditambahkan',
        }),
        {
            id: 'action',
            header: 'Action',
            footer: 'Action',
            cell: ({ row }: any) => (
                <div className='inline-flex gap-1'>
                    <button className='!bg-yellow-500 inline-flex items-center gap-1' onClick={() => {
                        setSelectedKtg(row.original);
                        setEditFormModal(true);
                    }}>
                        <PencilIcon className='size-5' />Edit
                    </button>
                    <button className='!bg-red-500 inline-flex items-center gap-1' onClick={() => {
                        setSelectedKtg(row.original);
                        setDeleteModal(true);
                    }}>
                        <TrashIcon className='size-5' />Delete
                    </button>
                </div>
            ),
        },
    ]

    const table = useReactTable({
        data: data?.data ?? [],
        columns,
        pageCount: data?.last_page ?? -1,
        state: {
            pagination: {
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
            },
        },
        manualPagination: true,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return await axiosClient.delete(`/kategori/${id}`);
        },
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ['barang', pagination.pageIndex, debouncedSearch] });
            queryClient.invalidateQueries({ queryKey: ['kategori'] });
            toast.success('Kategori berhasil dihapus!');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan jaringan.';
            console.error('Delete error:', errorMessage);
            toast.error(`Gagal menghapus: ${errorMessage}`);
        }
    });

    const handleDeleteBrg = (id: number) => {
        deleteMutation.mutate(id);
    };


    if (error) return <p>Error loading data</p>;

    return (
        <>
            <div className='overflow-x-auto mt-2'>
                <div className="inline-flex items-center space-x-2 p-2 rounded-sm rounded-b-none bg-white">
                    <MagGlassI className="w-5 h-5 text-blue-500" />
                    <input type="search" className="border-0 focus:ring-0 outline-none bg-white"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPagination(prev => ({ ...prev, pageIndex: 0 }));
                        }} />
                </div>
                <div className='relative'>
                    {isFetching &&
                        <div className='absolute w-full h-full flex items-center justify-center bg-white opacity-50'>
                            <Spinner />
                        </div>
                    }
                    <table className='table'>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.length <= 0 ?
                                <tr>
                                    <td colSpan={7} className='text-center'>No Data</td>
                                </tr>
                                :
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className={cell.column.id === 'row-number' || cell.column.id === 'action' ? 'text-center' : 'text-left'}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
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
                </div>
            </div>
            <Modal
                open={editformModal}
                setOpen={setEditFormModal}
                title={'Edit Kategori'}
                content={<EditFormKategori id={'editFormKategori'} kategoriVal={`${selectedKtg?.kategori}`} kategoriId={`${selectedKtg?.id}`} />}
                type={ModalTypes.Submit}
                disableIcon
                formId={'editFormKategori'}
            />
            <Modal
                open={deleteModal}
                setOpen={setDeleteModal}
                type={ModalTypes.Modal}
                description="Yakin hapus ? Data akan hilang selamanya."
                confirmText="Hapus"
                cancelText="Batal"
                title={`Delete: ${selectedKtg?.kategori}`}
                onConfirm={() => {
                    if (selectedKtg) {
                        handleDeleteBrg(selectedKtg.id);
                        setDeleteModal(false);
                        setSelectedKtg(null);
                    }
                }}
                onCancel={() => {
                    setDeleteModal(false);
                    setSelectedKtg(null);
                }}
                onClose={() => {
                    setDeleteModal(false);
                    setSelectedKtg(null);
                }} />
            {/* <ModalDialog
                open={editformModal}
                setOpen={setEditFormModal}
                title="Edit Kategori"
                content={<EditKategori />}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={() => {
                    // setEditFormModal(false);
                }}
                onCancel={() => {
                    // setEditFormModal(false);
                }}
            />
            <ModalDialog
                open={deleteModal}
                setOpen={setDeleteModal}
                title={`Delete: ${selectedKtg?.kategori}`}
                description="Are you sure you want to delete this ? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={() => {
                    if (selectedKtg) {
                        handleDeleteBrg(selectedKtg.id);
                        setDeleteModal(false);
                        setSelectedKtg(null);
                    }
                }}
                onCancel={() => {
                    setDeleteModal(false);
                    setSelectedKtg(null);
                }}
            /> */}
        </>
    )
}

export default KategoriTable;