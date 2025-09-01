import { useState } from "react";
import { Post } from "../../services/api";
import { useNavigate } from "react-router-dom";
function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [picture, setPicture] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 try{

   const formData = new FormData();
   formData.append("username", form.username);
   formData.append("email", form.email);
   formData.append("password", form.password);
   if (picture) formData.append("picture", picture);
   
    const data = await Post("users/signup", formData, { 
      credentials: "include"
    });
    alert(data.message);
    
    if (data.user) {
      navigate("/login");
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("Signup failed");
  }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            name="picture"
            onChange={handleFileChange}
            className="w-full text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 font-medium"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
