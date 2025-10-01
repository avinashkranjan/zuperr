import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { get } from "@api/index";
import { MapPin, Building2, Users, Star, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import ReviewList from "./ReviewList";
import CommentThread from "../comment/CommentThread";

interface Company {
  _id: string;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  companySize?: string;
  description?: string;
  address?: {
    line1?: string;
    district?: string;
    state?: string;
    country?: string;
  };
  averageRating: number;
  totalReviews: number;
  trustScore: number;
  industries?: string[];
  recentReviews?: any[];
}

function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "comments">("overview");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const response: any = await get(`/company/${id}`);
        
        if (response.success) {
          setCompany(response.data);
        } else {
          setError("Failed to load company details");
        }
      } catch (err: any) {
        console.error("Error fetching company:", err);
        setError(err.message || "Failed to load company details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompany();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 text-lg mb-4">{error || "Company not found"}</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header Section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24 rounded-lg">
              <AvatarImage
                src={company.companyLogo || undefined}
                alt={`${company.companyName} logo`}
              />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-lg">
                {company.companyName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {company.companyName}
                  </h1>
                  
                  {company.address && (
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {[
                          company.address.district,
                          company.address.state,
                          company.address.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {company.companyWebsite && (
                    <a
                      href={company.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.companyWebsite}
                    </a>
                  )}
                </div>

                {/* Rating Display */}
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">
                      {company.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {company.totalReviews} reviews
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 mt-4">
                {company.companySize && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {company.companySize} employees
                  </Badge>
                )}
                
                <Badge variant="secondary" className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Trust Score: {company.trustScore.toFixed(1)}/10
                </Badge>

                {company.industries && company.industries.length > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {company.industries[0]}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-4 border-b-2 font-medium ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-2 px-4 border-b-2 font-medium ${
              activeTab === "reviews"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Reviews ({company.totalReviews})
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`py-2 px-4 border-b-2 font-medium ${
              activeTab === "comments"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Discussion
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6">
          {company.description && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{company.description}</p>
              </CardContent>
            </Card>
          )}

          {company.recentReviews && company.recentReviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewList reviews={company.recentReviews} />
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setActiveTab("reviews")}
                >
                  View All Reviews
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "reviews" && (
        <ReviewList companyId={id!} />
      )}

      {activeTab === "comments" && (
        <CommentThread resourceType="Company" resourceId={id!} />
      )}
    </div>
  );
}

export default CompanyDetails;
