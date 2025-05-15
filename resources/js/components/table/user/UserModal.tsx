import React, { useEffect, useState } from 'react'
import { SupplierType, UserType } from '../../../types'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axiosClient from '../../../utils/axios';
import SelectInput from '../SelectInput';

interface formDataType {
    name: string;
    email: string;
    role: string;
    password: string;
    password_confirmation: string;
}

type BaseModalProps = {
    state: boolean;
    selectedData: UserType | null;
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
        e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>
    ) => void;
};

type ModalProps = DeleteModalProps | CreateUpdateProps | ReadProps;

interface OptionType {
  value: string;
  label: string;
}

const UserModal = ({ state, selectedData, formData, type, onClose, formInputChange }: ModalProps) => {
    const queryClient = useQueryClient();
    const [errorMsg, setErrorMsg] = useState<formDataType | null>(null);
    const [loading, setLoading] = useState(false);

    const roleOptions: OptionType[] = [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
    ];

    useEffect(() => {
        if (!state) {
            setErrorMsg(null);
        }
    }, [state])

    const postMutation = useMutation({
        mutationFn: async () => {
            return await axiosClient.post(`/user`, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'user' });
            setLoading(false);
            setErrorMsg(null);
            toast.success('Berhasil menambahkan user')
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
            return await axiosClient.put(`/user/${selectedData!.id}`, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'user' });
            setLoading(false);
            setErrorMsg(null);
            toast.success('Berhasil memperbarui user');
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
            return await axiosClient.delete(`/user/${selectedData!.id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: query => query.queryKey[0] === 'user' });
            setLoading(false);
            toast.success('Berhasil menghapus user');
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
                                    User
                                </DialogTitle>
                            </div>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                {['create', 'update', 'read'].includes(type) &&
                                    <form onSubmit={submitForm} className="space-y-4" id='Form'>
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="name">Nama</label>
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.name}</span>}
                                            <input
                                                name='name'
                                                onChange={formInputChange}
                                                value={formData?.name}
                                                type="text"
                                                id="name"
                                                className="form-input"
                                                placeholder="Nama user..."
                                                disabled={type === 'read'}
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
                                                className="form-input"
                                                placeholder="you@example.com"
                                                disabled={type === 'read'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 mb-1" htmlFor="role">Role</label>
                                            {errorMsg && <span className='text-red-500'>{errorMsg?.role}</span>}
                                            <SelectInput
                                                name="role"
                                                value={formData!.role}
                                                onChange={formInputChange!}
                                                options={roleOptions}
                                                isDisabled={type === 'read'}
                                            />
                                        </div>
                                        {['create', 'update'].includes(type) &&
                                            <>
                                                <div>
                                                    <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
                                                    {errorMsg && <span className='text-red-500'>{errorMsg?.password}</span>}
                                                    <input
                                                        name='password'
                                                        onChange={formInputChange}
                                                        value={formData?.password}
                                                        type="password"
                                                        id="password"
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 mb-1" htmlFor="password_confirmation">Confirm Password</label>
                                                    {errorMsg && <span className='text-red-500'>{errorMsg?.password_confirmation}</span>}
                                                    <input
                                                        name='password_confirmation'
                                                        onChange={formInputChange}
                                                        value={formData?.password_confirmation}
                                                        type="password"
                                                        id="password_confirmation"
                                                        className="form-input"
                                                        disabled={type === 'read'}
                                                    />
                                                </div>
                                            </>
                                        }
                                    </form>
                                }
                                {['delete'].includes(type) &&
                                    <div className='text-gray-500'>
                                        <p>Yakin ingin hapus ?</p>
                                        <p>Data user <span className='text-red-500'>{selectedData?.name}</span> akan dihapus selamanya.</p>
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

export default UserModal