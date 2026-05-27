import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

import Sidebar from './Sidebar.js'
import Icon from '../components/components/Icon'

import '../styles/app/app.css'

function App() {
  const scroller = useRef(null)
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  // Scroll main content to top + close sidebar on route change
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = 0
    setSidebarOpen(false)
  }, [location.pathname])

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  // Escape key closes the drawer
  useEffect(() => {
    if (!sidebarOpen) return
    const onKey = (e) => { if (e.key === 'Escape') closeSidebar() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [sidebarOpen, closeSidebar])

  return (
    <div className="shell">

      {/* Mobile-only top bar */}
      <header className="mobile-header">
        <NavLink to="/" className="mobile-header__brand" aria-label="Home">
          <span className="signature signature--script">DEVELOPED BY DREWFORD</span>
        </NavLink>
        <button
          className="mobile-header__toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
          aria-expanded={sidebarOpen}
        >
          <Icon name="menu" size={22} />
        </button>
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <main className="main" ref={scroller}>
        <div className="main__inner">
          <Outlet />
        </div>
      </main>

    </div>
  )
}

export default App
