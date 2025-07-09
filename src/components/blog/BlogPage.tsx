import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { toast } from "react-toastify";
import { MapLocationPicker } from '../location/MapLocationPicker';
import { MarkdownEditor } from '../markdown/MarkdownEditor';
import { TagInput } from './TagInput';
import { getBlogById, updateBlogAPI } from '../../utils/api/blog';
import type { Blog, BlogStatus } from '../../types/Blog';
import { isAxiosError } from 'axios';
import type { Transport } from '../../types/Transport';
import type { Lodge } from '../../types/Lodge';
import type { Food } from '../../types/Food';
import type { BlogInsight } from '../../types/BlogInsight';
import MarkdownRenderer from '../markdown/MarkdownRenderer';
import type { UserResponse } from '../../types/User';
import { LocationSearch } from '../location/LocationSearch';
import TransportList from './transports/TransportList';
import AccomodationList from './lodges/AccomodationList';
import { useAuth } from '../../context/useAuth';
import { reactToBlogAPI, removeReactionAPI, getUsersWhoReactedAPI } from "../../utils/api/blog";
import { FaHeart } from "react-icons/fa";
import ReactedUsersModal from './ReactedUsersModal';

type TabOption = "transports" | "accommodations" | "foods" | "insights";

const BlogPage: React.FC = () => {
    const { blogId } = useParams<{ blogId: string }>();

    const { user } = useAuth();
    const [hasReacted, setHasReacted] = useState(false);
    const [reactionUsers, setReactionUsers] = useState<UserResponse[]>([]);
    const [isReactionModalOpen, setIsReactionModalOpen] = useState(false);

    const [blogData, setBlogData] = useState<{
        blog: Blog;
        transports: Transport[];
        lodges: Lodge[];
        food: Food[];
        insights: BlogInsight[];
        creator: UserResponse;
    } | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [isEditing, setIsEditing] = useState<{
        title: boolean;
        coverImage: boolean;
        tags: boolean;
        content: boolean;
        location: boolean;
        status: boolean;
    }>({
        title: false,
        coverImage: false,
        tags: false,
        content: false,
        location: false,
        status: false,
    });

    const [editData, setEditData] = useState<{
        title: string;
        coverImage: string;
        tags: string[];
        content: string;
        locationName: string;
        locationPoints: { lat: number; long: number };
        status: BlogStatus;
    }>({
        title: '',
        coverImage: '',
        tags: [],
        content: '',
        locationName: '',
        locationPoints: { lat: 0, long: 0 },
        status: 'DRAFT'
    });

    const [isMapOpen, setIsMapOpen] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState<TabOption>("accommodations");

    useEffect(() => {
        const loadBlogData = async () => {
            try {
                setLoading(true);
                const data = await getBlogById(blogId!);
                setBlogData(data);

                setEditData({
                    title: data.blog.title,
                    coverImage: data.blog.cover_image || '',
                    tags: data.blog.tags || [],
                    content: data.blog.description,
                    locationName: data.blog.locationName,
                    locationPoints: data.blog.location_points,
                    status: data.blog.status
                });

                if (user && blogId) {
                    const fetchReactionStatus = async () => {
                        const users = await getUsersWhoReactedAPI(blogId);
                        setReactionUsers(users);
                        setHasReacted(users.some(u => u.id === user.id));
                    };
                    fetchReactionStatus();
                }

            } catch (err) {
                setError('Failed to load blog data');
                console.error('Error loading blog:', err);
            } finally {
                setLoading(false);
            }
        };

        if (blogId) {
            loadBlogData();
        }
    }, [blogId, user]);

    const handleLocationSelect = (location: { name: string; lat: number; long: number }) => {
        setEditData(prev => ({
            ...prev,
            locationName: location.name,
            locationPoints: {
                lat: location.lat,
                long: location.long
            }
        }));
    };

    const handleToggleReaction = async () => {
        try {
            if (!blogId || !user) return;

            if (hasReacted) {
                await removeReactionAPI(blogId);
                setReactionUsers(prev => prev.filter(u => u.id !== user.id));
                setHasReacted(false);
                toast.info("Reaction removed.");
            } else {
                await reactToBlogAPI(user.id, blogId);
                setReactionUsers(prev => [...prev, user]);
                setHasReacted(true);
                toast.success("You reacted this blog!");
            }
        } catch (err) {
            toast.error("Failed to update reaction.");
            console.error(err);
        }
    };


    const handleUpdate = async (field: keyof typeof isEditing) => {
        if (!blogData) return;

        try {
            setUpdating(true);
            let updatePayload: Partial<Blog> = {};

            switch (field) {
                case 'title':
                    updatePayload = { title: editData.title };
                    break;
                case 'coverImage':
                    updatePayload = { cover_image: editData.coverImage };
                    break;
                case 'tags':
                    updatePayload = { tags: editData.tags };
                    break;
                case 'content':
                    updatePayload = { description: editData.content };
                    break;
                case 'status':
                    updatePayload = { status: editData.status };
                    break;
                case 'location':
                    updatePayload = {
                        locationName: editData.locationName,
                        location_points: editData.locationPoints
                    };
                    break;
            }

            const updatedBlog = await updateBlogAPI(blogData.blog.id, updatePayload);

            setBlogData(prev => prev ? { ...prev, blog: updatedBlog } : null);
            setIsEditing(prev => ({ ...prev, [field]: false }));

        } catch (err) {
            let errorMessage = 'Failed to update blog';
            if (isAxiosError(err) && err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            setError(errorMessage);
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = (field: keyof typeof isEditing) => {
        if (!blogData) return;
        setEditData(prev => ({
            ...prev,
            title: blogData.blog.title,
            coverImage: blogData.blog.cover_image || '',
            tags: blogData.blog.tags || [],
            content: blogData.blog.description,
            locationName: blogData.blog.locationName,
            locationPoints: blogData.blog.location_points,
            status: blogData.blog.status,
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

    if (!blogData) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span>Blog not found</span>
                </div>
            </div>
        );
    }

    const { blog } = blogData;

    return (
        <div className="max-w-6xl mx-auto p-6 font-nunito">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="mb-8">
                        {!isEditing.coverImage ? (
                            <div className="relative group">
                                {blog.cover_image ? (
                                    <img
                                        src={blog.cover_image}
                                        alt={blog.title}
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

                    <div className="mb-6">
                        {!isEditing.title ? (
                            <div className="flex items-center gap-4 group">
                                <h1 className="text-4xl font-bold flex-1">{blog.title}</h1>
                                <button
                                    className="btn btn-sm btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => setIsEditing(prev => ({ ...prev, title: true }))}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={editData.title}
                                    onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                                    className="input input-bordered w-full text-2xl"
                                    placeholder="Blog title..."
                                />
                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleUpdate('title')}
                                        disabled={updating}
                                    >
                                        {updating ? 'Updating...' : 'Save'}
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => handleCancel('title')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mb-6">
                        {!isEditing.location ? (
                            <div className="flex items-center gap-2 group">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-lg text-base-content/80">{blog.locationName}</span>
                                <span className="text-sm text-base-content/60">
                                    ({blog.location_points.lat.toFixed(4)}, {blog.location_points.long.toFixed(4)})
                                </span>
                                <button
                                    className="btn btn-sm btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => setIsEditing(prev => ({ ...prev, location: true }))}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <LocationSearch
                                            onLocationSelect={handleLocationSelect}
                                            placeholder="Search for a location..."
                                            value={editData.locationName}
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

                                {editData.locationName && (
                                    <div className="bg-base-200 p-3 rounded-lg text-sm">
                                        <div className="font-medium">{editData.locationName}</div>
                                        <div className="text-base-content/70">
                                            {editData.locationPoints.lat.toFixed(6)}, {editData.locationPoints.long.toFixed(6)}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleUpdate('location')}
                                        disabled={updating}
                                    >
                                        {updating ? 'Updating...' : 'Save'}
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

                    <div className="mb-8">
                        {!isEditing.tags ? (
                            <div className="group">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-base-content/70">Tags:</span>
                                    <button
                                        className="btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => setIsEditing(prev => ({ ...prev, tags: true }))}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {blog.tags && blog.tags.length > 0 ? (
                                        blog.tags.map((tag, index) => (
                                            <span key={index} className="badge badge-primary badge-outline">
                                                {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-base-content/60 text-sm">No tags</span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <TagInput
                                    tags={editData.tags}
                                    onChange={(tags) => setEditData(prev => ({ ...prev, tags }))}
                                    placeholder="Add tags..."
                                    maxTags={10}
                                />
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

                    <div className="mb-6">
                        {!isEditing.content ? (
                            <div className="relative group">
                                <button
                                    className="absolute top-4 right-4 btn btn-sm btn-circle btn-primary opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    onClick={() => setIsEditing(prev => ({ ...prev, content: true }))}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <div className="bg-base-50 p-6 rounded-lg border">
                                    <MarkdownRenderer content={blog.description} />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <MarkdownEditor
                                    value={editData.content}
                                    onChange={(value) => setEditData(prev => ({ ...prev, content: value }))}
                                    placeholder="Write your blog content in markdown..."
                                    height={400}
                                />
                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleUpdate('content')}
                                        disabled={updating}
                                    >
                                        {updating ? 'Updating...' : 'Save'}
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => handleCancel('content')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t pt-6 mt-8 flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                            <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Updated: {new Date(blog.updated_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {!isEditing.status ? (
                                    <>
                                        <span className={`badge ${blog.status === 'PUBLISHED' ? 'badge-success' : blog.status === 'ARCHIVED' ? 'badge-neutral' : 'badge-warning'} badge-sm`}>
                                            {blog.status}
                                        </span>
                                        <button
                                            className="btn btn-xs btn-ghost"
                                            onClick={() => setIsEditing(prev => ({ ...prev, status: true }))}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <select
                                            className="select select-sm select-bordered"
                                            value={editData.status}
                                            onChange={(e) =>
                                                setEditData(prev => ({ ...prev, status: e.target.value as BlogStatus }))
                                            }
                                        >
                                            <option value="DRAFT">DRAFT</option>
                                            <option value="PUBLISHED">PUBLISHED</option>
                                            <option value="ARCHIVED">ARCHIVED</option>
                                        </select>
                                        <button
                                            className="btn btn-primary btn-xs"
                                            onClick={() => handleUpdate('status')}
                                            disabled={updating}
                                        >
                                            {updating ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-xs"
                                            onClick={() => handleCancel('status')}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <section>
                            <div className="flex items-center gap-4">
                                <button
                                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                                    onClick={handleToggleReaction}
                                >
                                    <FaHeart className={`w-5 h-5 ${hasReacted ? "text-red-500" : "text-gray-400"}`} />
                                    <span className="text-lg font-semibold">{hasReacted ? "Liked" : "React"}</span>
                                </button>

                                <button
                                    className="text-lg text-blue-600 hover:underline"
                                    onClick={() => setIsReactionModalOpen(true)}
                                >
                                    View reactions ({reactionUsers.length})
                                </button>
                            </div>

                        </section>
                    </div>
                </div>
            </div>
            <MapLocationPicker
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onLocationSelect={handleLocationSelect}
            />
            <ReactedUsersModal
                isOpen={isReactionModalOpen}
                onClose={() => setIsReactionModalOpen(false)}
                users={reactionUsers}
            />

            <section className='min-h-screen'>
                <div className="mt-6">
                    <div role="tablist" className="tabs tabs-boxed font-bold font-nunito">
                        <button
                            role="tab"
                            className={`tab ${activeTab === "transports" ? "tab-active" : ""}`}
                            onClick={() => setActiveTab("transports")}
                        >
                            Transports
                        </button>
                        <button
                            role="tab"
                            className={`tab ${activeTab === "accommodations" ? "tab-active" : ""}`}
                            onClick={() => setActiveTab("accommodations")}
                        >
                            Accommodations
                        </button>
                    </div>

                    <div className="mt-4">
                        {activeTab === "transports" && <TransportList />}
                        {activeTab === "accommodations" && <AccomodationList />}
                    </div>
                </div>
            </section>
        </div>
    );
};


export default BlogPage;