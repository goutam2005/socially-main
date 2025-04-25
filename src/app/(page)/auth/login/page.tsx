"use client";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare, 
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import AuthImagePattern from "@/components/AuthImagePattern";
import {  loginUser } from "@/action/user-actions";
import { useRouter } from "next/navigation";


function SignUp() {
  const Router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const [formData, setFormData] = useState({    
    email: "",
    password: "",
  });
  const validateForm = () => {
    if ( !formData.email || !formData.password) {
      return toast.error("All fields are required");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return toast.error("Invalid email address");
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm() === true) {
      try {
        setIsSignIn(true);
        const result = await loginUser(formData.email, formData.password);
        if (result.success) {
          toast.success("Account created successfully!");
          Router.push("/");
          // You might want to redirect the user after successful signup
        } else {
          toast.error(result.error || "Failed to create account");
        }
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setIsSignIn(false);
      }
    }
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2 -mt-28 bg-gray-50">
        
      {/* left-side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md p-5 space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col gap-2 group items-center">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="font-bold text-2xl mt-2">Login an account</h1>
              <p className="text-gray-500">
                Get started with your free account
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span>Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                ></input>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                <span>Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                ></input>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-6 h-6 text-gray-400" />
                  ) : (
                    <Eye className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                disabled={isSignIn}
              >
                {isSignIn ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin inline" />
                    <span className="ml-2">Loading...</span>
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="text-gray-500">
             Don't have an account?{" "}
              <Link href="/auth/signup" className="text-blue-600 hover:underline">
                SignUp
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share photos and videos, and have fun with your family and friends."
      />
    </div>
  );
}

export default SignUp;
