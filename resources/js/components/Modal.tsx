import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/16/solid'
import React from 'react'

// Tipe Modal
export const ModalTypes = {
    Modal: 'modal',
    Submit: 'submit',
} as const;

export type ModalType = typeof ModalTypes[keyof typeof ModalTypes];

// Props umum
interface CommonProps {
    open: boolean
    setOpen: (open: boolean) => void
    title: string
    description?: string
    content?: React.ReactElement
    disableIcon?: boolean
    icon?: React.ReactNode
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    onCancel?: () => void
    onClose?: () => void
}

// Tipe Modal biasa (formId tidak boleh ada)
interface ModalProps extends CommonProps {
    type: typeof ModalTypes.Modal;
    formId?: never;
}

// Tipe Submit (formId wajib)
interface SubmitProps extends CommonProps {
    type: typeof ModalTypes.Submit;
    formId: string;
}

// Union Props
type ModalDialogProps = ModalProps | SubmitProps;

const Modal: React.FC<ModalDialogProps> = ({
    open,
    setOpen,
    title,
    description,
    content,
    formId,
    type,
    disableIcon,
    icon = <ExclamationTriangleIcon className="size-6 text-red-600" aria-hidden="true" />,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    onClose,
}) => {
    const handleCancel = () => {
        onCancel?.()
        setOpen(false)
    }

    const handleConfirm = () => {
        onConfirm?.()
        setOpen(false)
    }

    const handleSubmit = () => {
        console.log('INI DARI MODAL')
    }

    const handleClose = () => {
        onClose?.()
        setOpen(false)
    }

    return (
        <Dialog open={open} onClose={handleClose} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="">
                                <div className="py-2 px-6">
                                    <div className='inline-flex justify-center items-center gap-2'>
                                        {!disableIcon && (
                                            <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                                {icon}
                                            </div>
                                        )}
                                        <DialogTitle as="h3" className=''>
                                            {title}
                                        </DialogTitle>
                                    </div>
                                    <div className="mt-2">
                                        <p className=" text-gray-500">
                                            {description}
                                        </p>
                                        <div>
                                            {content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tombol aksi */}
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                            {type === ModalTypes.Submit ? (
                                <button
                                    form={formId}
                                    type="submit"
                                    className='!bg-blue-500'
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className='!bg-red-500'
                                    onClick={handleConfirm}
                                >
                                    {confirmText}
                                </button>
                            )}
                            <button
                                type="button"
                                className='!bg-gray-500'
                                onClick={handleCancel}
                            >
                                {cancelText}
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default Modal
