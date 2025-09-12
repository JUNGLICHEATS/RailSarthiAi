import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Dashboard(){
  const [kpis, setKpis] = useState(null)
  const [trains, setTrains] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [kpisResponse, trainsResponse] = await Promise.all([
          axios.get(`${API}/api/kpis`),
          axios.get(`${API}/api/trains`)
        ])
        setKpis(kpisResponse.data)
        setTrains(trainsResponse.data.slice(0,50))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  },[])

  return (
    <div className="grid" style={{
      background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(226, 232, 240, 0.95) 100%), url("https://www.neweb.info/wp-content/uploads/2023/01/10-REXDATA-Rail-Software-Digital-Locomotor.jpg") center/cover',
      backgroundAttachment: 'fixed',
      minHeight: '100vh'
    }}>
    

      {/* Government Style Overview Card */}
      <div className="card" style={{
        gridColumn: 'span 12',
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(30, 64, 175, 0.9) 100%), url("https://www.neweb.info/wp-content/uploads/2023/01/10-REXDATA-Rail-Software-Digital-Locomotor.jpg") center/cover',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        padding: '40px',
        borderRadius: '20px',
        minHeight: '300px'
      }}>
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '80px',
          height: '80px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          🚆
        </div>
        
        <h1 style={{
          fontSize: '36px', 
          margin: '0 0 32px 0', 
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'rgba(255,255,255,0.25)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            🚆
          </div>
          Indian Railways AI Controller System
        </h1>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px'}}>
          <div className="animate-slide-in" style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '24px',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <div style={{fontSize: '18px', opacity: '0.9', marginBottom: '12px', fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.3)'}}>Total Trains</div>
            <div style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '8px', textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
              {isLoading ? <div className="loading-spinner" style={{width: '40px', height: '40px'}}></div> : kpis?.totalTrains || 0}
            </div>
            <div style={{fontSize: '16px', opacity: '0.8', textShadow: '0 1px 2px rgba(0,0,0,0.3)'}}>
              Punctuality: {isLoading ? '...' : kpis?.punctuality || 0}%
            </div>
          </div>
          
          <div className="animate-slide-in" style={{
            animationDelay: '0.1s',
            background: 'rgba(255,255,255,0.1)',
            padding: '24px',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <div style={{fontSize: '18px', opacity: '0.9', marginBottom: '12px', fontWeight: '500', textShadow: '0 1px 2px rgba(0,0,0,0.3)'}}>Maintenance Trains</div>
            <div style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '8px', textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
              {isLoading ? <div className="loading-spinner" style={{width: '40px', height: '40px'}}></div> : kpis?.maintenanceTrains || 0}
            </div>
            <div style={{fontSize: '16px', opacity: '0.8', textShadow: '0 1px 2px rgba(0,0,0,0.3)'}}>
              Avg Load: {isLoading ? '...' : kpis?.avgPassengerLoad || 0}
            </div>
          </div>
          
          <div className="animate-slide-in" style={{
            animationDelay: '0.2s',
            background: 'rgba(255,255,255,0.1)',
            padding: '24px',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <div style={{fontSize: '18px', opacity: '0.9', marginBottom: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', textShadow: '0 1px 2px rgba(0,0,0,0.3)'}}>
              📍 Indian Railway Network
            </div>
            <div style={{fontSize: '36px', fontWeight: 'bold', marginBottom: '8px', color: '#10b981', textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
              Operational
            </div>
            <div style={{fontSize: '16px', opacity: '0.8', textShadow: '0 1px 2px rgba(0,0,0,0.3)'}}>
              AI Controller: Active
            </div>
          </div>
        </div>
      </div>

    

   
 {/* Indian Railway Optimization Features */}
 <div className="card" style={{gridColumn:'span 12'}}>
        <h3 style={{fontSize: '24px', fontWeight: '700', marginBottom: '20px'}}>
          Our Advanced Optimization Algorithms Help You:
        </h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px'}}>
          <div className="animate-slide-in" style={{textAlign: 'center', padding: '20px'}}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, var(--gov-blue), var(--gov-dark-blue))',
              borderRadius: '12px',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: 'var(--gov-shadow)'
            }}>
              🚂
            </div>
            <h4 style={{margin: '0 0 8px 0', color: 'var(--gov-blue)', fontWeight: '600'}}>
              Run more trains or schedule more maintenance.
            </h4>
          </div>
          
          <div className="animate-slide-in" style={{textAlign: 'center', padding: '20px', animationDelay: '0.1s'}}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, var(--gov-green), #10b981)',
              borderRadius: '12px',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: 'var(--gov-shadow)'
            }}>
              ✅
            </div>
            <h4 style={{margin: '0 0 8px 0', color: 'var(--gov-blue)', fontWeight: '600'}}>
              Change train meets and passes to improve schedule adherence.
            </h4>
          </div>
          
          <div className="animate-slide-in" style={{textAlign: 'center', padding: '20px', animationDelay: '0.2s'}}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, var(--gov-orange), #fb923c)',
              borderRadius: '12px',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: 'var(--gov-shadow)'
            }}>
              🛤️
            </div>
            <h4 style={{margin: '0 0 8px 0', color: 'var(--gov-blue)', fontWeight: '600'}}>
              Re-route traffic to reduce congestion and delay.
            </h4>
          </div>
          
          <div className="animate-slide-in" style={{textAlign: 'center', padding: '20px', animationDelay: '0.3s'}}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, var(--gov-red), #ef4444)',
              borderRadius: '12px',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: 'var(--gov-shadow)'
            }}>
              📊
            </div>
            <h4 style={{margin: '0 0 8px 0', color: 'var(--gov-blue)', fontWeight: '600'}}>
              Create multiple scenarios and compare KPIs to find the best plan.
            </h4>
          </div>
        </div>
      </div>
      {/* Real-time Movement Planning */}
      <div className="card" style={{gridColumn:'span 12'}}>
        <h3 style={{fontSize: '24px', fontWeight: '700', marginBottom: '20px'}}>
          Real-time Movement Planning
        </h3>
        <p style={{color: 'var(--gov-gray)', marginBottom: '20px', fontSize: '16px'}}>
          True dispatch by exception takes the pressure off you by:
        </p>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'}}>
          <div>
            <ul style={{listStyle: 'none', padding: 0}}>
              <li style={{marginBottom: '12px', display: 'flex', alignItems: 'center'}}>
                <span style={{color: 'var(--gov-green)', marginRight: '8px', fontSize: '18px'}}>✓</span>
                Resolving meets and passes based on business goals.
              </li>
              <li style={{marginBottom: '12px', display: 'flex', alignItems: 'center'}}>
                <span style={{color: 'var(--gov-green)', marginRight: '8px', fontSize: '18px'}}>✓</span>
                Suggesting maintenance to avoid disruptions.
              </li>
            </ul>
          </div>
          <div>
            <ul style={{listStyle: 'none', padding: 0}}>
              <li style={{marginBottom: '12px', display: 'flex', alignItems: 'center'}}>
                <span style={{color: 'var(--gov-green)', marginRight: '8px', fontSize: '18px'}}>✓</span>
                Getting your network back on track after an unplanned event.
              </li>
              <li style={{marginBottom: '12px', display: 'flex', alignItems: 'center'}}>
                <span style={{color: 'var(--gov-green)', marginRight: '8px', fontSize: '18px'}}>✓</span>
                Optimizing your network based on your goals.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}