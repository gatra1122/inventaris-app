import React from 'react';
import Select from 'react-select';
import axiosClient from '../../../utils/axios';
import { useQuery } from '@tanstack/react-query';

type SelectKategoriProps = {
    formData: { [key: string]: any };
    formInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isDisabled?: boolean;
    selectType: 'kategori' | 'supplier';
};

const SelectOptions: React.FC<SelectKategoriProps> = ({
    formData,
    formInputChange,
    isDisabled,
    selectType,
}) => {

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
        enabled: selectType === 'kategori',
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
        enabled: selectType === 'kategori',
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

    const handleKategoriChange = (selectedOption: any) => {
        const fakeEvent = {
            target: {
                name: selectType === 'kategori' ? 'kategori_id' : 'supplier_id',
                value: selectedOption ? selectedOption.value : ''
            }
        } as React.ChangeEvent<HTMLInputElement>;

        formInputChange(fakeEvent);
    };

    return (
        <>
            <Select
                id={`${selectType === 'kategori' ? 'kategori_id' : 'supplier_id'}`}
                name={`${selectType === 'kategori' ? 'kategori_id' : 'supplier_id'}`}
                options={selectType === 'kategori' ? kategoriOptions : supplierOptions}
                onChange={handleKategoriChange}
                value={
                    selectType === 'kategori' ? kategoriOptions?.find((opt: { value: any; }) => opt.value === formData?.kategori_id) || null
                        :
                        supplierOptions?.find((opt: { value: any; }) => opt.value === formData?.supplier_id) || null
                }
                isDisabled={isDisabled}
                placeholder={`Pilih ${selectType === 'kategori' ? 'kategori' : 'supplier'}...`}
                classNames={{
                    // control: () => `px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`,
                    control: () => 'px-2 py-1',
                    valueContainer: ({ isDisabled }) => `${isDisabled ? 'bg-gray-100' : ''}`,
                    placeholder: () => 'text-red-500',
                    indicatorsContainer: ({ isDisabled }) => `${isDisabled ? 'bg-gray-100' : ''}`,
                }}
            />
        </>
    );
};

export default SelectOptions;