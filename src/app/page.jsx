"use client";

import React, { useState } from "react";
import Details from "./pages/Details";
import Home from "./pages/Home";
import Record from "./pages/Record";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="tabs-container">
        <div
          className="tabs tabs-bordered text-center flex justify-center"
          role="tablist"
        >
          <button
            role="tab"
            className={`tab ${
              activeTab === "details" ? "tab-active" : ""
            } text-base my-4 transition duration-300 ease-in-out`}
            onClick={() => handleTabClick("details")}
          >
            Details
          </button>
          <button
            role="tab"
            className={`tab ${
              activeTab === "home" ? "tab-active" : ""
            } text-base my-4 transition duration-300 ease-in-out`}
            onClick={() => handleTabClick("home")}
          >
            Calculate
          </button>
          <button
            role="tab"
            className={`tab ${
              activeTab === "record" ? "tab-active" : ""
            } text-base my-4 transition duration-300 ease-in-out`}
            onClick={() => handleTabClick("record")}
          >
            Records
          </button>
        </div>
      </div>
      <div
        className="flex-grow tab-content-container relative overflow-y-auto"
        style={{ minHeight: "500px" }}
      >
        <div
          className={`tab-content ${
            activeTab === "details" ? "block" : "hidden"
          }`}
        >
          <Details />
        </div>
        <div
          className={`tab-content ${activeTab === "home" ? "block" : "hidden"}`}
        >
          <Home />
        </div>
        <div
          className={`tab-content ${
            activeTab === "record" ? "block" : "hidden"
          }`}
        >
          <Record />
        </div>
      </div>
    </div>
  );
}
