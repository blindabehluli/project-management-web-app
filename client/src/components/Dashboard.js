import React from "react";
import { Link } from "react-router-dom";
import withContext from "../context/AuthContext";
import { PrimaryButton, SecondaryButton } from "./Button/ButtonComponents";

const Dashboard = ({ context }) => {
  const authUser = context.authenticatedUser;

  return (
    <>
      <div className="flex justify-between items-center p-4 px-12 text-black border-b border-black border-dashed">
        <div className="text-2xl font-light">
          <h1>{authUser.firstName}'s Dashboard</h1>
        </div>
        <div className="flex space-x-4">
          <SecondaryButton>Settings</SecondaryButton>
          <Link to="/signout">
            <PrimaryButton>Sign out</PrimaryButton>
          </Link>
        </div>
      </div>
      <main className="grid grid-cols-4 gap-4 p-24">
        <div className="rounded-lg border-black border-dashed border p-4">Column 1</div>
        <div className="rounded-lg border-black border-dashed border p-4">Column 2</div>
        <div className="rounded-lg border-black border-dashed border p-4">Column 3</div>
        <div className="rounded-lg border-black border-dashed border p-4">Column 4</div>
      </main>
    </>
  );
};

export default withContext(Dashboard);
