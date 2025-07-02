import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { MapLocationPicker } from '../location/MapLocationPicker';
import { LocationSearch } from '../location/LocationSearch';
import { TagInput } from '../blog/TagInput';
import { createTravelPlaceAPI } from '../../utils/api/travel-place';
import type { CreateTravelPlace } from '../../types/TravelPlace';

const CreateTravelPageFormComponent: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateTravelPlace>({
        name: '',
        location_name: '',
        location_point: { lat: 0, long: 0 },
        cover_image: '',
        description: '',
        tags: [],
    });

    const [isMapOpen, setIsMapOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string>('');

    const handleLocationSelect = (location: { name: string; lat: number; long: number }) => {
        setFormData(prev => ({
            ...prev,
            location_name: location.name,
            location_point: {
                lat: location.lat,
                long: location.long
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('Place name is required');
            return;
        }

        if (!formData.location_name.trim()) {
            setError('Location is required');
            return;
        }

        if (formData.location_point.lat === 0 && formData.location_point.long === 0) {
            setError('Please select a valid location');
            return;
        }

        try {
            setCreating(true);
            setError('');

            const createData: CreateTravelPlace = {
                name: formData.name.trim(),
                location_name: formData.location_name,
                location_point: formData.location_point,
                cover_image: formData.cover_image?.trim(),
                description: formData.description?.trim(),
                tags: (formData.tags ?? []).length > 0 ? formData.tags : undefined,
            };

            const newTravelPlace = await createTravelPlaceAPI(createData);
            navigate(`/travel-places/${newTravelPlace.id}`);

        } catch (err) {
            const errorMessage = 'Failed to create travel place';
            console.log(err);
            setError(errorMessage);
        } finally {
            setCreating(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            location_name: '',
            location_point: { lat: 0, long: 0 },
            cover_image: '',
            description: '',
            tags: [],
        });
        setError('');
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-base-content">Create New Travel Place</h1>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn btn-ghost btn-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-error mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">
                                    Place Name <span className="text-error">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="input input-bordered w-full"
                                placeholder="Enter place name"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                            </label>
                            <LocationSearch
                                onLocationSelect={handleLocationSelect}
                                value={formData.location_name}
                            />
                            {formData.location_point.lat !== 0 && formData.location_point.long !== 0 && (
                                <div className="text-sm text-base-content/60 mt-2">
                                    Coordinates: {formData.location_point.lat.toFixed(4)}, {formData.location_point.long.toFixed(4)}
                                </div>
                            )}
                            <div className="mt-2">
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setIsMapOpen(true)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Select on Map
                                </button>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Cover Image URL</span>
                            </label>
                            <input
                                type="url"
                                value={formData.cover_image}
                                onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                                className="input input-bordered w-full"
                                placeholder="https://example.com/image.jpg"
                            />
                            {formData.cover_image && (
                                <div className="mt-4">
                                    <img
                                        src={formData.cover_image}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Tags</span>
                            </label>
                            <TagInput
                                tags={formData.tags || []}
                                onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                                placeholder="Add tags (e.g., mountain, nature, adventure)..."
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Description</span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="textarea textarea-bordered h-32 w-full"
                                placeholder="Describe this travel place..."
                            />
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button
                                type="submit"
                                className="btn btn-primary flex-1"
                                disabled={creating || !formData.name.trim() || !formData.location_name.trim()}
                            >
                                {creating ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm mr-2"></span>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create Travel Place
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="btn btn-ghost"
                                disabled={creating}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset
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

export default CreateTravelPageFormComponent;