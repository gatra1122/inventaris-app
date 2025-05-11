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
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { AxiosError } from 'axios';
// import EditKategori from '../form/kategori/EditKategori';

const KategoriTable = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);
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

    const [deleteModal, setDeleteModal] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return await axiosClient.delete(`/kategori/${id}`);
        },
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ['barang', pagination.pageIndex, debouncedSearch] });
            queryClient.invalidateQueries({ queryKey: ['kategori'] });
            setDeleteModal(false);
            setSelectedKtg(null);
            toast.success('Kategori berhasil dihapus!');
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan jaringan.';
            console.error('Delete error:', errorMessage);
            toast.error(`Gagal menghapus: ${errorMessage}`);
        }
    });

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
    };

    const [editFormModal, setEditFormModal] = useState(false);
    const [editKategoriVal, setEditKategoriVal] = useState('');
    const [submitEditLoading, setSubmitEditLoading] = useState(false);

    useEffect(() => {
        if (editFormModal) {
            setEditKategoriVal(`${selectedKtg?.kategori}`);
        } else {
            setEditKategoriVal('')
        }
    }, [editFormModal])

    const handleFormEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitEditLoading(true);
        try {
            const response = await axiosClient.put(`/kategori/${selectedKtg?.id}`, {
                kategori: editKategoriVal
            });
            if (response.data.success) {
                toast.success('Berhasil memperbarui kategori')
            }
            queryClient.invalidateQueries({ queryKey: ['kategori'] });
        } catch (error: any | AxiosError) {
            toast.error(error.response.data.message);
        } finally {
            setSubmitEditLoading(false);
            setEditFormModal(false);
        }
    }

    const [createFormModal, setCreateFormModal] = useState(false);
    const [createKategoriVal, setCreateKategoriVal] = useState('');
    const [submitCreateLoading, setSubmitCreateLoading] = useState(false);

    useEffect(() => {
        if (!createFormModal) {
            setCreateKategoriVal('');
        }
    }, [createFormModal])

    const handleFormCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitCreateLoading(true);
        try {
            const response = await axiosClient.post(`/kategori`, {
                kategori: createKategoriVal
            });
            if (response.data.success) {
                toast.success('Berhasil menambahkan kategori')
            }
            queryClient.invalidateQueries({ queryKey: ['kategori'] });
        } catch (error: any | AxiosError) {
            toast.error(error.response.data.message);
        } finally {
            setSubmitCreateLoading(false);
            setCreateFormModal(false);
        }
    }

    if (error) return <p>Error loading data</p>;

    return (
        <>
            <div className='overflow-x-auto mt-2'>
                <div className='flex justify-between'>
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
                    <button onClick={() => setCreateFormModal(true)}>Tambah</button>
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
            {/* Modal */}
            <div>
                {/* Edit Modal */}
                <Dialog open={editFormModal} onClose={setEditFormModal} className="relative z-10">
                    <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="">
                                        <div className="py-2 px-6">
                                            <div className='inline-flex justify-center items-center gap-2'>
                                                <DialogTitle as="h3">
                                                    Edit Kategori
                                                </DialogTitle>
                                            </div>
                                            <div className="mt-2">
                                                <div>
                                                    <form onSubmit={handleFormEdit} className="space-y-4" id='EditFormKategori'>
                                                        <div className="flex flex-col">
                                                            <label htmlFor="kategori" className="mb-1 text-sm font-medium text-gray-700">
                                                                Kategori
                                                            </label>
                                                            <input
                                                                value={editKategoriVal}
                                                                onChange={(e) => setEditKategoriVal(e.target.value)}
                                                                type="text"
                                                                id="kategori"
                                                                name="kategori"
                                                                placeholder="Masukkan nama kategori..."
                                                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                        </div>
                                                    </form>
                                                    {/* <EditFormKategori id={'editFormKategori'} kategoriVal={`${selectedKtg?.kategori}`} kategoriId={`${selectedKtg?.id}`} /> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol aksi */}
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                                    <button
                                        form='EditFormKategori'
                                        type="submit"
                                        className='bg-blue-500'
                                        // onClick={() => setEditFormModal(false)}
                                        disabled={submitEditLoading}
                                    >
                                        {submitEditLoading ? 'Submitting...' : 'Submit'}
                                    </button>
                                    <button
                                        type="button"
                                        className='bg-gray-500'
                                        onClick={() => setEditFormModal(false)}
                                    >
                                        Batal
                                    </button>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
                {/* Create Modal */}
                <Dialog open={createFormModal} onClose={setCreateFormModal} className="relative z-10">
                    <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="">
                                        <div className="py-2 px-6">
                                            <div className='inline-flex justify-center items-center gap-2'>
                                                <DialogTitle as="h3">
                                                    Create Kategori
                                                </DialogTitle>
                                            </div>
                                            <div className="mt-2">
                                                <form onSubmit={handleFormCreate} className="space-y-4" id='EditFormKategori'>
                                                    <div className="flex flex-col">
                                                        <label htmlFor="kategori" className="mb-1 text-sm font-medium text-gray-700">
                                                            Kategori
                                                        </label>
                                                        <input
                                                            value={createKategoriVal}
                                                            onChange={(e) => setCreateKategoriVal(e.target.value)}
                                                            type="text"
                                                            id="kategori"
                                                            name="kategori"
                                                            placeholder="Masukkan nama kategori..."
                                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol aksi */}
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                                    <button
                                        form='EditFormKategori'
                                        type="submit"
                                        className='bg-blue-500'
                                        // onClick={() => setEditFormModal(false)}
                                        disabled={submitCreateLoading}
                                    >
                                        {submitCreateLoading ? 'Submitting...' : 'Submit'}
                                    </button>
                                    <button
                                        type="button"
                                        className='bg-gray-500'
                                        onClick={() => setCreateFormModal(false)}
                                    >
                                        Batal
                                    </button>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
                {/* Delete Modal */}
                <Dialog open={deleteModal} onClose={setDeleteModal} className="relative z-10">
                    <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="">
                                        <div className="py-2 px-6">
                                            <div className='inline-flex justify-center items-center gap-2'>
                                                <DialogTitle as="h3">
                                                    Hapus Kategori
                                                </DialogTitle>
                                            </div>
                                            <div className="mt-2">
                                                <p>Yakin hapus data ?</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol aksi */}
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                                    <button
                                        type="button"
                                        className='bg-blue-500'
                                        onClick={() => handleDelete(selectedKtg!.id)}
                                        disabled={submitCreateLoading}
                                    >
                                        {submitCreateLoading ? 'Submitting...' : 'Submit'}
                                    </button>
                                    <button
                                        type="button"
                                        className='bg-gray-500'
                                        onClick={() => setDeleteModal(false)}
                                    >
                                        Batal
                                    </button>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Dialog>
            </div>
            {/* <Modal
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
                }} /> */}
        </>
    )
}

export default KategoriTable;