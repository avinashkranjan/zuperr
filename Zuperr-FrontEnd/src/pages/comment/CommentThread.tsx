import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { get, post } from "@api/index";
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  MoreVertical,
  Trash2,
  Edit2 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

interface Comment {
  _id: string;
  content: string;
  authorId: string;
  authorType: string;
  upvotes: number;
  downvotes: number;
  score: number;
  depth: number;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  replies?: Comment[];
  replyCount?: number;
}

interface CommentThreadProps {
  resourceType: string;
  resourceId: string;
}

function CommentThread({ resourceType, resourceId }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "createdAt">("score");

  useEffect(() => {
    fetchComments();
  }, [resourceType, resourceId, sortBy]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const sortOrder = sortBy === "score" ? "-score" : "-createdAt";
      const response: any = await get(
        `/comments?resourceType=${resourceType}&resourceId=${resourceId}&sortBy=${sortOrder}`
      );

      if (response.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response: any = await post("/comments", {
        resourceType,
        resourceId,
        content: newComment,
      });

      if (response.success) {
        setNewComment("");
        fetchComments();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    try {
      const response: any = await post("/comments", {
        resourceType,
        resourceId,
        parentId,
        content: replyContent,
      });

      if (response.success) {
        setReplyContent("");
        setReplyingTo(null);
        fetchComments();
      }
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleVote = async (commentId: string, vote: 1 | -1) => {
    try {
      const response: any = await post(`/comments/${commentId}/vote`, { vote });

      if (response.success) {
        fetchComments();
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isReplyOpen = replyingTo === comment._id;

    return (
      <div
        key={comment._id}
        className={`${isReply ? "ml-8 mt-2" : "mt-4"}`}
      >
        <Card className={isReply ? "bg-gray-50" : ""}>
          <CardContent className="p-4">
            <div className="flex gap-3">
              {/* Vote Section */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => handleVote(comment._id, 1)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ArrowUp className="h-5 w-5 text-gray-600 hover:text-orange-500" />
                </button>
                <span className="text-sm font-semibold">
                  {comment.score}
                </span>
                <button
                  onClick={() => handleVote(comment._id, -1)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ArrowDown className="h-5 w-5 text-gray-600 hover:text-blue-500" />
                </button>
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">U</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">User</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                  {comment.isEdited && (
                    <span className="text-xs text-gray-400 italic">(edited)</span>
                  )}
                </div>

                {comment.isDeleted ? (
                  <p className="text-gray-400 italic">[deleted]</p>
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                )}

                {!comment.isDeleted && (
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => setReplyingTo(isReplyOpen ? null : comment._id)}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Reply
                    </button>
                    {comment.replyCount && comment.replyCount > 0 && (
                      <span className="text-sm text-gray-500">
                        {comment.replyCount} {comment.replyCount === 1 ? "reply" : "replies"}
                      </span>
                    )}
                  </div>
                )}

                {/* Reply Input */}
                {isReplyOpen && (
                  <div className="mt-3">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="mb-2"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleReply(comment._id)}
                        disabled={!replyContent.trim()}
                      >
                        Post Reply
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="pl-4">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Sort by:</span>
        <Button
          variant={sortBy === "score" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSortBy("score")}
        >
          Best
        </Button>
        <Button
          variant={sortBy === "createdAt" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSortBy("createdAt")}
        >
          New
        </Button>
      </div>

      {/* New Comment Input */}
      <Card>
        <CardContent className="p-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What are your thoughts?"
            className="mb-3"
            rows={4}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>
        </CardContent>
      </Card>

      {/* Comments List */}
      {comments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No comments yet. Be the first to comment!
          </CardContent>
        </Card>
      ) : (
        <div>
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
}

export default CommentThread;
