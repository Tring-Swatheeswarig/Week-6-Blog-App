import { gql } from "@apollo/client";
import client from "../apolloClient"; 
export const GET_BLOGS = gql`
  query getBlogs($category: String) {
    getBlogs(category: $category) {
      id
      title
      image
      post
      category
      user {
        id
        name
      }
      created_at
    }
  }
`;

export const GET_BLOG_BY_ID = gql`
  query getBlogById($id: ID!) {
    getBlogById(id: $id) {
      id
      title
      image
      post
      category
      user {
        id
        name
      }
      created_at
    }
  }
`;

export const CREATE_BLOG = gql`
  mutation createBlog($title: String!, $image: String, $post: String!, $category: String!) {
    createBlog(title: $title, image: $image, post: $post, category: $category) {
      id
      title
      image
      post
      category
      user {
        id
        name
      }
      created_at
    }
  }
`;

export const DELETE_BLOG = gql`
  mutation deleteBlog($id: ID!) {
    deleteBlog(id: $id) {
      success
      message
    }
  }
`;

export const getBlogs = async (category = null) => {
  try {
    const { data } = await client.query({
      query: GET_BLOGS,
      variables: { category },
    });
    return data.getBlogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};

export const getBlogById = async (id) => {
  try {
    const { data } = await client.query({
      query: GET_BLOG_BY_ID,
      variables: { id },
    });
    return data.getBlogById;
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    return null;
  }
};

export const createBlog = async (blogData) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_BLOG,
      variables: blogData,
    });
    return data.createBlog;
  } catch (error) {
    console.error("Error creating blog:", error);
    return null;
  }
};

export const deleteBlog = async (id) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_BLOG,
      variables: { id },
    });
    return data.deleteBlog;
  } catch (error) {
    console.error("Error deleting blog:", error);
    return null;
  }
};
