import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AiOutlineDelete } from 'react-icons/ai';
import { useAuth } from '../../../context/useAuth';
import type { CommentResponse } from '../../../types/Comment';

interface CommentCardProps {
  comment: CommentResponse;
  onDelete: (commentId: string) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, onDelete }) => {
  const { user } = useAuth();
  const isOwnComment = user?.id === comment.user.id;

  return (
    <div className="card bg-base-100 shadow-sm border p-4 rounded-lg">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full overflow-hidden">
          {comment.user.displayPicture ? (
            <img
              src={comment.user.displayPicture}
              alt={comment.user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-gray-300 h-full w-full" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">{comment.user.name}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </p>
            </div>
            {isOwnComment && (
              <button
                onClick={() => onDelete(comment.id)}
                className="btn btn-ghost btn-xs text-red-500 hover:text-red-700"
                title="Delete comment"
              >
                <AiOutlineDelete className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-2 text-sm text-base-content">{comment.data}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
