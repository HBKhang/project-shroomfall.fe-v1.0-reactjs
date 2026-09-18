import React, { useState } from 'react';
import { useImportRoomDefinition } from '../../api/hooks/useDesign'; // Adjust import path as needed

export const RoomDefinitionUploadModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { mutate: uploadRoom, isPending } = useImportRoomDefinition();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        uploadRoom(selectedFile, {
            onSuccess: () => {
                onClose();
            },
            onError: (err: any) => {
                console.error("Failed to upload room definition:", {
                    status: err.response?.status,
                    message: err.message,
                    serverError: err.response?.data,
                });
            }
        });
    };

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-sky-100 bg-white p-5 shadow-sm max-w-lg mx-auto">
            <h3 className="text-base font-semibold text-sky-950">Upload Room Definition Package</h3>
            <p className="text-sm text-sky-600/80">Select a layout or map data file to upload into the definition studio.</p>

            <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-sky-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-sky-50 file:text-sky-700
                        hover:file:bg-sky-100 cursor-pointer"
                />

                <div className="flex justify-end gap-2 pt-2 border-t border-sky-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!selectedFile || isPending}
                        className={`rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${
                            selectedFile && !isPending ? 'hover:bg-sky-500 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                        }`}
                    >
                        {isPending ? 'Uploading...' : 'Upload File'}
                    </button>
                </div>
            </form>
        </div>
    );
};