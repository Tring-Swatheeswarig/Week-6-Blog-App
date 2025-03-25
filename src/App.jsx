import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { useState } from "react";
import client from "./apolloClient"; 
import { AuthProvider } from "./AuthContext";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import CreateBlog from "./pages/Createblog";
import EditBlog from "./pages/EditBlog"; 
import NoPage from "./pages/Nopage";
import SignUp from "./pages/Signup";
import SignIn from "./pages/Signin";

function PrivateRoute({ element }) {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/signin" />;
}

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <div className="bg-gray-50 min-h-screen">
          <Router>
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />

              <Route path="/" element={<Layout />}>
                <Route path="/" element={<PrivateRoute element={<Home />} />} />
                <Route path="/blog" element={<PrivateRoute element={<Blog />} />} />
                <Route path="/blog/:id" element={<PrivateRoute element={<Blog />} />} />
                <Route path="/create" element={<PrivateRoute element={<CreateBlog />} />} />
                <Route path="/edit/:id" element={<PrivateRoute element={<EditBlog />} />} />
                <Route path="*" element={<NoPage />} />
              </Route>
            </Routes>
          </Router>
        </div>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;

