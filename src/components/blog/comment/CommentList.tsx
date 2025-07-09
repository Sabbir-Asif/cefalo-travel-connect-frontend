import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { CommentResponse } from '../../../types/Comment';
import { createCommentAPI, deleteCommentAPI, getCommentsForBlogAPI } from '../../../utils/api/blog';
import CommentCard from './CommentCard';

interface CommentListProps {
    blogId: string;
}

const CommentList: React.FC<CommentListProps> = ({ blogId }) => {
    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    const loadComments = async () => {
        try {
            const data = await getCommentsForBlogAPI(blogId);
            setComments(data);
        } catch {
            toast.error('Failed to load comments');
        }
    };

    useEffect(() => {
        const loadComments = async () => {
            try {
                const data = await getCommentsForBlogAPI(blogId);
                setComments(data);
            } catch {
                toast.error('Failed to load comments');
            }
        };
        loadComments();
    }, [blogId]);

    const handleCreateComment = async () => {
        if (!newComment.trim()) return;
        try {
            setLoading(true);
            await createCommentAPI(blogId, {
                label: 'comment',     // label is hardcoded intentionally
                data: newComment.trim(),
            });
            setNewComment('');
            await loadComments();
            toast.success('Comment posted');
        } catch {
            toast.error('Failed to post comment');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteCommentAPI(commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
            toast.success('Comment deleted');
        } catch {
            toast.error('Failed to delete comment');
        }
    };

    return (
        <div className="mt-12">
            <h3 className="text-lg font-bold mb-4">Comments</h3>

            <div className="flex gap-2 mb-6">
                <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Write a comment..."
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                    className="btn btn-primary h-fit"
                    disabled={loading || !newComment.trim()}
                    onClick={handleCreateComment}
                >
                    {loading ? 'Posting...' : 'Post'}
                </button>
            </div>

            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <CommentCard key={comment.id} comment={comment} onDelete={handleDeleteComment} />
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
};

export default CommentList;
