import React from "react";
import kanbanLogo from "../assets/logo.svg";

export default function Header() {
  return (
    <header>
      <picture className="header-logo">
        <source srcSet={kanbanLogo} media="(max-width: 767px)"></source>
        <img src={kanbanLogo} alt="logo" />
      </picture>
      <div className="header-content">
        <h1 className="header-title">Platform Launch</h1>
        <div className="header-buttons">
          <button className="button">+ Add New Task</button>
          <div className="dropdown">
            <button className="button-three-dots">
              <svg width="5" height="20" xmlns="http://www.w3.org/2000/svg">
                <g fill="currentColor" fillRule="evenodd">
                  <circle cx="2.308" cy="2.308" r="2.308"></circle>
                  <circle cx="2.308" cy="10" r="2.308"></circle>
                  <circle cx="2.308" cy="17.692" r="2.308"></circle>
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
