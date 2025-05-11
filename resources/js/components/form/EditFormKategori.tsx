import React, { useState } from 'react';

interface FormProps {
    id: string;
    kategoriVal: string;
}

interface formData {
    kategori: string,
}

const EditFormKategori: React.FC<FormProps> = ({ id, kategoriVal }) => {
    const [formData, setFormData] = useState<formData>({
        kategori: kategoriVal,
    })

    const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData.kategori);
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
