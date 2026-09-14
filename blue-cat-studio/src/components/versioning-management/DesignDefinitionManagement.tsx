import React, { useState } from 'react';
import { useUpdateDesignDefinition } from '../../api/hooks/useDesign';
import type { UpdateDefinitionDTO } from '../../contracts/dto/feature/design/command/update-definition-dto';

export const DesignDefinitionManagement: React.FC = () => {
    const { mutate: updateDefinition, isPending } = useUpdateDesignDefinition();

    const [key, setKey] = useState('global_definition');
    const [description, setDescription] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleCommitSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);

        const parsedDto: UpdateDefinitionDTO = {
            key: key.trim(),
            description: description.trim() || undefined,
        };

        updateDefinition(parsedDto, {
            onSuccess: () => {
                setFeedback({ type: 'success', message: 'Design definition successfully synchronized with the core.' });
                setKey('global_definition');
                setDescription('');
            },
            onError: (err: any) => {
                const responseData = err.response?.data;
                let errorMsg = 'Failed to commit design updates.';
                if (responseData?.message) {
                    errorMsg = Array.isArray(responseData.message) ? responseData.message.join(', ') : responseData.message;
                }
                setFeedback({ type: 'error', message: errorMsg });
            }
        });
    };

    return (
        <div className="min-h-screen bg-sky-50/50 p-8 font-sans antialiased text-sky-950">
            <header className="mb-8 border-b border-sky-100 pb-5">
                <h1 className="text-2xl font-bold tracking-tight text-sky-950">Design Definition Registry</h1>
                <p className="mt-1.5 text-sm text-sky-600/80">Manage core system design definitions and global schema overrides.</p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 w-full">
                {/* Form Section */}
                <div className="xl:col-span-3 rounded-xl border border-sky-100 bg-white p-6 shadow-sm">
                    <form onSubmit={handleCommitSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-sky-500">Target Key</label>
                            <input
                                type="text"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                placeholder="e.g. ui.global.theme_primary"
                                className="w-full rounded-lg border border-sky-200 bg-sky-50/30 p-3 text-sm text-sky-900 font-mono focus:border-sky-400 focus:bg-white outline-none transition"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-sky-500">Definition Payload</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter structural definition details..."
                                className="w-full h-64 rounded-lg border border-sky-200 bg-sky-50/30 p-3 text-sm text-sky-900 font-mono focus:border-sky-400 focus:bg-white outline-none transition resize-none"
                            />
                        </div>

                        {feedback && (
                            <div className={`p-3 rounded-lg text-sm font-medium ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {feedback.message}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isPending || !key.trim()}
                                className="rounded-lg bg-sky-600 px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-sky-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? 'Committing...' : 'Commit to Registry'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar with updated note */}
                <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-6 text-sky-900 shadow-sm h-fit">
                    <h3 className="font-bold text-sky-700 mb-4 uppercase tracking-widest text-xs">System Protocol</h3>
                    <div className="space-y-4 text-xs text-sky-700/80 leading-relaxed">
                        <p>
                            <strong>Important:</strong> This action will reload the definition cache, update the new version log, and notify current active users to refresh their meta data.
                        </p>
                        <p>Ensure that all changes follow the strict schema requirements before committing to production.</p>
                        <div className="mt-6 pt-6 border-t border-sky-200">
                            <p className="text-[10px] text-sky-500 uppercase font-bold">Status</p>
                            <p className="mt-2 text-sky-600 italic">Ready for synchronized transmission.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};