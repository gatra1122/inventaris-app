import React, { useState } from 'react';
import axiosClient from '../../utils/axios';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

interface FormProps {
    id: string;
    kategoriVal: string;
    kategoriId: string;
}

interface formData {
    kategori: string,
}

const EditFormKategori: React.FC<FormProps> = ({ id, kategoriVal, kategoriId }) => {
    const { authToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<formData>({
        kategori: kategoriVal,
    })

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosClient.put(`/kategori/${kategoriId}`, formData);
            if (response.data.status) {
                console.log('berhasil update')
            }
        } catch (error: any | AxiosError) {
            console.log(error)
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    const handleOnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    return (
        <form onSubmit={handleSubmitForm} id={id} className="space-y-4">
            <div className="flex flex-col">
                <label htmlFor="kategori" className="mb-1 text-sm font-medium text-gray-700">
                    Kategori
                </label>
                <input
                    onChange={handleOnChangeInput}
                    value={formData.kategori}
                    type="text"
                    id="kategori"
                    name="kategori"
                    placeholder="Masukkan nama kategori..."
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
        </form>
    );
};

export default EditFormKategori;
