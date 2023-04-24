import React from 'react';

const Error = () => (
  <div className="flex flex-col justify-center items-center text-center h-screen">
    <h1 className="text-6xl lg:text-8xl font-extrabold text-black">Error 500</h1>
    <p className="mt-2 mx-4 text-[#A2A2A2] text-xl lg:text-2xl font-light">Internal Server Error. Please try again later.</p>
  </div>
);

export default Error;