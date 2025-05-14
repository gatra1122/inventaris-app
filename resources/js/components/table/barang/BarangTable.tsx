import { formatWIB } from '../../../utils/dateUtils';
import { BarangType } from '../../../types';
import { useQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table'
import axiosClient from '../../../utils/axios';
import { useState } from 'react';
import Spinner from '../../Spinner';
import { EyeIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon as MagGlassI } from '@heroicons/react/16/solid';
import { useDebounce } from 'use-debounce';
import BarangModal from './BarangModal';
import BottomBar from '../BottomBar';
import TopBar from '../TopBar';

const BarangTable = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [selectedData, setSelectedData] = useState<BarangType | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [postModal, setPostModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, error, isFetching } = useQuery({
    queryKey: ['barang', pagination.pageIndex, debouncedSearch],
    queryFn: () => {
      return axiosClient.get('/barang', {
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
    placeholderData: (prev) => prev,
  });

  const columnHelper = createColumnHelper<BarangType>()
  const columns = [
    {
      id: 'row-number',
      header: '#',
      cell: (info: { row: { index: number; }; }) => {
        return pagination.pageIndex * pagination.pageSize + info.row.index + 1;
      },
    },
    columnHelper.accessor('kode', {
      header: 'Kode',
    }),
    columnHelper.accessor('nama', {
      header: 'Barang',
      cell: (info) => <span className='capitalize'>{info.cell.getValue()}</span>,
    }),
    columnHelper.accessor('stok', {
      header: 'Stok',
      cell: (info) => <>{`${info.cell.getValue()} ${info.row.original.satuan}`}</>,
    }),
    columnHelper.accessor('updated_at', {
      cell: (info) => formatWIB(info.getValue()),
      header: 'Diperbarui',
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
      <BarangModal state={detailsModal} type='read' onClose={() => setDetailsModal(false)} selectedData={selectedData} />
      <BarangModal state={postModal} type='create' onClose={() => setPostModal(false)} selectedData={selectedData} />
      <BarangModal state={updateModal} type='update' onClose={() => setUpdateModal(false)} selectedData={selectedData} />
      <BarangModal state={deleteModal} type='delete' onClose={() => setDeleteModal(false)} selectedData={selectedData} />
    </>
  )
}

export default BarangTable