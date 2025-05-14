import { formatWIB } from '../../../utils/dateUtils';
import { SupplierType, UserType } from '../../../types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import { EyeIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon as MagGlassI } from '@heroicons/react/16/solid';
import { useDebounce } from 'use-debounce';
import UserModal from './UserModal';
import TopBar from '../TopBar';
import BottomBar from '../BottomBar';

interface formDataType {
    name: string;
    email: string;
    role: string;
    password: string;
    password_confirmation: string;
}

const UserTable = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);
    const [selectedData, setSelectedData] = useState<UserType | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [postModal, setPostModal] = useState(false);
    const [detailsModal, setDetailsModal] = useState(false);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const { data, error, isFetching } = useQuery({
        queryKey: ['user', pagination.pageIndex, debouncedSearch],
        queryFn: () => {
            return axiosClient.get('/user', {
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
        staleTime: 1000 * 60 * 5,
        placeholderData: (prev) => prev
    });

    const columnHelper = createColumnHelper<UserType>()
    const columns = [
        {
            id: 'row-number',
            header: '#',
            cell: (info: { row: { index: number; }; }) => {
                return pagination.pageIndex * pagination.pageSize + info.row.index + 1;
            },
        },
        columnHelper.accessor('name', {
            header: 'Nama',
            cell: (info) => <span className='capitalize'>{info.cell.getValue()}</span>,
        }),
        columnHelper.accessor('role', {
            header: 'Role',
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

    const [formData, setFormData] = useState<formDataType>({
        name: '',
        email: '',
        role: '',
        password: '',
        password_confirmation: '',
    })
    const formInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            role: '',
            password: '',
            password_confirmation: '',
        });
    };
    const fillForm = () => {
        setFormData({
            name: selectedData?.name || '',
            email: selectedData?.email || '',
            role: selectedData?.role || '',
            password: '',
            password_confirmation: '',
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
                <TopBar
                    searchValue={search}
                    onChangeSearch={(e) => {
                        setSearch(e.target.value);
                        setPagination(prev => ({ ...prev, pageIndex: 0 }));
                    }}
                    onClickTambah={() => setPostModal(true)} />
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
            <BottomBar table={table} />

            {/* Modal */}
            <UserModal state={detailsModal} type='read' formData={formData} onClose={() => setDetailsModal(false)} selectedData={selectedData} />
            <UserModal state={postModal} type='create' formData={formData} onClose={() => setPostModal(false)} formInputChange={formInputChange} selectedData={selectedData} />
            <UserModal state={updateModal} type='update' formData={formData} onClose={() => setUpdateModal(false)} formInputChange={formInputChange} selectedData={selectedData} />
            <UserModal state={deleteModal} type='delete' onClose={() => setDeleteModal(false)} selectedData={selectedData} />
        </>
    )
}

export default UserTable;