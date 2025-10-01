// src/pages/blogs/BlogPage.tsx
import React from "react";
import { Link, useParams } from "react-router-dom";
import { blogData, employerBlogData } from "@src/data/blog";
import { Badge } from "@components/ui/badge";
import { useTypedSelector } from "@src/redux/rootReducer";

export default function BlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const blog = fetchBlogBySlug(slug || "");

  if (!blog) return <p className="p-8 text-center">Blog not found</p>;

  return (
    <article className="container mx-auto px-4 py-10">
      <img
        src={blog.bannerImage}
        alt={blog.title}
        className="rounded-lg mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-xl text-muted-foreground mb-4">{blog.subtitle}</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {blog.tags.map((tag: string) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      {blog.content.map((block: any, i: number) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} className="text-2xl font-semibold mt-6 mb-2">
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p key={i} className="mb-4 leading-7">
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="list-disc ml-6 mb-4">
                {block.items.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            );
          case "callToAction":
            return (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <Link to="/">
                <p
                  key={i}
                  className="mt-6 text-lg font-semibold text-primary hover:underline hover:cursor-pointer"
                >
                  {block.text}
                </p>
              </Link>
            );
          default:
            return null;
        }
      })}
    </article>
  );
}

function fetchBlogBySlug(slug: string) {
  const userType = useTypedSelector((state) => state.App.sessionInfo.userType);
  const isEmployer = userType === "employer";
  const blogs = isEmployer ? employerBlogData : blogData;
  return blogs.find((blog) => blog.slug === slug) || null;
}
