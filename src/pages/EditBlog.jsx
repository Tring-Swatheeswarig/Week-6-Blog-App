import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const GET_BLOG = gql`
  query GetBlogById($id: ID!) {
    getBlogById(id: $id) {
      id
      title
      image
      post
      category
    }
  }
`;

const UPDATE_BLOG = gql`
  mutation UpdateBlog($id: ID!, $title: String!, $image: String!, $post: String!, $category: String!) {
    updateBlog(id: $id, title: $title, image: $image, post: $post, category: $category) {
      id
      title
    }
  }
`;

function EditBlog() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [post, setPost] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const { loading: fetchLoading, error: fetchError, data } = useQuery(GET_BLOG, {
    variables: { id },
    onCompleted: (data) => {
      // Populate form with existing blog data
      setTitle(data.getBlogById.title);
      setImage(data.getBlogById.image);
      setPost(data.getBlogById.post);
      setCategory(data.getBlogById.category);
    }
  });

  const [updateBlog, { loading: updateLoading }] = useMutation(UPDATE_BLOG);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    
    try {
      setUploading(true);
      const response = await axios.post("http://localhost:4000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      setImage(response.data.url);
      setUploading(false);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image");
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!title || !image || !post || !category) {
      setError("All fields are required");
      return;
    }
    
    try {
      const { data } = await updateBlog({ 
        variables: { 
          id,
          title, 
          image, 
          post, 
          category 
        } 
      });
      
      console.log("Updated blog:", data);
      navigate(`/blog/${id}`);
    } catch (err) {
      console.error("Error updating blog:", err);
      setError(err.message || "Failed to update blog post");
    }
  };

  if (fetchLoading) return <div className="container mt-5">Loading...</div>;
  if (fetchError) return <div className="container mt-5">Error: {fetchError.message}</div>;

  // Format the image URL for preview
  let imagePreview = image;
  if (image && image.startsWith("/uploads/")) {
    imagePreview = `http://localhost:4000${image}`;
  }

  return (
    <div className="container mt-5">
      <h1>Edit Blog Post</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            className="form-select"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            <option value="Technology">Technology</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>
        </div>
        
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            onChange={handleImageUpload}
            ref={fileInputRef}
          />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" height="100" />
            </div>
          )}
          {uploading && <div className="text-info">Uploading...</div>}
        </div>
        
        <div className="mb-3">
          <label htmlFor="post" className="form-label">Content</label>
          <ReactQuill
            theme="snow"
            value={post}
            onChange={setPost}
            style={{ height: '300px', marginBottom: '50px' }}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={updateLoading || uploading}
        >
          {updateLoading ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
}

export default EditBlog;