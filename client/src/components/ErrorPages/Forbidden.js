import React from 'react';

const Forbidden = () => (
  <div className="flex flex-col justify-center items-center text-center h-screen">
    <h1 className="text-6xl lg:text-8xl font-extrabold text-black">Forbidden</h1>
    <p className="mt-2 mx-4 text-[#A2A2A2] text-xl lg:text-2xl font-light">You are not authorized to make this request.</p>
  </div>
);

export default Forbidden;