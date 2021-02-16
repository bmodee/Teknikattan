import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './App.css'
import logo from './logo.svg'

interface Message {
  message: string
}

const App: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState<Message>()
  useEffect(() => {
    axios.get<Message>('users/test').then((response) => {
      setCurrentMessage(response.data)
    })
  }, [])

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
  )
}

export default App
