import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from "react";
import axios from "axios";

interface Message {
  message: string;
}

function App() {
  const [currentMessage, setCurrentMessage] = useState<Message>();
  useEffect(() => {
    axios.get<Message>("users/test").then(response=> {
      setCurrentMessage(response.data);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>Current message is {currentMessage?.message}</p>
      </header>
    </div>
  );
}

export default App;
