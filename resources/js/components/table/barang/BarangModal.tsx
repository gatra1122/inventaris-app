import React, { useEffect, useState } from 'react'
import { BarangType, SupplierType } from '../../../types'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axiosClient from '../../../utils/axios';
import SelectOptions from './SelectOptions';
import SelectGeneric from '../SelectGeneric';

interface formDataType {
    kode: string;
    nama: string;
    kategori_id: string;
    supplier_id: string;
    merk: string;
    spesifikasi: string;
    satuan: string;
    stok: number;
    stok_minimum: number;
    gambar: string;
}

type ModalProps = {
    state: boolean;
    type: 'read' | 'create' | 'update' | 'delete';
    selectedData: BarangType | null;
    onClose: () => void;
};

const BarangModal = ({ state, selectedData, type, onClose }: ModalProps) => {
    const queryClient = useQueryClient();
    const [errorMsg, setErrorMsg] = useState<formDataType | null>(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<formDataType>({
        gambar: '',
        kategori_id: '',
        kode: '',
        merk: '',
        nama: '',
        satuan: '',
        spesifikasi: '',
        stok: 1,
        stok_minimum: 1,
        supplier_id: '',
    })
    const formInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const resetForm = () => {
        setFormData({
            gambar: '',
            kategori_id: '',
            kode: '',
            merk: '',
            nama: '',
            satuan: '',
            spesifikasi: '',
            stok: 1,
            stok_minimum: 1,
            supplier_id: '',
        });
    };
    const fillForm = () => {
        setFormData({
            gambar: selectedData?.gambar || '',
            kategori_id: selectedData?.kategori_id || '',
            kode: selectedData?.kode || '',
            merk: selectedData?.merk || '',
            nama: selectedData?.nama || '',
            satuan: selectedData?.satuan || '',
            spesifikasi: selectedData?.spesifikasi || '',
            stok: selectedData?.stok || 1,
            stok_minimum: selectedData?.stok_minimum || 1,
            supplier_id: selectedData?.supplier_id || '',
        });
    };

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

    const { data: listKategori } = useQuery({
        queryKey: ['list_kategori'],
        queryFn: () => {
            return axiosClient.get('/barang/listkategori').then(response => {
                return response.data.data;
            }).catch(error => {
                throw error;
            })
        },
        staleTime: 1000 * 60 * 5,
        enabled: ['update', 'create'].includes(type),
        refetchOnMount: true,
    });

    const { data: listSupplier } = useQuery({
        queryKey: ['list_supplier'],
        queryFn: () => {
            return axiosClient.get('/barang/listsupplier').then(response => {
                return response.data.data;
            }).catch(error => {
                throw error;
            })
        },
        staleTime: 1000 * 60 * 5,
        enabled: ['update', 'create'].includes(type),
        refetchOnMount: true
    });

    const kategoriOptions = listKategori?.map((item: { id: any; kategori: any; }) => ({
        value: item.id,
        label: item.kategori
    }));
    const supplierOptions = listSupplier?.map((item: { id: any; supplier: any; }) => ({
        value: item.id,
        label: item.supplier
    }));

    useEffect(() => {
        if (state) {
            if (['update', 'read'].includes(type)) {
                fillForm();
            }
        } else {
            resetForm();
            setErrorMsg(null);
        }
    }, [state])

    useEffect(() => {
        if (formData.stok_minimum > formData.stok) {
            setFormData(prevData => ({
                ...prevData,
                stok: prevData.stok_minimum,
            }));
        }
    }, [formData.stok_minimum]);

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
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="nama">Nama Barang*</label>
                                            <input
                                                name='nama'
                                                onChange={formInputChange}
                                                value={formData?.nama}
                                                type="text"
                                                id="nama"
                                                className="form-input"
                                                placeholder="Nama barang..."
                                                disabled={type === 'read'}
                                            />
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.nama}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="kategori_id">Kategori</label>
                                            <SelectGeneric
                                                name="kategori_id"
                                                value={formData!.kategori_id}
                                                onChange={formInputChange!}
                                                options={kategoriOptions}
                                                isDisabled={type === 'read'}
                                            />
                                            {/* <SelectOptions formData={formData} formInputChange={formInputChange} isDisabled={type === 'read'} selectType='kategori' /> */}
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.kategori_id}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="supplier_id">Supplier</label>
                                            <SelectGeneric
                                                name="supplier_id"
                                                value={formData!.supplier_id}
                                                onChange={formInputChange!}
                                                options={kategoriOptions}
                                                isDisabled={type === 'read'}
                                            />
                                            {/* <SelectOptions formData={formData} formInputChange={formInputChange} isDisabled={type === 'read'} selectType='supplier' /> */}
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.supplier_id}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="merk">Merk*</label>
                                            <input
                                                name='merk'
                                                onChange={formInputChange}
                                                value={formData?.merk}
                                                type="text"
                                                id="merk"
                                                className="form-input"
                                                placeholder="Merk barang..."
                                                disabled={type === 'read'}
                                            />
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.merk}</span>}
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-gray-700 mb-1" htmlFor="stok">Stok</label>
                                                <input
                                                    name='stok'
                                                    onChange={formInputChange}
                                                    value={formData?.stok}
                                                    type="number"
                                                    id="stok"
                                                    className="form-input"
                                                    disabled={type === 'read'}
                                                    min={1}
                                                />
                                                {errorMsg && <span className='text-red-500'>{errorMsg?.stok}</span>}
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 mb-1" htmlFor="stok_minimum">Stok Minimum</label>
                                                <input
                                                    name='stok_minimum'
                                                    onChange={formInputChange}
                                                    value={formData?.stok_minimum}
                                                    type="number"
                                                    id="stok_minimum"
                                                    className="form-input"
                                                    disabled={type === 'read'}
                                                    min={1}
                                                />
                                                {errorMsg && <span className='text-red-500'>{errorMsg?.stok_minimum}</span>}
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 mb-1" htmlFor="satuan">Satuan</label>
                                                <select
                                                    name='satuan'
                                                    onChange={formInputChange}
                                                    value={formData?.satuan}
                                                    id="satuan"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:text-gray-500 disabled:bg-gray-100"
                                                    disabled={type === 'read'}
                                                >
                                                    <option value="">Pilih satuan...</option>
                                                    <option value="KG">KG</option>
                                                    <option value="Pcs">Pcs</option>
                                                    <option value="Unit">Unit</option>
                                                </select>
                                                {errorMsg && <span className='text-red-500'>{errorMsg?.satuan}</span>}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="spesifikasi">Spesifikasi</label>
                                            <textarea
                                                name="spesifikasi"
                                                onChange={formInputChange}
                                                value={formData?.spesifikasi}
                                                id="spesifikasi"
                                                className="form-input"
                                                placeholder="Spesifikasi tambahan..."
                                                rows={4}
                                                disabled={type === 'read'}
                                            />
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.spesifikasi}</span>}
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