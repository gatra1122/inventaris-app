import React, { useEffect, useState } from 'react'
import { BarangType, SupplierType } from '../../../types'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axiosClient from '../../../utils/axios';

interface formDataType {
    kode: string;
    nama: string;
    kategori_id: number;
    supplier_id: number;
    merk: string;
    spesifikasi: string;
    satuan: string;
    stok: number;
    stok_minimum: number;
    gambar: string;
}

type BaseModalProps = {
    state: boolean;
    selectedData: BarangType | null;
    onClose: () => void;
    formInputChange?: (
        e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
    ) => void;
};

type ReadProps = BaseModalProps & {
    type: 'read';
    formData: formDataType;
};

type DeleteModalProps = BaseModalProps & {
    type: 'delete';
    formData?: null;
};

type CreateUpdateProps = BaseModalProps & {
    type: 'create' | 'update';
    formData: formDataType;
    formInputChange: (
        e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
    ) => void;
};

type ModalProps = DeleteModalProps | CreateUpdateProps | ReadProps;

const BarangModal = ({ state, selectedData, formData, type, onClose, formInputChange }: ModalProps) => {
    const queryClient = useQueryClient();
    const [errorMsg, setErrorMsg] = useState<formDataType | null>(null);
    const [loading, setLoading] = useState(false);
    const [kodeBarang, setKodeBarang] = useState('');

    useEffect(() => {
        if (!state) {
            setErrorMsg(null);
        }
    }, [state])

    const postMutation = useMutation({
        mutationFn: async () => {
            return await axiosClient.post(`/barang`, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'barang' });
            setLoading(false);
            setErrorMsg(null);
            toast.success('Berhasil menambahkan barang')
            onClose();
        },
        onError: (error: any) => {
            setLoading(false);
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan jaringan.';
            toast.error(`${errorMessage}`);
            setErrorMsg(error.response?.data?.errors);
        }
    });

    const updateMutation = useMutation({
        mutationFn: async () => {
            return await axiosClient.put(`/barang/${selectedData!.id}`, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'barang' });
            setLoading(false);
            setErrorMsg(null);
            toast.success('Berhasil memperbarui barang');
            onClose();
        },
        onError: (error: any) => {
            setLoading(false);
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan jaringan.';
            toast.error(`${errorMessage}`);
            setErrorMsg(error.response?.data?.errors);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            return await axiosClient.delete(`/barang/${selectedData!.id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'barang' });
            setLoading(false);
            toast.success('Berhasil menghapus barang');
            onClose();
        },
        onError: (error: any) => {
            setLoading(false);
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan jaringan.';
            console.error(errorMessage);
            toast.error(`${errorMessage}`);
        }
    });

    const createKodeBarang = () => {
        // $kode_barang = sprintf('K%dS%d%02d%s%s', $kategori, $supplier, $i + 1, $tahun, $bulan);
        const tanggal = new Date();
        const tahun = tanggal.getFullYear();
        const bulan = tanggal.getMonth() + 1;
        const nama = formData?.nama;
        const kode_nama = nama?.slice(0, 3).toUpperCase();
        const kode_barang = `K${formData?.kategori_id}S${formData?.supplier_id}${kode_nama}${tahun}${bulan}`;
        setKodeBarang(kode_barang);
        console.log(kode_barang);
    }

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (type === 'create') {
            // createKodeBarang();
            postMutation.mutate();
        } else if (type === 'update') {
            updateMutation.mutate();
        }
    }

    const submitDelete = () => {
        setLoading(true);
        if (type === 'delete') {
            deleteMutation.mutate();
        }
    }

    return (
        <>
            <Dialog open={state} onClose={onClose} className="relative z-10">
                <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row sm:px-6 gap-2">
                                <DialogTitle as="h3">
                                    {type === 'create' && 'Tambah '}
                                    {type === 'read' && 'Data '}
                                    {type === 'update' && 'Ubah '}
                                    {type === 'delete' && 'Hapus '}
                                    Barang
                                </DialogTitle>
                            </div>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                {['create', 'update', 'read'].includes(type) &&
                                    <form onSubmit={submitForm} className="space-y-4" id='Form'>
                                        {/* <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="kode">Nama Barang*</label>
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.kode}</span>}
                                            <input
                                                name='kode'
                                                onChange={formInputChange}
                                                value={kodeBarang}
                                                type="text"
                                                id="kode"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Kode barang..."
                                            />
                                        </div> */}
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="nama">Nama Barang*</label>
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.nama}</span>}
                                            <input
                                                name='nama'
                                                onChange={formInputChange}
                                                value={formData?.nama}
                                                type="text"
                                                id="nama"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Nama barang..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="merk">Merk*</label>
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.merk}</span>}
                                            <input
                                                name='merk'
                                                onChange={formInputChange}
                                                value={formData?.merk}
                                                type="text"
                                                id="merk"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Merk barang..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="stok">Stok</label>
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.stok}</span>}
                                            <input
                                                name='stok'
                                                onChange={formInputChange}
                                                value={formData?.stok}
                                                type="number"
                                                id="stok"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="stok_minimum">Stok Minimum</label>
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.stok_minimum}</span>}
                                            <input
                                                name='stok_minimum'
                                                onChange={formInputChange}
                                                value={formData?.stok_minimum}
                                                type="number"
                                                id="stok_minimum"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="spesifikasi">Spesifikasi</label>
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.spesifikasi}</span>}
                                            <textarea
                                                name="spesifikasi"
                                                onChange={formInputChange}
                                                value={formData?.spesifikasi}
                                                id="spesifikasi"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Spesifikasi tambahan..."
                                                rows={4}
                                            />
                                        </div>
                                    </form>
                                }
                                {['delete'].includes(type) &&
                                    <div className='text-gray-500'>
                                        <p>Yakin ingin hapus ?</p>
                                        <p>Data barang <span className='text-red-500'>{selectedData?.nama}</span> akan dihapus selamanya.</p>
                                    </div>
                                }
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                                {['create', 'update'].includes(type) &&
                                    <button
                                        form='Form'
                                        type="submit"
                                        className='bg-green-500'
                                        disabled={loading}
                                    >
                                        {loading ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                }
                                {['delete'].includes(type) &&
                                    <button
                                        type="button"
                                        className='bg-red-500'
                                        disabled={loading}
                                        onClick={submitDelete}
                                    >
                                        {loading ? 'Menghapus...' : 'Hapus'}
                                    </button>
                                }
                                <button
                                    type="button"
                                    className='bg-gray-500'
                                    onClick={onClose}
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

export default BarangModal