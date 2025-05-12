import React, { useEffect, useState } from 'react'
import { SupplierType } from '../../../types'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axiosClient from '../../../utils/axios';

interface formDataType {
    supplier: string;
    alamat: string;
    kontak: string;
    email: string;
    deskripsi: string;
}

type BaseModalProps = {
    state: boolean;
    selectedData: SupplierType | null;
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

const SupplierModal = ({ state, selectedData, formData, type, onClose, formInputChange }: ModalProps) => {
    const queryClient = useQueryClient();
    const [errorMsg, setErrorMsg] = useState<formDataType | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!state) {
            setErrorMsg(null);
        }
    }, [state])

    const postMutation = useMutation({
        mutationFn: async () => {
            return await axiosClient.post(`/supplier`, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'supplier' });
            setLoading(false);
            setErrorMsg(null);
            toast.success('Berhasil menambahkan supplier')
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
            return await axiosClient.put(`/supplier/${selectedData!.id}`, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'supplier' });
            setLoading(false);
            setErrorMsg(null);
            toast.success('Berhasil memperbarui supplier');
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
            return await axiosClient.delete(`/supplier/${selectedData!.id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'supplier' });
            setLoading(false);
            toast.success('Berhasil menghapus supplier');
            onClose();
        },
        onError: (error: any) => {
            setLoading(false);
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan jaringan.';
            console.error(errorMessage);
            toast.error(`${errorMessage}`);
        }
    });

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (type === 'create') {
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
                                    Supplier
                                </DialogTitle>
                            </div>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                {['create', 'update', 'read'].includes(type) &&
                                    <form onSubmit={submitForm} className="space-y-4" id='Form'>
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="supplier">Supplier*</label>
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.supplier}</span>}
                                            <input
                                                name='supplier'
                                                onChange={formInputChange}
                                                value={formData?.supplier}
                                                type="text"
                                                id="supplier"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Nama supplier..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="kontak">Kontak*</label>
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.kontak}</span>}
                                            <input
                                                name='kontak'
                                                onChange={formInputChange}
                                                value={formData?.kontak}
                                                type="text"
                                                id="kontak"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Nomor kontak..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.email}</span>}
                                            <input
                                                name='email'
                                                onChange={formInputChange}
                                                value={formData?.email}
                                                type="email"
                                                id="email"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="alamat">Alamat</label>
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.alamat}</span>}
                                            <textarea
                                                name="alamat"
                                                onChange={formInputChange}
                                                value={formData?.alamat}
                                                id="alamat"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Masukkan alamat supplier..."
                                                rows={4}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="deskripsi">Deskripsi</label>
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.deskripsi}</span>}
                                            <textarea
                                                name="deskripsi"
                                                onChange={formInputChange}
                                                value={formData?.deskripsi}
                                                id="deskripsi"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Deskripsi tambahan..."
                                                rows={4}
                                            />
                                        </div>
                                    </form>
                                }
                                {['delete'].includes(type) &&
                                    <div className='text-gray-500'>
                                        <p>Yakin ingin hapus ?</p>
                                        <p>Data supplier <span className='text-red-500'>{selectedData?.supplier}</span> akan dihapus selamanya.</p>
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

export default SupplierModal