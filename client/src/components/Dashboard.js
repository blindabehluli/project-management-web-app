import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Board from "./Board";

function Dashboard() {
  const [isBoardFull, setIsBoardFull] = useState(true);
  const [selectedBoard, setSelectedBoard] = useState(null);

  const handleToggleSidebar = (isSidebarHidden) => {
    setIsBoardFull(!isSidebarHidden);
  };

  const handleBoardClick = (board) => {
    setSelectedBoard(board);
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <Header selectedBoard={selectedBoard} />
        <main className="flex w-full h-full overflow-y-auto relative bg-[#F4F6F8]">
          <Sidebar
            onToggleSidebar={handleToggleSidebar}
            onBoardClick={handleBoardClick}
          />
          {selectedBoard && (
            <Board
              isBoardFull={isBoardFull}
              selectedBoard={selectedBoard} // Pass the selectedBoard prop
            />
          )}
        </main>
      </div>
    </>
  );
}

export default Dashboard;
