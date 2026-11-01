import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './app.css'

const root = document.getElementById('root')
if (root === null) {
  throw new Error('root element not found')
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
