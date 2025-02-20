"use client"
import { formatDateStringToLocal } from "@/lib/utils";
import React from "react";

const blogPosts = [
  {
    id: 1,
    title: "Spring Festival Announced!",
    description: "Join us for the annual Spring Festival with food, music, and activities.",
    date: "2025-03-20",
    location: "Central Park",
    tag: "Upcoming Event"
  },
  {
    id: 2,
    title: "Valentine's Day Recap",
    description: "A look back at our successful Valentine's Day speed dating event!",
    date: "2025-02-14",
    location: "Downtown Cafe",
    tag: "Past Event"
  },
  {
    id: 3,
    title: "Dog Day at the Park",
    description: "An exciting day filled with activities for dog lovers and their pets.",
    date: "2025-04-05",
    location: "Riverside Park",
    tag: "Upcoming Event"
  }
];

const BlogPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4 text-gray-200">
      <h1 className="text-2xl font-bold mb-4 text-green-300">Community Blog</h1>
      <div className="w-full max-w-2xl space-y-4">
        {blogPosts.map((post, index) => (
          <div key={post.id} className={`p-4 rounded-lg shadow-md border border-gray-700 ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}` }>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-blue-300">{post.title}</h2>
              <span className={`px-2 py-1 text-sm rounded-lg ${post.tag === "Upcoming Event" ? "bg-green-400 text-gray-900" : "bg-gray-500 text-gray-900"}`}>{post.tag}</span>
            </div>
            <p className="text-gray-400">📅 {formatDateStringToLocal(post.date)} | 📍 {post.location}</p>
            <p className="text-gray-300 mt-2">{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;

