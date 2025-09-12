import { Outlet, Link, useLocation } from 'react-router-dom'
import './App.css'
import brand from './assets/brand.png'
import { useAuth } from './contexts/AuthContext'

function App() {
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  
  const getCurrentTime = () => {
    return new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="app-shell">
      {/* Government Header */}
      <header className="gov-header">
        <div className="gov-header-content">
          <div className="gov-logo">
          <a href="/" style={{ display: 'inline-block' }}>
  <img 
    src={brand} 
    alt="Indian Railways Logo" 
    style={{
      height: '60px',
      width: 'auto',
      marginRight: '12px',
      cursor: 'pointer'
    }}
  />
</a>

          
          </div>
          <nav className="gov-nav">
            <a href="/control-panel">CONTROL PANEL</a>
            <a href="/train-details">TRAIN DETAILS</a>
            <a href="/kpi">KPI DETAILS</a>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'white', fontSize: '14px' }}>
                  Welcome, {user?.email || 'User'}
                </span>
                <button 
                  onClick={logout}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)'
                  }}
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <a href="/login" className="login-btn">LOGIN</a>
            )}
          </nav>
          <div className="gov-time">
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
                {getCurrentTime()}
              </div>
              <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                सत्यमेव जयते
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="content">
        
        <Outlet />
      </main>
    </div>
  )
}

export default App
