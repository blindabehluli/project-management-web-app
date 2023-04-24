import React from "react";
import { PrimaryButton, SecondaryButton } from "../Button/ButtonComponents";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <main className="flex justify-center items-center w-screen h-screen">
      <div className="container lg:px-28 px-6 md:px-12">
        <div className="flex flex-col justify-center align-center text-center">
          <div className="text-[#303030] border-y border-dashed border-[#EAEAEA] p-8 break-words">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tighter tracking-tight"
              data-aos="zoom-y-out"
            >
              Collaborate. Organize.{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                Manage.
              </span>
            </h1>
          </div>
          <div className="max-w-full p-10">
            <p className="text-[#A2A2A2] font-light text-xl md:text-2xl">
              Our project management app helps you stay
              <span className="text-[#111111]"> organized</span>, and on top of
              your tasks. With features like task assignments, project
              timelines, and real-time{" "}
              <span className="text-[#111111]">collaboration</span>, you'll be
              able to work more efficiently and
              <span className="text-[#111111]"> manage</span> your projects with
              ease.
            </p>
          </div>
          <div className="flex justify-center border-y border-dashed border-[#EAEAEA]">
            <div className="flex justify-center space-x-4 border-x border-dashed border-[#EAEAEA] p-10">
              <Link to="/signup">
                <PrimaryButton>Get Started</PrimaryButton>
              </Link>
              <Link to="/signin">
                <SecondaryButton>Log in now</SecondaryButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
