import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''

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
       {/* Feature Description Section */}
       <div className="card" style={{gridColumn:'span 12', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '40px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center'}}>
          <div>
            <h2 style={{fontSize: '32px', fontWeight: '700', marginBottom: '20px'}}>
              Industry's most intuitive train graph
            </h2>
            <ul style={{listStyle: 'none', padding: 0, fontSize: '16px', lineHeight: '1.6'}}>
              <li style={{marginBottom: '12px', display: 'flex', alignItems: 'center'}}>
                <span style={{marginRight: '12px', fontSize: '20px'}}>•</span>
                View train routes with accurate downstream ETAs.
              </li>
              <li style={{marginBottom: '12px', display: 'flex', alignItems: 'center'}}>
                <span style={{marginRight: '12px', fontSize: '20px'}}>•</span>
                Drag and drop string lines to resolve meet-and-pass conflicts.
              </li>
              <li style={{marginBottom: '12px', display: 'flex', alignItems: 'center'}}>
                <span style={{marginRight: '12px', fontSize: '20px'}}>•</span>
                Find and reserve maintenance work windows.
              </li>
              <li style={{marginBottom: '12px', display: 'flex', alignItems: 'center'}}>
                <span style={{marginRight: '12px', fontSize: '20px'}}>•</span>
                See speed restrictions and tracks out of service.
              </li>
              <li style={{marginBottom: '12px', display: 'flex', alignItems: 'center'}}>
                <span style={{marginRight: '12px', fontSize: '20px'}}>•</span>
                Collaborate and talk to other users in real time.
              </li>
            </ul>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{
              width: '300px',
              height: '200px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed rgba(255,255,255,0.3)',
              margin: '0 auto'
            }}>
              <div style={{textAlign: 'center'}}>
              <div style={{ textAlign: 'center' }}>
  <img
    src="/railwayrule2.jpg" 
    alt="Graph Placeholder"
    style={{ width: 'auto', height: 'auto', marginBottom: '10px' }}
  />
</div>
</div>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Banner */}
      <div className="solutions-banner card" style={{gridColumn:'span 12', padding:0}}>
        <div className="solutions-bg">
          <div className="solutions-content">
            <h2 className="solutions-title">Solutions for railroads of all sizes</h2>
            <div className="solutions-flow">
              <div className="solutions-block">
                <div className="solutions-heading">Visibility</div>
                <div className="solutions-text">See real-time train locations, train paths, and maintenance opportunities in an intuitive graphical interface.</div>
              </div>
              <img src="/arrow-right.svg" alt="to" className="solutions-arrow" />
              <div className="solutions-block">
                <div className="solutions-heading">Decision support</div>
                <div className="solutions-text">Unlock new insights and opportunities with the help of actionable KPIs.</div>
              </div>
              <img src="/arrow-right.svg" alt="to" className="solutions-arrow" />
              <div className="solutions-block">
                <div className="solutions-heading">Optimization</div>
                <div className="solutions-text">Resolve meets, passes, and maintenance activities in line with business objectives.</div>
              </div>
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
              width: 'auto',
              height: 'auto',
            }}>
              <img src="/trainrule1.webp" alt="Train" style={{width:'200px',height:'200px'}}/>
            </div>
            <h4 style={{margin: '0 0 8px 0', color: 'var(--gov-blue)', fontWeight: '600'}}>
              Run more trains or schedule more maintenance.
            </h4>
          </div>
          
          <div className="animate-slide-in" style={{textAlign: 'center', padding: '20px', animationDelay: '0.1s'}}>
          <div style={{
              width: 'auto',
              height: 'auto',
            }}>
              <img src="/images (3).jpg" alt="Train" style={{width:'200px',height:'200px'}}/>
            </div>
            <h4 style={{margin: '0 0 8px 0', color: 'var(--gov-blue)', fontWeight: '600'}}>
              Change train meets and passes to improve schedule adherence.
            </h4>
          </div>
          
          <div className="animate-slide-in" style={{textAlign: 'center', padding: '20px', animationDelay: '0.2s'}}>
          <div style={{
              width: 'auto',
              height: 'auto',
            }}>
              <img src="/railwayrule2.jpg" alt="Train" style={{width:'200px',height:'200px'}}/>
            </div>
            <h4 style={{margin: '0 0 8px 0', color: 'var(--gov-blue)', fontWeight: '600'}}>
              Re-route traffic to reduce congestion and delay.
            </h4>
          </div>
          
          <div className="animate-slide-in" style={{textAlign: 'center', padding: '20px', animationDelay: '0.3s'}}>
          <div style={{
              width: 'auto',
              height: 'auto',
            }}>
              <img src="/images (4).jpg" alt="Train" style={{width:'200px',height:'200px'}}/>
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