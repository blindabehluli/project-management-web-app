import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Board from "./Board";
import { useState } from "react";

function Dashboard() {
  const [isBoardFull, setIsBoardFull] = useState(true);

  const handleToggleSidebar = (isSidebarHidden) => {
    setIsBoardFull(!isSidebarHidden);
  };
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex w-full h-full overflow-y-auto relative bg-[#F4F6F8]">
      <Sidebar onToggleSidebar={handleToggleSidebar} />
      <Board isBoardFull={isBoardFull} />
      </main>
    </div>
  );
}

export default Dashboard;