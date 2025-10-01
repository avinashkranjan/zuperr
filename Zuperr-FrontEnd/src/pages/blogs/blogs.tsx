/* eslint-disable jsx-a11y/anchor-is-valid */
// components/BlogGrid.tsx
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import { blogData, employerBlogData } from "@src/data/blog";
import { useTypedSelector } from "@src/redux/rootReducer";

export default function BlogGrid() {
  const userType = useTypedSelector((state) => state.App.sessionInfo.userType);
  const isEmployer = userType === "employer";
  const blogs = isEmployer ? employerBlogData : blogData;
  return (
    <section className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Explore Our Blogs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {blogs.map((blog, index) => (
          <Card key={index} className="hover:shadow-lg transition">
            <img
              src={blog.bannerImage}
              alt={blog.title}
              className="rounded-t-xl h-60 w-full object-cover"
            />
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {blog.subtitle}
              </p>
              <Link to={`/blogs/${blog.slug}`}>
                <Button variant="outline" size="sm">
                  Read More
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
