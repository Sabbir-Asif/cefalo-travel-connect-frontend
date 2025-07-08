import React, { useState } from 'react';
import { type Blog } from "../../types/Blog";
import { type CreateWishlist } from "../../types/Wishlist";
import { createWishlistAPI } from "../../utils/api/wishlist";
import { uploadImageToCloudinary } from '../../utils/cloudinary';


interface CreateWishlistModalFromBlogProps {
    blog: Blog;
    isOpen: boolean;
    onClose: () => void;
}

const CreateWishlistModalFromBlog: React.FC<CreateWishlistModalFromBlogProps> = ({
    blog,
    isOpen,
    onClose
}) => {
    const [title, setTitle] = useState('');
    const [travelDate, setTravelDate] = useState('');
    const [tags, setTags] = useState('');
    const [note, setNote] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [status, setStatus] = useState<'PRIVATE' | 'PUBLIC'>('PRIVATE');
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);


    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        const toast = document.createElement('div');
        toast.className = `alert ${type === 'success' ? 'alert-success' : 'alert-error'} mb-4`;
        toast.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${type === 'success' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'}" />
            </svg>
            <span>${message}</span>
        `;

        const toastContainer = document.querySelector('.toast') || document.body;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !travelDate) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        setIsLoading(true);

        try {
            const wishlistData: CreateWishlist = {
                title: title.trim(),
                location_name: blog.locationName,
                location_point: blog.location_points,
                travel_date: new Date(travelDate),
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
                note: note.trim() || undefined,
                cover_image: coverImage.trim() || blog.cover_image || undefined,
                status,
                blog_id: blog.id
            };

            await createWishlistAPI(wishlistData);
            showToast('Wishlist created successfully!');
            handleClose();
        } catch (error) {
            console.error('Error creating wishlist:', error);
            showToast('Failed to create wishlist. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setTitle('');
        setTravelDate('');
        setTags('');
        setNote('');
        setCoverImage('');
        setStatus('PRIVATE');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-md">
                <h3 className="font-bold text-lg mb-4">Add to Wishlist</h3>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Blog:</p>
                    <p className="font-medium">{blog.title}</p>
                    <p className="text-sm text-gray-500">{blog.locationName}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Title *</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter wishlist title"
                            className="input input-bordered w-full"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Travel Date *</span>
                        </label>
                        <input
                            type="date"
                            className="input input-bordered w-full"
                            value={travelDate}
                            onChange={(e) => setTravelDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Tags</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter tags separated by commas"
                            className="input input-bordered w-full"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                        <label className="label">
                            <span className="label-text-alt">Separate multiple tags with commas</span>
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Note</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered h-20"
                            placeholder="Add a personal note..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Cover Image</span>
                        </label>

                        <input
                            type="url"
                            placeholder="Enter image URL (optional)"
                            className="input input-bordered w-full mb-2"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                setUploading(true);
                                setUploadError(null);

                                try {
                                    const url = await uploadImageToCloudinary(file);
                                    setCoverImage(url);
                                    showToast("Image uploaded successfully!");
                                } catch (err) {
                                    console.error(err);
                                    setUploadError((err as Error).message);
                                    showToast("Image upload failed", "error");
                                } finally {
                                    setUploading(false);
                                }
                            }}
                            className="file-input file-input-bordered w-full"
                        />

                        {uploading && (
                            <label className="label">
                                <span className="label-text-alt text-info">Uploading...</span>
                            </label>
                        )}

                        {uploadError && (
                            <label className="label">
                                <span className="label-text-alt text-error">{uploadError}</span>
                            </label>
                        )}

                        {coverImage && (
                            <div className="mt-2">
                                <img
                                    src={coverImage}
                                    alt="Cover Preview"
                                    className="rounded-md shadow-md max-h-40 object-contain"
                                />
                            </div>
                        )}

                        <label className="label">
                            <span className="label-text-alt">Leave empty to use travel place image</span>
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Privacy</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as 'PRIVATE' | 'PUBLIC')}
                        >
                            <option value="PRIVATE">Private</option>
                            <option value="PUBLIC">Public</option>
                        </select>
                    </div>

                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Creating...
                                </>
                            ) : (
                                'Add to Wishlist'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateWishlistModalFromBlog;