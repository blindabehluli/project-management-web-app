import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Main from "./Main";

function Test() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex w-full h-full overflow-y-auto relative bg-[#F4F6F8]">
        <Sidebar />
        <Main />
      </main>
    </div>
  );
}

export default Test;