import React from "react";  
import { useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { FiClock, FiTag } from "react-icons/fi";
import { useMutation, gql } from "@apollo/client"; 
import { useAuth } from "../AuthContext";
import parse from 'html-react-parser';

const DELETE_BLOG_MUTATION = gql`
  mutation DeleteBlog($id: ID!) {
    deleteBlog(id: $id) {
      success
      message
    }
  }
`;

const BlogCard = ({ blogdata, refreshBlogs, viewMode = "grid" }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [deleteBlog] = useMutation(DELETE_BLOG_MUTATION);

    const isCreator = currentUser && currentUser.id === blogdata.user_id;

    let imageUrl;
    if (blogdata.image && typeof blogdata.image === "string") {
        if (blogdata.image.startsWith("http")) {
            imageUrl = blogdata.image;
        } else if (blogdata.image.startsWith("/uploads/")) {
            imageUrl = `http://localhost:4000${blogdata.image}`;
        } else {
            imageUrl = blogdata.image;
        }
    } else {
        const defaultImages = {
            Travel: "travel.jpg",
            Technology: "technology.jpg",
            Food: "food.jpg",
            Lifestyle: "lifestyle.jpg",
            default: "default.jpg"
        };
        imageUrl = `http://localhost:5173/assets/images/${defaultImages[blogdata.category] || defaultImages.default}`;
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.error("Date formatting error:", e);
            return '';
        }
    };
  
    const getSummary = (content) => {
        if (!content) return "";
        const plainText = content.replace(/<[^>]+>/g, '');
        return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText;
    };

    const handleDelete = async () => {
        if (!isCreator) {
            alert("You can only delete your own posts");
            return;
        }
        
        const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
        if (!confirmDelete) return;

        try {
            const { data } = await deleteBlog({
                variables: { id: blogdata.id },
                update: (cache) => {
                    cache.modify({
                        fields: {
                            getBlogs(existingBlogs = [], { readField }) {
                                return existingBlogs.filter(
                                    blogRef => blogdata.id !== readField('id', blogRef)
                                );
                            }
                        }
                    });
                }
            });

            if (data?.deleteBlog?.success) {
                if (typeof refreshBlogs === 'function') {
                    refreshBlogs();
                } else {
                    window.location.reload();
                }
            } else {
                throw new Error(data?.deleteBlog?.message || "Failed to delete blog");
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
            alert("Failed to delete the blog: " + error.message);
        }
    };

    const handleEdit = () => {
        if (!isCreator) {
            alert("You can only edit your own posts");
            return;
        }
        navigate(`/edit/${blogdata.id}`);
    };

    if (viewMode === "grid") {
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden" onClick={() => navigate(`/blog/${blogdata.id}`)}>
                    <img 
                        src={imageUrl} 
                        alt={blogdata.title} 
                        className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105 duration-300"
                    />
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-semibold px-2 py-1">
                        {blogdata.category}
                    </div>
                </div>
                
                <div className="p-4 flex-grow flex flex-col">
                    
                    <h3 
                        className="font-bold text-lg mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => navigate(`/blog/${blogdata.id}`)}
                    >
                        {blogdata.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 flex-grow">
                        {getSummary(blogdata.post)}
                    </p>
                    
                    {isCreator && (
                        <div className="flex justify-end space-x-2 mt-2">
                            <button
                                onClick={handleEdit}
                                className="px-3 py-1 text-sm rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 flex items-center"
                            >
                                <MdEdit className="mr-1" /> Edit
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="px-3 py-1 text-sm rounded-md text-white bg-red-500 hover:bg-red-600 flex items-center"
                            >
                                <MdDelete className="mr-1" /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    } else {
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col md:flex-row">
                    <div 
                        className="md:w-1/4 h-48 md:h-auto overflow-hidden"
                        onClick={() => navigate(`/blog/${blogdata.id}`)}
                    >
                        <img 
                            src={imageUrl} 
                            alt={blogdata.title} 
                            className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105 duration-300"
                        />
                    </div>
                    
                    <div className="p-4 md:w-3/4 flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                                    {blogdata.category}
                                </span>
                            </div>
                        </div>
                        
                        <h3 
                            className="font-bold text-xl mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => navigate(`/blog/${blogdata.id}`)}
                        >
                            {blogdata.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4">
                            {getSummary(blogdata.post)}
                        </p>
                        
                        <div className="flex justify-between items-center mt-auto">
                            <button 
                                onClick={() => navigate(`/blog/${blogdata.id}`)}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Read More →
                            </button>
                            
                            {isCreator && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleEdit}
                                        className="px-3 py-1 text-sm rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 flex items-center"
                                    >
                                        <MdEdit className="mr-1" /> Edit
                                    </button>
                                    <button 
                                        onClick={handleDelete}
                                        className="px-3 py-1 text-sm rounded-md text-white bg-red-500 hover:bg-red-600 flex items-center"
                                    >
                                        <MdDelete className="mr-1" /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default BlogCard;
