import React, { useState, type FormEvent } from 'react';
import { MapLocationPicker } from './MapLocationPicker';
import { MarkdownEditor } from './MarkdownEditor';
import { TagInput } from './TagInput';
import type { Blog, CreateBlog } from '../../types/Blog';
import { createBlogAPI } from '../../utils/api/blog';
import { LocationSearch } from './LocationSearch\'';
import { isAxiosError } from 'axios';

interface CreateBlogFormProps {
    onSuccess?: (blog: Blog) => void;
    onError?: (error: string) => void;
}

export const CreateBlogForm: React.FC<CreateBlogFormProps> = ({
    onSuccess,
    onError
}) => {
    const [formData, setFormData] = useState<CreateBlog>({
        title: '',
        locationName: '',
        location_points: { lat: 0, long: 0 },
        description: '',
        tags: [],
        images: [],
        videos: []
    });

    const [isMapOpen, setIsMapOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.locationName.trim()) {
            newErrors.location = 'Location is required';
        }

        if (formData.location_points.lat === 0 && formData.location_points.long === 0) {
            newErrors.location = 'Please select a valid location';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLocationSelect = (location: { name: string; lat: number; long: number }) => {
        setFormData(prev => ({
            ...prev,
            locationName: location.name,
            location_points: {
                lat: location.lat,
                long: location.long
            }
        }));
        setErrors(prev => ({ ...prev, location: '' }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const blog = await createBlogAPI(formData);
            onSuccess?.(blog);
            setFormData({
                title: '',
                locationName: '',
                location_points: { lat: 0, long: 0 },
                description: '',
                tags: [],
                images: [],
                videos: []
            });
            setErrors({});
        } catch (error) {
            let errorMessage = 'Failed to create blog';

            if (isAxiosError(error) && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            setErrors({ submit: errorMessage });
            onError?.(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="card bg-gray-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-6">Create New Blog</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Title *</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter blog title..."
                                className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                            />
                            {errors.title && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.title}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Location *</span>
                            </label>

                            <div className="flex gap-2 mb-2">
                                <div className="flex-1">
                                    <LocationSearch
                                        onLocationSelect={handleLocationSelect}
                                        placeholder="Search for a location..."
                                        value={formData.locationName}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-outline btn-primary"
                                    onClick={() => setIsMapOpen(true)}
                                >
                                    Select on Map
                                </button>
                            </div>

                            {formData.locationName && (
                                <div className="bg-base-200 p-3 rounded-lg text-sm">
                                    <div className="font-medium">{formData.locationName}</div>
                                    <div className="text-base-content/70">
                                        {formData.location_points.lat.toFixed(6)}, {formData.location_points.long.toFixed(6)}
                                    </div>
                                </div>
                            )}

                            {errors.location && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.location}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <MarkdownEditor
                                value={formData.description}
                                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                                placeholder="Write your blog description in markdown..."
                                height={300}
                            />
                            {errors.description && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.description}</span>
                                </label>
                            )}
                        </div>

                        <TagInput
                            tags={formData.tags || []}
                            onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                            placeholder="Add tags to help categorize your blog..."
                            maxTags={10}
                        />

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Cover Image URL (Optional)</span>
                            </label>
                            <input
                                type="url"
                                value={formData.cover_image || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                                placeholder="https://example.com/image.jpg"
                                className="input input-bordered w-full"
                            />
                            <label className="label">
                                <span className="label-text-alt">Add a cover image URL for your blog</span>
                            </label>
                        </div>
                        {errors.submit && (
                            <div className="alert alert-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{errors.submit}</span>
                            </div>
                        )}
                        <div className="card-actions justify-end pt-4">
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => {
                                    setFormData({
                                        title: '',
                                        locationName: '',
                                        location_points: { lat: 0, long: 0 },
                                        description: '',
                                        tags: [],
                                        images: [],
                                        videos: []
                                    });
                                    setErrors({});
                                }}
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Creating...
                                    </>
                                ) : (
                                    'Create Blog'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <MapLocationPicker
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onLocationSelect={handleLocationSelect}
            />
        </div>
    );
};