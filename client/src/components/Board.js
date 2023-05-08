import React from "react";

export default function Board( { isBoardFull }) {
  return (
    <div className={`${isBoardFull ? 'board' : 'board-full'}`}>
      <div className="column">
        <div className="column-header">
          <span className="column-label"></span>
          <span className="column-title">To Do</span>
        </div>
        <div className="column-container">
          <div className="card">
            <div className="card-title">Review Feedback</div>
            <div className="card-count">0 of 3 subtasks</div>
          </div>
        </div>
      </div>
      <div className="column">
        <div className="column-header">
          <span className="column-label"></span>
          <span className="column-title">Doing</span>
        </div>
        <div className="column-container">
          <div className="card">
            <div className="card-title">Design UI</div>
            <div className="card-count">0 of 3 subtasks</div>
          </div>
        </div>
      </div>
      <div className="column">
        <div className="column-header">
          <span className="column-label"></span>
          <span className="column-title">Done</span>
        </div>
        <div className="column-container">
          <div className="card">
            <div className="card-title">Create next app</div>
            <div className="card-count">0 of 3 subtasks</div>
          </div>
        </div>
      </div>
      <div className="column">
        <div className="column-header">
          <span className="column-label"></span>
          <span className="column-title">To Do</span>
        </div>
        <div className="column-container-empty">
        </div>
      </div>
      <div className="column">
        <div className="column-header">
        &nbsp;
        </div>
        <button className="column-add-new">+ New Column</button>
      </div>
    </div>
  );
}
