import { useState, useRef } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const CREATE_BLOG = gql`
  mutation CreateBlog($title: String!, $image: String!, $post: String!, $category: String!) {
    createBlog(title: $title, image: $image, post: $post, category: $category) {
      id
      title
    }
  }
`;

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [post, setPost] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [createBlog, { loading }] = useMutation(CREATE_BLOG);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await axios.post("http://localhost:4000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setImage(response.data.url); // Store uploaded image URL
      setUploading(false);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image");
      setPreview(""); // Remove preview on error
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
      console.log("Submitting with:", { title, image, post, category });
      const { data } = await createBlog({ variables: { title, image, post, category } });

      console.log("Created blog:", data);
      navigate("/");
    } catch (err) {
      console.error("Error creating blog:", err);
      setError(err.message || "Failed to create blog post");
    }
  };

  return (
    <div className="container mx-auto max-w-lg p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create New Blog Post</h1>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Category Select */}
        <div>
          <label className="block font-medium text-gray-700">Category</label>
          <select
            className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
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

        {/* Image Upload */}
        <div>
          <label className="block font-medium text-gray-700">Image</label>
          <input
            type="file"
            className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
          />
          {/* Image Preview */}
          {preview && <img src={preview} alt="Preview" className="mt-2 w-40 h-40 object-cover rounded-md border" />}
          {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
        </div>

        <div>
          <label className="block font-mesdium text-gray-700">Content</label>
          <ReactQuill
            theme="snow"
            value={post}
            onChange={setPost}
            className="h-40 bg-white border rounded-md"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          disabled={loading || uploading}
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;
