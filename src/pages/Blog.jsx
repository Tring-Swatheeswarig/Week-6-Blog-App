
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import parse from 'html-react-parser';
import { useEffect, useState, useRef } from 'react';
import { FiEdit, FiTrash2, FiClock, FiTag } from 'react-icons/fi';

const GET_BLOG = gql`
  query GetBlogById($id: ID!) {
    getBlogById(id: $id) {
      id
      title
      image
      post
      category
      created_at
    }
  }
`;

const DELETE_BLOG = gql`
  mutation DeleteBlog($id: ID!) {
    deleteBlog(id: $id) {
      success
      message
    }
  }
`;

function Blog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;
      const scrolled = window.scrollY;
      
      const percentage = (scrolled / (fullHeight - windowHeight)) * 100;
      setScrollPercentage(Math.min(percentage, 100));
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const { loading, error, data } = useQuery(GET_BLOG, {
    variables: { id }
  });

  const [deleteBlog, { loading: deleteLoading }] = useMutation(DELETE_BLOG, {
    onCompleted: (data) => {
      if (data?.deleteBlog?.success) {
        navigate('/');
      }
    }
  });

  useEffect(() => {
    if (data?.getBlogById?.image) {
      const blogImage = data.getBlogById.image;
      if (blogImage.startsWith('http')) {
        setImageUrl(blogImage);
      } else if (blogImage.startsWith('/uploads/')) {
        setImageUrl(`http://localhost:4000${blogImage}`);
      } else {
        setImageUrl(blogImage);
      }
    }
  }, [data]); 

  if (loading) return (
    <div className="container mx-auto my-5">
      <div className="flex flex-col items-center">
        <div className="bg-gray-200 h-10 w-7/10 mb-5"></div>
        <div className="bg-gray-200 h-6 w-3/10 mb-7"></div>
        <div className="bg-gray-200 h-88 mb-7"></div>
        <div className="bg-gray-200 h-5 mb-4"></div>
        <div className="bg-gray-200 h-5 mb-4"></div>
        <div className="bg-gray-200 h-5 mb-4"></div>
      </div>
    </div>
  );
  if (error) return <div className="container mx-auto my-5">Error: {error.message}</div>;

const blog = data.getBlogById;

const handleEdit = () => {
  navigate(`/edit/${id}`);// update the url and navigate to the edit page 
};

const handleDelete = async () => {
  if (window.confirm("Are you sure you want to delete this blog post?")) {
    try {
      await deleteBlog({
        variables: { id }
      });
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert("Failed to delete blog: " + err.message);
    }
  }
};

return (
  <>
    {/* Reading progress bar */}
    <div className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50">
      <div className="bg-primary" style={{ width: `${scrollPercentage}%` }} />
    </div>

    <div className="container mx-auto my-5">  
      <div className="flex justify-center">
        <div className="w-full md:w-2/3">
          {/* Blog Header */}
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="badge bg-primary me-2">{blog.category}</span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="btn btn-sm btn-outline-primary me-2"
                disabled={deleteLoading}
              >
                <FiEdit /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-sm btn-outline-danger"
                disabled={deleteLoading}
              >
                <FiTrash2 /> {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

          {/* Featured Image */}
          {imageUrl && (
            <div className="mb-4">
              <img
                src={imageUrl}
                alt={blog.title}
                className="w-full rounded shadow"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="blog-content" ref={contentRef}>
            {parse(blog.post)}
          </div>
        </div>
      </div>
    </div>
  </>
);
}

export default Blog;
