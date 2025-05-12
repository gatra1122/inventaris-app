import { formatWIB } from '../../utils/dateUtils';
import { KategoriType, SupplierType } from '../../types';
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
import { EyeIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon as MagGlassI } from '@heroicons/react/16/solid';
import { useDebounce } from 'use-debounce';
import { toast } from 'react-toastify';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import PaginationControls from './PaginationControls';

interface postData {
    supplier: string;
    alamat: string;
    kontak: string;
    email: string;
    deskripsi: string;
}

interface postErrorsMsg {
    supplier: string,
    alamat: string,
    kontak: string,
    email: string,
    deskripsi: string,
}

const SupplierTable = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);
    const [selectedData, setSelectedData] = useState<SupplierType | null>(null);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const { data, error, isFetching } = useQuery({
        queryKey: ['supplier', pagination.pageIndex, debouncedSearch],
        queryFn: () => {
            return axiosClient.get('/supplier', {
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

    const columnHelper = createColumnHelper<SupplierType>()
    const columns = [
        {
            id: 'row-number',
            header: '#',
            cell: (info: { row: { index: number; }; }) => {
                return pagination.pageIndex * pagination.pageSize + info.row.index + 1;
            },
        },
        columnHelper.accessor('supplier', {
            header: 'Supplier',
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
                    <button className='bg-cyan-500 inline-flex items-center gap-1' onClick={() => {
                        setSelectedData(row.original);
                        setDetailsModal(true);
                    }}>
                        <EyeIcon className='size-5' />Lihat
                    </button>
                    <button className='bg-yellow-500 inline-flex items-center gap-1' onClick={() => {
                        setSelectedData(row.original);
                        setUpdateModal(true);
                    }}>
                        <PencilIcon className='size-5' />Ubah
                    </button>
                    <button className='bg-red-500 inline-flex items-center gap-1' onClick={() => {
                        setSelectedData(row.original);
                        setDeleteModal(true);
                    }}>
                        <TrashIcon className='size-5' />Hapus
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
    const [deleteLoading, setDeleteLoading] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: async () => {
            return await axiosClient.delete(`/supplier/${selectedData!.id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'supplier' });
            setDeleteModal(false);
            setSelectedData(null);
            setDeleteLoading(false);
            toast.success('Berhasil menghapus supplier');
        },
        onError: (error: any) => {
            setDeleteLoading(false);
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan jaringan.';
            console.error(errorMessage);
            toast.error(`${errorMessage}`);
        }
    });

    const submitDelete = () => {
        setDeleteLoading(true);
        deleteMutation.mutate();
    };

    const closeDeleteModal = () => {
        if (!deleteLoading) {
            setDeleteModal(false);
        } else {
            toast.warning('Harap tunggu');
        }
    }

    const [formData, setFormData] = useState<postData>({
        supplier: '',
        alamat: '',
        kontak: '',
        email: '',
        deskripsi: '',
    })
    const formInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const [updateModal, setUpdateModal] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        if (updateModal) {
            setFormData({
                supplier: selectedData ? selectedData.supplier : '',
                alamat: selectedData ? selectedData.alamat : '',
                kontak: selectedData ? selectedData.kontak : '',
                email: selectedData ? selectedData.email : '',
                deskripsi: selectedData ? selectedData.deskripsi : '',
            });
        } else {
            setFormData({
                supplier: '',
                alamat: '',
                kontak: '',
                email: '',
                deskripsi: '',
            });
        }
        setErrorsPost(null);
    }, [updateModal])

    const updateMutation = useMutation({
        mutationFn: async () => {
            return await axiosClient.put(`/supplier/${selectedData!.id}`, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'supplier' });
            setUpdateLoading(false);
            setUpdateModal(false);
            setErrorsPost(null);
            toast.success('Berhasil memperbarui supplier');
        },
        onError: (error: any) => {
            setUpdateLoading(false);
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan jaringan.';
            toast.error(`${errorMessage}`);
            setErrorsPost(error.response?.data?.errors);
        }
    });

    const submitUpdateForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUpdateLoading(true);
        updateMutation.mutate();
    }

    const closeUpdateModal = () => {
        if (!updateLoading) {
            setUpdateModal(false);
        } else {
            toast.warning('Harap tunggu');
        }
    }

    const [postModal, setPostModal] = useState(false);
    const [errorsPost, setErrorsPost] = useState<postErrorsMsg | null>(null);
    const [postLoading, setPostLoading] = useState(false);

    useEffect(() => {
        if (!postModal) {
            setFormData({
                supplier: '',
                alamat: '',
                kontak: '',
                email: '',
                deskripsi: '',
            });
        }
        setErrorsPost(null);
    }, [postModal])

    const postMutation = useMutation({
        mutationFn: async () => {
            return await axiosClient.post(`/supplier`, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'supplier' });
            setPostLoading(false);
            setPostModal(false);
            setErrorsPost(null);
            toast.success('Berhasil menambahkan supplier')
        },
        onError: (error: any) => {
            setPostLoading(false);
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan jaringan.';
            toast.error(`${errorMessage}`);
            setErrorsPost(error.response?.data?.errors);
        }
    });

    const submitPostForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPostLoading(true);
        postMutation.mutate();
    }

    const closePostModal = () => {
        if (!postLoading) {
            setPostModal(false);
        } else {
            toast.warning('Harap tunggu');
        }
    }

    const [detailsModal, setDetailsModal] = useState(false);

    useEffect(() => {
        setFormData({
            supplier: selectedData ? selectedData.supplier : '',
            alamat: selectedData ? selectedData.alamat : '',
            kontak: selectedData ? selectedData.kontak : '',
            email: selectedData ? selectedData.email : '',
            deskripsi: selectedData ? selectedData.deskripsi : '',
        });

        if (!detailsModal) {
            setFormData({
                supplier: '',
                alamat: '',
                kontak: '',
                email: '',
                deskripsi: '',
            });
        }
    }, [detailsModal])

    const closeDetailsModal = () => {
        setDetailsModal(false);
    }

    if (error) return <p>Error loading data</p>;

    return (
        <>
            {/* Table */}
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
                    <button onClick={() => setPostModal(true)}>Tambah</button>
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
            {/* Paginasi */}
            <PaginationControls table={table} />

            {/* Modal */}
            {/* Details Modal */}
            <Dialog open={detailsModal} onClose={closeDetailsModal} className="relative z-10">
                <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row sm:px-6 gap-2">
                                <DialogTitle as="h3">
                                    Edit Kategori
                                </DialogTitle>
                            </div>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="supplier">Supplier*</label>
                                        {errorsPost && <span className='text-red-500'>{errorsPost?.supplier}</span>}
                                        <input
                                            value={formData.supplier}
                                            type="text"
                                            id="supplier"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="kontak">Kontak*</label>
                                        {errorsPost && <span className='text-red-500'>{errorsPost?.kontak}</span>}
                                        <input
                                            value={formData.kontak}
                                            type="text"
                                            id="kontak"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
                                        {errorsPost && <span className='text-red-500'>{errorsPost?.email}</span>}
                                        <input
                                            onChange={formInputChange}
                                            value={formData.email}
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="alamat">Alamat</label>
                                        {errorsPost && <span className='text-red-500'>{errorsPost?.alamat}</span>}
                                        <textarea
                                            value={formData.alamat}
                                            id="alamat"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={4}
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="deskripsi">Deskripsi</label>
                                        {errorsPost && <span className='text-red-500'>{errorsPost?.deskripsi}</span>}
                                        <textarea
                                            value={formData.deskripsi}
                                            id="deskripsi"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={4}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                                <button
                                    type="button"
                                    className='bg-gray-500'
                                    onClick={() => setDetailsModal(false)}
                                >
                                    Batal
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
            {/* Create Modal */}
            <Dialog open={postModal} onClose={closePostModal} className="relative z-10">
                <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row sm:px-6 gap-2">
                                <DialogTitle as="h3">
                                    Tambah Kategori
                                </DialogTitle>
                            </div>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <form onSubmit={submitPostForm} className="space-y-4" id='PostForm'>
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="supplier">Supplier*</label>
                                        {errorsPost && <span className='text-red-500'>{errorsPost?.supplier}</span>}
                                        <input
                                            name='supplier'
                                            onChange={formInputChange}
                                            value={formData.supplier}
                                            type="text"
                                            id="supplier"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nama supplier..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="kontak">Kontak*</label>
                                        {errorsPost && <span className='text-red-500'>{errorsPost?.kontak}</span>}
                                        <input
                                            name='kontak'
                                            onChange={formInputChange}
                                            value={formData.kontak}
                                            type="text"
                                            id="kontak"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nomor kontak..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
                                        {errorsPost && <span className='text-red-500'>{errorsPost?.email}</span>}
                                        <input
                                            name='email'
                                            onChange={formInputChange}
                                            value={formData.email}
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="alamat">Alamat</label>
                                        {errorsPost && <span className='text-red-500'>{errorsPost?.alamat}</span>}
                                        <textarea
                                            name="alamat"
                                            onChange={formInputChange}
                                            value={formData.alamat}
                                            id="alamat"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Masukkan alamat supplier..."
                                            rows={4}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="deskripsi">Deskripsi</label>
                                        {errorsPost && <span className='text-red-500'>{errorsPost?.deskripsi}</span>}
                                        <textarea
                                            name="deskripsi"
                                            onChange={formInputChange}
                                            value={formData.deskripsi}
                                            id="deskripsi"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Deskripsi tambahan..."
                                            rows={4}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                                <button
                                    form='PostForm'
                                    type="submit"
                                    className='bg-green-500'
                                    disabled={postLoading}
                                >
                                    {postLoading ? 'Menyimpan...' : 'Simpan'}
                                </button>
                                <button
                                    type="button"
                                    className='bg-gray-500'
                                    onClick={() => setPostModal(false)}
                                >
                                    Batal
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
            {/* Edit Modal */}
            <Dialog open={updateModal} onClose={closeUpdateModal} className="relative z-10">
                <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row sm:px-6 gap-2">
                                <DialogTitle as="h3">
                                    Edit Kategori
                                </DialogTitle>
                            </div>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <form onSubmit={submitUpdateForm} className="space-y-4" id='UpdateForm'>
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="supplier">Supplier*</label>
                                        {errorsPost && <span className='text-red-500'>{errorsPost?.supplier}</span>}
                                        <input
                                            name='supplier'
                                            onChange={formInputChange}
                                            value={formData.supplier}
                                            type="text"
                                            id="supplier"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nama supplier..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="kontak">Kontak*</label>
                                        {errorsPost && <span className='text-red-500'>{errorsPost?.kontak}</span>}
                                        <input
                                            name='kontak'
                                            onChange={formInputChange}
                                            value={formData.kontak}
                                            type="text"
                                            id="kontak"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nomor kontak..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
                                        {errorsPost && <span className='text-red-500'>{errorsPost?.email}</span>}
                                        <input
                                            name='email'
                                            onChange={formInputChange}
                                            value={formData.email}
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="alamat">Alamat</label>
                                        {errorsPost && <span className='text-red-500'>{errorsPost?.alamat}</span>}
                                        <textarea
                                            name="alamat"
                                            onChange={formInputChange}
                                            value={formData.alamat}
                                            id="alamat"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Masukkan alamat supplier..."
                                            rows={4}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="deskripsi">Deskripsi</label>
                                        {errorsPost && <span className='text-red-500'>{errorsPost?.deskripsi}</span>}
                                        <textarea
                                            name="deskripsi"
                                            onChange={formInputChange}
                                            value={formData.deskripsi}
                                            id="deskripsi"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Deskripsi tambahan..."
                                            rows={4}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                                <button
                                    form='UpdateForm'
                                    type="submit"
                                    className='bg-green-500'
                                    disabled={updateLoading}
                                >
                                    {updateLoading ? 'Menyimpan...' : 'Simpan'}
                                </button>
                                <button
                                    type="button"
                                    className='bg-gray-500'
                                    onClick={() => setUpdateModal(false)}
                                >
                                    Batal
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
            {/* Delete Modal */}
            <Dialog open={deleteModal} onClose={closeDeleteModal} className="relative z-10">
                <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row sm:px-6 gap-2">
                                <DialogTitle as="h3">
                                    Hapus Supplier
                                </DialogTitle>
                            </div>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 text-gray-500">
                                <p>Yakin hapus supplier ini ?</p>
                                <p>Supplier <span className='text-red-500'>{selectedData?.supplier}</span> akan di hapus.</p>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                                <button
                                    type="button"
                                    className='bg-red-500'
                                    onClick={submitDelete}
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading ? 'Menghapus...' : 'Hapus'}
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
        </>
    )
}

export default SupplierTable;