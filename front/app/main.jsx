import routes from '~react-pages'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useRoutes } from 'react-router'
import { NavBar, Chatbot } from './components/';
import 'react-tooltip/dist/react-tooltip.css'
import './index.css'


function App() {
  return (
    <div className="app-container">
      <NavBar />
      <div className="main-content">
        <Suspense fallback={<p>Cargando...</p>}>
          {useRoutes(routes)}
        </Suspense>
      </div>
      <Chatbot />
    </div>
  )
}

const app = createRoot(document.getElementById('root'))

app.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
