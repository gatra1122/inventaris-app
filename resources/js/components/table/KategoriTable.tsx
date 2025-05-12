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
import { MagnifyingGlassIcon as MagGlassI } from '@heroicons/react/16/solid';
import { useDebounce } from 'use-debounce';
import { toast } from 'react-toastify';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import PaginationControls from './PaginationControls';

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
                        setEditModal(true);
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
    const [deleteLoading, setDeleteLoading] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: async () => {
            return await axiosClient.delete(`/kategori/${selectedKtg!.id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'kategori' });
            setDeleteModal(false);
            setSelectedKtg(null);
            setDeleteLoading(false);
            toast.success('Berhasil menghapus kategori');
        },
        onError: (error: any) => {
            setDeleteLoading(false);
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan jaringan.';
            console.error(errorMessage);
            toast.error(`${errorMessage}`);
        }
    });

    const handleDelete = () => {
        setDeleteLoading(true);
        deleteMutation.mutate();
    };

    const [editModal, setEditModal] = useState(false);
    const [updateValue, setUpdateValue] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        if (editModal) {
            setUpdateValue(`${selectedKtg?.kategori}`);
        } else {
            setUpdateValue('')
        }
    }, [editModal])

    const updateMutation = useMutation({
        mutationFn: async () => {
            return await axiosClient.put(`/kategori/${selectedKtg?.id}`, {
                kategori: updateValue
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'kategori' });
            setUpdateLoading(false);
            setEditModal(false);
            toast.success('Berhasil memperbarui kategori');
        },
        onError: (error: any) => {
            setUpdateLoading(false);
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan jaringan.';
            toast.error(`${errorMessage}`);
        }
    });

    const handleFormEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUpdateLoading(true);
        updateMutation.mutate();
    }

    const [storeModal, setStoreModal] = useState(false);
    const [storeValue, setStoreValue] = useState('');
    const [storeLoading, setStoreLoading] = useState(false);

    useEffect(() => {
        if (!storeModal) {
            setStoreValue('');
        }
    }, [storeModal])

    const storeMutation = useMutation({
        mutationFn: async () => {
            return await axiosClient.post(`/kategori`, {
                kategori: storeValue
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'kategori' });
            setStoreLoading(false);
            setStoreModal(false);
            toast.success('Berhasil menambahkan kategori')
        },
        onError: (error: any) => {
            setStoreLoading(false);
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan jaringan.';
            toast.error(`${errorMessage}`);
        }
    });

    const handleFormCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStoreLoading(true);
        storeMutation.mutate();
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
                    <button onClick={() => setStoreModal(true)}>Tambah</button>
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
            {/* Edit Modal */}
            <Dialog open={editModal} onClose={setEditModal} className="relative z-10">
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
                                <form onSubmit={handleFormEdit} className="space-y-4" id='EditFormKategori'>
                                    <div className="flex flex-col">
                                        <label htmlFor="kategori" className="mb-1 text-sm font-medium text-gray-700">
                                            Kategori
                                        </label>
                                        <input
                                            value={updateValue}
                                            onChange={(e) => setUpdateValue(e.target.value)}
                                            type="text"
                                            id="kategori"
                                            name="kategori"
                                            placeholder="Masukkan nama kategori..."
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Tombol aksi */}
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                                <button
                                    form='EditFormKategori'
                                    type="submit"
                                    className='bg-green-500'
                                    disabled={updateLoading}
                                >
                                    {updateLoading ? 'Menyimpan...' : 'Simpan'}
                                </button>
                                <button
                                    type="button"
                                    className='bg-gray-500'
                                    onClick={() => setEditModal(false)}
                                >
                                    Batal
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
            {/* Create Modal */}
            <Dialog open={storeModal} onClose={setStoreModal} className="relative z-10">
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
                                <form onSubmit={handleFormCreate} className="space-y-4" id='StoreFormKategori'>
                                    <div className="flex flex-col">
                                        <label htmlFor="kategori" className="mb-1 text-sm font-medium text-gray-700">
                                            Kategori
                                        </label>
                                        <input
                                            value={storeValue}
                                            onChange={(e) => setStoreValue(e.target.value)}
                                            type="text"
                                            id="kategori"
                                            name="kategori"
                                            placeholder="Masukkan nama kategori..."
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Tombol aksi */}
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                                <button
                                    form='StoreFormKategori'
                                    type="submit"
                                    className='bg-green-500'
                                    disabled={storeLoading}
                                >
                                    {storeLoading ? 'Menyimpan...' : 'Simpan'}
                                </button>
                                <button
                                    type="button"
                                    className='bg-gray-500'
                                    onClick={() => setStoreModal(false)}
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
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row sm:px-6 gap-2">
                                <DialogTitle as="h3">
                                    Hapus Kategori
                                </DialogTitle>
                            </div>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <p>Yakin hapus data ?</p>
                            </div>

                            {/* Tombol aksi */}
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                                <button
                                    type="button"
                                    className='bg-red-500'
                                    onClick={() => handleDelete()}
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

export default KategoriTable;