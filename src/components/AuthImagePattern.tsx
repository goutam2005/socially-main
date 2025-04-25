import React from "react";

function AuthImagePattern({ title , subtitle } : { title: string, subtitle: string }) {
    return (
      <div className="hidden lg:flex items-center justify-center bg-base-100 p-12 min-h-screen">
        <div className="max-w-md mt-52 text-center">
          {/* Animated Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-xl bg-gray-300 ${i % 2 === 0 ? "animate-bounce" : "animate-pulse"} duration-500`}
              ></div>
            ))}
          </div>
  
          {/* Title & Subtitle */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{title}</h1>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>
      </div>
    );
  }
  


export default AuthImagePattern;
