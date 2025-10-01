import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { get } from "@api/index";
import { Star, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

interface Review {
  _id: string;
  rating: number;
  title: string;
  content: string;
  pros?: string;
  cons?: string;
  helpfulCount: number;
  userId: {
    firstname: string;
    lastname: string;
    profilePicture?: string;
  };
  createdAt: string;
}

interface ReviewListProps {
  companyId?: string;
  reviews?: Review[];
}

function ReviewList({ companyId, reviews: initialReviews }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [loading, setLoading] = useState(!initialReviews);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (companyId && !initialReviews) {
      fetchReviews();
    }
  }, [companyId, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response: any = await get(`/company/${companyId}/reviews?page=${page}&limit=10`);
      
      if (response.success) {
        setReviews(prev => page === 1 ? response.data.reviews : [...prev, ...response.data.reviews]);
        setHasMore(response.data.page < response.data.pages);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          No reviews yet. Be the first to review!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review._id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={review.userId?.profilePicture}
                    alt={`${review.userId?.firstname} ${review.userId?.lastname}`}
                  />
                  <AvatarFallback>
                    {review.userId?.firstname?.[0]}
                    {review.userId?.lastname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">
                    {review.userId?.firstname} {review.userId?.lastname}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </div>
                </div>
              </div>
              {renderStars(review.rating)}
            </div>
            <CardTitle className="mt-2">{review.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">{review.content}</p>

            {review.pros && (
              <div>
                <Badge variant="secondary" className="mb-2 bg-green-100 text-green-800">
                  Pros
                </Badge>
                <p className="text-sm text-gray-600">{review.pros}</p>
              </div>
            )}

            {review.cons && (
              <div>
                <Badge variant="secondary" className="mb-2 bg-red-100 text-red-800">
                  Cons
                </Badge>
                <p className="text-sm text-gray-600">{review.cons}</p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <ThumbsUp className="h-4 w-4" />
                Helpful ({review.helpfulCount})
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {hasMore && companyId && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More Reviews"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ReviewList;
