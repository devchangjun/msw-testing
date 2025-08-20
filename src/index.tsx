import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import enableMocking from './mocks'
import './index.css'

// MSW를 초기화합니다 (개발 환경에서만)
enableMocking().then(() => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  )
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
