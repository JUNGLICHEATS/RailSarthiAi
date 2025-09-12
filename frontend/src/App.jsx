import { Outlet, Link, useLocation } from 'react-router-dom'
import './App.css'
import brand from './assets/brand.png'

function App() {
  const location = useLocation()
  
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
            <a href="/login" className="login-btn">LOGIN</a>
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
