import React from 'react';

const PrimaryButton = ({ onClick, children }) => {
  return (
    <button
      className="text-white bg-black border hover:border-black hover:bg-white hover:text-black p-3 rounded-lg transition ease-in-out duration-200"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const SecondaryButton = ({ onClick, children }) => {
  return (
    <button
      className="text-black bg-white border border-[#EAEAEA] hover:border-black p-3 rounded-lg transition ease-in-out duration-200"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export { PrimaryButton, SecondaryButton };