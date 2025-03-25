import React, { useState } from "react";
import Blogcard from "../components/Blogcard";
import { gql, useQuery } from "@apollo/client";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiGrid, FiList } from "react-icons/fi";

const GET_BLOGS = gql`
  query GetBlogs($category: String) {
    getBlogs(category: $category) {
      id
      title
      image
      post
      category
      created_at
      user_id
    }
  }
`;

const Home = () => {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get("category") || null;
  const [viewMode, setViewMode] = useState("grid"); // grid or list view
  
  const { data, loading, error, refetch } = useQuery(GET_BLOGS, {
    variables: { category },
  });

  const refreshBlogs = () => {
    refetch();
  };

  const handleCategoryChange = (cat) => {
    if (cat) {
      navigate(`/?category=${cat}`);
    } else {
      navigate('/');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-500 text-lg">Error loading blogs: {error.message}</p>
    </div>
  );

  // Get unique categories from blogs
  const categories = ['All', 'Technology', 'Travel', 'Food', 'Lifestyle'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {category ? `${category} Blogs` : 'Latest Blogs'}
        </h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            <FiGrid />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            <FiList />
          </button>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat === 'All' ? null : cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              (cat === 'All' && !category) || cat === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {data?.getBlogs?.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No blog posts found</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col space-y-4"}>
          {data?.getBlogs.map((blog) => (
            <Blogcard 
              key={blog.id} 
              blogdata={blog} 
              refreshBlogs={refreshBlogs} 
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
