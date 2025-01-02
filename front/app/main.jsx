import routes from '~react-pages'
import { StrictMode, Suspense, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useRoutes } from 'react-router'
import { NavBar, Chatbot } from './components/';
import { CartProvider } from './context/CartContext';
import 'react-tooltip/dist/react-tooltip.css'
import './index.css'

function App() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <CartProvider>
      <div className="grid" >
        <NavBar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className={`transition-all duration-300 ${collapsed ? 'ml-32' : 'ml-72'}`}>
          <Suspense fallback={<p>Cargando...</p>}>
            {useRoutes(routes)}
          </Suspense>
        </div>
        <Chatbot />
      </div>
    </CartProvider>
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
