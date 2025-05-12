import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatWIB } from '../../../utils/dateUtils';
import { KategoriType } from '../../../types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    PaginationState,
    useReactTable,
} from '@tanstack/react-table'
import axiosClient from '../../../utils/axios';
import { useEffect, useState } from 'react';
import Spinner from '../../Spinner';
import { MagnifyingGlassIcon as MagGlassI } from '@heroicons/react/16/solid';
import { useDebounce } from 'use-debounce';
import { toast } from 'react-toastify';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import PaginationControls from '../PaginationControls';
import KategoriModal from './KategoriModal';

interface formDataType {
    kategori: string;
}

const KategoriTable = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);
    const [selectedData, setSelectedData] = useState<KategoriType | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [postModal, setPostModal] = useState(false);
    const [detailsModal, setDetailsModal] = useState(false);

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
                        setSelectedData(row.original);
                        setUpdateModal(true);
                    }}>
                        <PencilIcon className='size-5' />Edit
                    </button>
                    <button className='!bg-red-500 inline-flex items-center gap-1' onClick={() => {
                        setSelectedData(row.original);
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

    const [formData, setFormData] = useState<formDataType>({
        kategori: '',
    })
    const formInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const resetForm = () => {
        setFormData({
            kategori: '',
        });
    };
    const fillForm = () => {
        setFormData({
            kategori: selectedData?.kategori || '',
        });
    };

    useEffect(() => {
        if (updateModal) {
            fillForm();
        } else {
            resetForm();
        }
    }, [updateModal]);
    useEffect(() => {
        if (postModal) {
            resetForm();
        }
    }, [postModal]);
    useEffect(() => {
        if (detailsModal) {
            fillForm();
        } else {
            resetForm();
        }
    }, [detailsModal]);
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
            <KategoriModal state={postModal} type='create' formData={formData} onClose={() => setPostModal(false)} formInputChange={formInputChange} selectedData={selectedData} />
            <KategoriModal state={updateModal} type='update' formData={formData} onClose={() => setUpdateModal(false)} formInputChange={formInputChange} selectedData={selectedData} />
            <KategoriModal state={deleteModal} type='delete' onClose={() => setDeleteModal(false)} selectedData={selectedData} />
        </>
    )
}

export default KategoriTable;