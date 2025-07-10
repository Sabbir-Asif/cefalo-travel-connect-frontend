import React, { useEffect, useState } from 'react';
import type { WishlistWithUser } from '../../types/Wishlist';
import { getWishlistByIdAPI, updateWishlistAPI } from '../../utils/api/wishlist';
import { useParams } from 'react-router';

const WishlistPage: React.FC = () => {
    const [wishlist, setWishlist] = useState<WishlistWithUser>({} as WishlistWithUser);
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [noteValue, setNoteValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const { wishlistId } = useParams();


    useEffect(() => {
        const fetchWishlist = async () => {
            if (!wishlistId) {
                setIsLoading(false);
                return;
            }
            try {
                const data = await getWishlistByIdAPI(wishlistId);
                setWishlist(data);
                setNoteValue(data.note || '');
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWishlist();
    }, [wishlistId]);

    const handleStatusToggle = async () => {
        if (!wishlist.id) return;

        const newStatus = wishlist.status === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';

        const modal = document.getElementById('status_modal') as HTMLDialogElement;
        modal?.showModal();

        const confirmBtn = document.getElementById('confirm_status_change');
        const cancelBtn = document.getElementById('cancel_status_change');

        const handleConfirm = async () => {
            setIsUpdating(true);
            try {
                const updatedWishlist = await updateWishlistAPI(wishlist.id, { status: newStatus });
                setWishlist(updatedWishlist);
            } catch (error) {
                console.error('Error updating status:', error);
            } finally {
                setIsUpdating(false);
                modal?.close();
            }
        };

        const handleCancel = () => {
            modal?.close();
        };

        confirmBtn?.addEventListener('click', handleConfirm, { once: true });
        cancelBtn?.addEventListener('click', handleCancel, { once: true });
    };

    const handleNoteUpdate = async () => {
        if (!wishlist.id || noteValue === wishlist.note) {
            setIsEditingNote(false);
            return;
        }

        setIsUpdating(true);
        try {
            const updatedWishlist = await updateWishlistAPI(wishlist.id, { note: noteValue });
            setWishlist(updatedWishlist);
            setIsEditingNote(false);
        } catch (error) {
            console.error('Error updating note:', error);
            setNoteValue(wishlist.note || '');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleNoteCancel = () => {
        setNoteValue(wishlist.note || '');
        setIsEditingNote(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!wishlist.id) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-error mb-2">Wishlist not found</h2>
                    <p className="text-base-content/70">The wishlist you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 font-nunito">
            <div className="relative h-80 bg-gradient-to-r from-primary to-secondary">
                {wishlist.cover_image ? (
                    <img
                        src={wishlist.cover_image}
                        alt={wishlist.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary to-secondary"></div>
                )}
                <div className="absolute inset-0 bg-black/30"></div>

                <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">
                            {wishlist.status === 'PUBLIC' ? 'Public' : 'Private'}
                        </span>
                        <input
                            type="checkbox"
                            className="toggle toggle-success"
                            checked={wishlist.status === 'PUBLIC'}
                            onChange={handleStatusToggle}
                            disabled={isUpdating}
                        />
                    </div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-base-content mb-2">
                                    {wishlist.title}
                                </h1>
                                <div className="flex items-center gap-2 text-base-content/70">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="font-medium">{wishlist.location_name}</span>
                                    {wishlist.location_point && (
                                        <span className="text-sm">
                                            ({wishlist.location_point.lat}, {wishlist.location_point.long})
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="avatar">
                                    <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center">
                                        {wishlist.user?.displayPicture ? (
                                            <img src={wishlist.user.displayPicture} alt={wishlist.user.name} />
                                        ) : (
                                            <span className="text-lg font-bold">
                                                {wishlist.user?.name?.charAt(0) || 'U'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-base-content">{wishlist.user?.name}</p>
                                    <p className="text-sm text-base-content/70">{wishlist.user?.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-base-content/70">Travel Date</p>
                                    <p className="font-semibold text-base-content">
                                        {new Date(wishlist.travel_date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {wishlist.tags && wishlist.tags.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {wishlist.tags.map((tag, index) => (
                                        <span key={index} className="badge badge-primary badge-lg">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">Note</h3>
                                {!isEditingNote && (
                                    <button
                                        className="btn btn-sm btn-ghost"
                                        onClick={() => setIsEditingNote(true)}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                )}
                            </div>

                            {isEditingNote ? (
                                <div className="space-y-3">
                                    <textarea
                                        className="textarea textarea-bordered w-full"
                                        value={noteValue}
                                        onChange={(e) => setNoteValue(e.target.value)}
                                        placeholder="Add a note..."
                                        rows={3}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={handleNoteUpdate}
                                            disabled={isUpdating}
                                        >
                                            {isUpdating ? (
                                                <span className="loading loading-spinner loading-xs"></span>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Save
                                                </>
                                            )}
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={handleNoteCancel}
                                            disabled={isUpdating}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-base-200 p-4 rounded-lg">
                                    <p className="text-base-content">
                                        {wishlist.note || 'No note added yet.'}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-base-300">
                            <div>
                                <p className="text-sm text-base-content/70">Created</p>
                                <p className="font-medium">
                                    {new Date(wishlist.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-base-content/70">Last Updated</p>
                                <p className="font-medium">
                                    {new Date(wishlist.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <dialog id="status_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Confirm Status Change</h3>
                    <p className="py-4">
                        Are you sure you want to change the status to{' '}
                        <span className="font-semibold">
                            {wishlist.status === 'PUBLIC' ? 'Private' : 'Public'}
                        </span>?
                    </p>
                    <div className="modal-action">
                        <button id="cancel_status_change" className="btn">Cancel</button>
                        <button id="confirm_status_change" className="btn btn-primary">
                            {isUpdating ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                'Confirm'
                            )}
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default WishlistPage;