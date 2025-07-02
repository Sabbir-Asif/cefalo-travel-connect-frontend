import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { MapLocationPicker } from '../location/MapLocationPicker';
import { LocationSearch } from '../location/LocationSearch';
import type { TravelPlaceType } from '../../types/TravelPlace';
import { isAxiosError } from 'axios';
import { TagInput } from '../blog/TagInput';
import { getTravelPlaceByIdAPI, updateTravelPlaceAPI } from '../../utils/api/travel-place';


const TravelPlacePage: React.FC = () => {
    const { travelPlaceId } = useParams<{ travelPlaceId: string }>();
    const [travelPlaceData, setTravelPlaceData] = useState<TravelPlaceType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [isEditing, setIsEditing] = useState<{
        name: boolean;
        coverImage: boolean;
        tags: boolean;
        description: boolean;
        location: boolean;
    }>({
        name: false,
        coverImage: false,
        tags: false,
        description: false,
        location: false,
    });

    const [editData, setEditData] = useState<{
        name: string;
        coverImage: string;
        tags: string[];
        description: string;
        locationName: string;
        locationPoint: { lat: number; long: number };
    }>({
        name: '',
        coverImage: '',
        tags: [],
        description: '',
        locationName: '',
        locationPoint: { lat: 0, long: 0 },
    });

    const [isMapOpen, setIsMapOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const loadTravelPlaceData = async () => {
            try {
                setLoading(true);
                const data = await getTravelPlaceByIdAPI(travelPlaceId!);
                setTravelPlaceData(data);

                setEditData({
                    name: data.name,
                    coverImage: data.cover_image || '',
                    tags: data.tags || [],
                    description: data.description || '',
                    locationName: data.location_name,
                    locationPoint: data.location_point,
                });
            } catch (err) {
                setError('Failed to load travel place data');
                console.error('Error loading travel place:', err);
            } finally {
                setLoading(false);
            }
        };

        if (travelPlaceId) {
            loadTravelPlaceData();
        }
    }, [travelPlaceId]);

    const handleLocationSelect = (location: { name: string; lat: number; long: number }) => {
        setEditData(prev => ({
            ...prev,
            locationName: location.name,
            locationPoint: {
                lat: location.lat,
                long: location.long
            }
        }));
    };

    const handleUpdate = async (field: keyof typeof isEditing) => {
        if (!travelPlaceData) return;

        try {
            setUpdating(true);
            let updatePayload: Partial<TravelPlaceType> = {};

            switch (field) {
                case 'name':
                    updatePayload = { name: editData.name };
                    break;
                case 'coverImage':
                    updatePayload = { cover_image: editData.coverImage };
                    break;
                case 'tags':
                    updatePayload = { tags: editData.tags };
                    break;
                case 'description':
                    updatePayload = { description: editData.description };
                    break;
                case 'location':
                    updatePayload = {
                        location_name: editData.locationName,
                        location_point: editData.locationPoint
                    };
                    break;
            }

            const updatedTravelPlace = await updateTravelPlaceAPI(travelPlaceData.id, updatePayload);
            setTravelPlaceData(updatedTravelPlace);
            setIsEditing(prev => ({ ...prev, [field]: false }));

        } catch (err) {
            let errorMessage = 'Failed to update travel place';
            if (isAxiosError(err) && err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            setError(errorMessage);
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = (field: keyof typeof isEditing) => {
        if (!travelPlaceData) return;
        setEditData(prev => ({
            ...prev,
            name: travelPlaceData.name || '',
            coverImage: travelPlaceData.cover_image || '',
            tags: travelPlaceData.tags || [],
            description: travelPlaceData.description ||'',
            locationName: travelPlaceData.location_name,
            locationPoint: travelPlaceData.location_point,
        }));

        setIsEditing(prev => ({ ...prev, [field]: false }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (!travelPlaceData) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>Travel place not found</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    {/* Cover Image Section */}
                    <div className="mb-8">
                        {!isEditing.coverImage ? (
                            <div className="relative group">
                                {travelPlaceData.cover_image ? (
                                    <img
                                        src={travelPlaceData.cover_image}
                                        alt={travelPlaceData.name}
                                        className="w-full h-80 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-80 bg-base-200 rounded-lg flex items-center justify-center">
                                        <span className="text-base-content/60">No cover image</span>
                                    </div>
                                )}
                                <button
                                    className="absolute top-4 right-4 btn btn-sm btn-circle btn-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => setIsEditing(prev => ({ ...prev, coverImage: true }))}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Cover Image URL</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={editData.coverImage}
                                        onChange={(e) => setEditData(prev => ({ ...prev, coverImage: e.target.value }))}
                                        placeholder="https://example.com/image.jpg"
                                        className="input input-bordered w-full"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleUpdate('coverImage')}
                                        disabled={updating}
                                    >
                                        {updating ? 'Updating...' : 'Save'}
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => handleCancel('coverImage')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Name Section */}
                    <div className="mb-6">
                        {!isEditing.name ? (
                            <div className="group relative">
                                <h1 className="text-4xl font-bold text-base-content mb-2 pr-12">
                                    {travelPlaceData.name}
                                </h1>
                                <button
                                    className="absolute top-0 right-0 btn btn-sm btn-circle btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => setIsEditing(prev => ({ ...prev, name: true }))}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Place Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.name}
                                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                                        className="input input-bordered w-full text-2xl"
                                        placeholder="Enter place name"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleUpdate('name')}
                                        disabled={updating || !editData.name.trim()}
                                    >
                                        {updating ? 'Updating...' : 'Save'}
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => handleCancel('name')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Location Section */}
                    <div className="mb-6">
                        {!isEditing.location ? (
                            <div className="group relative">
                                <div className="flex items-center space-x-2 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-lg text-base-content/80 pr-8">
                                        {travelPlaceData.location_name}
                                    </span>
                                    <button
                                        className="btn btn-sm btn-circle btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => setIsEditing(prev => ({ ...prev, location: true }))}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="text-sm text-base-content/60">
                                    Coordinates: {travelPlaceData.location_point.lat.toFixed(4)}, {travelPlaceData.location_point.long.toFixed(4)}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Location</span>
                                    </label>
                                    <LocationSearch
                                        onLocationSelect={handleLocationSelect}
                                        value={editData.locationName}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleUpdate('location')}
                                        disabled={updating}
                                    >
                                        {updating ? 'Updating...' : 'Save'}
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setIsMapOpen(true)}
                                    >
                                        Open Map
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => handleCancel('location')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tags Section */}
                    <div className="mb-6">
                        {!isEditing.tags ? (
                            <div className="group relative">
                                <div className="flex items-center space-x-2 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span className="font-medium text-base-content">Tags</span>
                                    <button
                                        className="btn btn-sm btn-circle btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => setIsEditing(prev => ({ ...prev, tags: true }))}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {travelPlaceData.tags && travelPlaceData.tags.length > 0 ? (
                                        travelPlaceData.tags.map((tag, index) => (
                                            <div key={index} className="badge badge-primary badge-lg">
                                                {tag}
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-base-content/60 italic">No tags added</span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Tags</span>
                                    </label>
                                    <TagInput
                                        tags={editData.tags}
                                        onChange={(tags) => setEditData(prev => ({ ...prev, tags }))}
                                        placeholder="Add tags..."
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleUpdate('tags')}
                                        disabled={updating}
                                    >
                                        {updating ? 'Updating...' : 'Save'}
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => handleCancel('tags')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description Section */}
                    <div className="mb-6">
                        {!isEditing.description ? (
                            <div className="group relative">
                                <div className="flex items-center space-x-2 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="font-medium text-base-content">Description</span>
                                    <button
                                        className="btn btn-sm btn-circle btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => setIsEditing(prev => ({ ...prev, description: true }))}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="prose max-w-none">
                                    <p className="text-base-content/80 leading-relaxed">
                                        {travelPlaceData.description || 'No description available'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Description</span>
                                    </label>
                                    <textarea
                                        value={editData.description}
                                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                                        className="textarea textarea-bordered h-32 w-full"
                                        placeholder="Enter place description..."
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleUpdate('description')}
                                        disabled={updating}
                                    >
                                        {updating ? 'Updating...' : 'Save'}
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => handleCancel('description')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="divider"></div>
                    <div className="text-sm text-base-content/60">
                        <p>Created: {new Date(travelPlaceData.created_at).toLocaleDateString()}</p>
                        <p>Last updated: {new Date(travelPlaceData.updated_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Map Location Picker Modal */}
            <MapLocationPicker
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onLocationSelect={handleLocationSelect}
            />
        </div>
    );
};

export default TravelPlacePage;