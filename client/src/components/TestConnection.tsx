import axios from 'axios'
import React, { useEffect, useState } from 'react'

interface Message {
  message: string
}

const TestConnection: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState<Message>()
  useEffect(() => {
    axios.get<Message>('users/test').then((response) => {
      setCurrentMessage(response.data)
    })
  }, [])
  return <p>Connection with server is: {currentMessage?.message}</p>
}

export default TestConnection
