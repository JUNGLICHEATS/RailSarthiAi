import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''

export default function ControlPanel() {
  const [activeTab, setActiveTab] = useState('tracking')
  const [trains, setTrains] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [animatedTrains, setAnimatedTrains] = useState([])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${API}/api/trains`)
        setTrains(response.data)
        
        // Create animated train data with improved movement and platform logic
        const animated = response.data.slice(0, 8).map((train, index) => {
          const isIncoming = index < 2 // First 2 trains are on incoming lanes
          const isPlatform = index >= 2 && index < 6 // Next 4 trains are on platforms
          const isOutgoing = index >= 6 // Last 2 trains are on outgoing lanes

          // Split platforms by direction: first two platforms are inbound side, next two outbound
          const platformSide = isPlatform ? (index < 4 ? 'inbound' : 'outbound') : null

          // Decide if this platform train is stopped (5s timer)
          const shouldStopAtPlatform = isPlatform && Math.random() > 0.6

          // Position rules
          // Incoming approach from left edge; outgoing from right edge
          // Platform span is 20%→80% of width; inbound roam in 22-48, outbound roam in 52-78
          let position
          if (isIncoming) position = 0
          else if (isOutgoing) position = 100
          else if (shouldStopAtPlatform) position = 50
          else if (platformSide === 'inbound') position = 22 + Math.random() * 26
          else position = 52 + Math.random() * 26

          return {
            ...train,
            id: `train-${index}`,
            position,
            speed: Math.floor(Math.random() * 60) + 30,
            delay: Math.floor(Math.random() * 15),
            direction: isIncoming ? 'inbound' : isOutgoing ? 'outbound' : platformSide,
            status: shouldStopAtPlatform ? 'Stopped' :
                   ['On Time', 'Delayed', 'Maintenance'][Math.floor(Math.random() * 3)],
            route: `${train.Origin} → ${train.Destination}`,
            type: train.Type,
            priority: train.Priority,
            isStopped: shouldStopAtPlatform,
            stopEndTime: shouldStopAtPlatform ? Date.now() + 5000 : null,
            platform: isPlatform ? (index - 1) : null,
            track: isIncoming ? 'incoming' : isOutgoing ? 'outgoing' : 'platform'
          }
        })
        setAnimatedTrains(animated)
      } catch (error) {
        console.error('Error fetching trains:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTrains()
  }, [])

  // 1s ticker for updating any countdown timers
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'on time': return '#10b981'
      case 'delayed': return '#f59e0b'
      case 'maintenance': return '#6b7280'
      default: return '#3b82f6'
    }
  }

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#3b82f6'
    }
  }

  return (
    <div className="grid">
     

      {/* System Status Overview */}
      <div className="card" style={{
        gridColumn: 'span 12', 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', 
        color: 'white',
        padding: '40px',
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          ⚙️
        </div>
        
        <h1 style={{
          margin: '0 0 32px 0', 
          fontSize: '32px', 
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            ⚙️
          </div>
          Indian Railways Control System
        </h1>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px'}}>
          <div className="animate-slide-in">
            <div style={{fontSize: '16px', opacity: '0.9', marginBottom: '8px', fontWeight: '500'}}>System Status</div>
            <div style={{fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px'}}>Operational</div>
            <div style={{fontSize: '14px', opacity: '0.8'}}>All systems running</div>
          </div>
          <div className="animate-slide-in" style={{animationDelay: '0.1s'}}>
            <div style={{fontSize: '16px', opacity: '0.9', marginBottom: '8px', fontWeight: '500'}}>Active Trains</div>
            <div style={{fontSize: '32px', fontWeight: 'bold', marginBottom: '4px'}}>
              {isLoading ? <div className="loading-spinner" style={{width: '32px', height: '32px'}}></div> : trains.length}
            </div>
            <div style={{fontSize: '14px', opacity: '0.8'}}>On schedule: {isLoading ? '...' : trains.filter(t => t.TrackStatus === 'On Time').length}</div>
          </div>
          <div className="animate-slide-in" style={{animationDelay: '0.2s'}}>
            <div style={{fontSize: '16px', opacity: '0.9', marginBottom: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px'}}>
              🚦 Traffic Control
            </div>
            <div style={{fontSize: '32px', fontWeight: 'bold', marginBottom: '4px'}}>Active</div>
            <div style={{fontSize: '14px', opacity: '0.8'}}>Signals: {isLoading ? '...' : Math.min(trains.length, 8)} monitored</div>
          </div>
        </div>
      </div>

      {/* Control Tabs */}
      <div style={{gridColumn: 'span 12', marginBottom: '32px'}}>
        <div style={{display: 'flex', gap: '0', background: 'white', borderRadius: '12px', padding: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}>
          {[
            { id: 'tracking', name: 'Train Tracking', icon: '🚂' },
            { id: 'signals', name: 'Signal Control', icon: '🚦' },
            { id: 'platforms', name: 'Platform Management', icon: '🚉' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #f97316, #fb923c)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--gov-gray)',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontWeight: '600',
                fontSize: '16px',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                flex: '1',
                justifyContent: 'center',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(249,115,22,0.3)' : 'none',
                transform: activeTab === tab.id ? 'translateY(-2px)' : 'none'
              }}
            >
              <span style={{fontSize: '20px'}}>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Train Tracking - Single Station with Multiple Platforms */}
      {activeTab === 'tracking' && (
        <div style={{gridColumn: 'span 12'}}>
          <div className="card">
            <h3 style={{margin: '0 0 20px 0', fontSize: '24px', fontWeight: '700'}}>
              🚂 Railway Station Control System
            </h3>
            
            {/* Station Layout Diagram */}
            <div style={{
              position: 'relative',
              background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
              borderRadius: '12px',
              padding: '30px',
              minHeight: '600px',
              overflow: 'hidden',
              marginBottom: '20px'
            }}>
              {/* Station Title */}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(255,255,255,0.9)',
                color: 'var(--gov-blue)',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: 'bold',
                zIndex: 20
              }}>
                Railway Station
              </div>

              {/* 2 Incoming Lanes (Left Side) */}
              <div style={{
                position: 'absolute',
                top: '20%',
                left: '5%',
                width: '3px',
                height: '60%',
                background: 'rgba(255,255,255,0.4)',
                borderRadius: '2px'
              }}></div>
              
              <div style={{
                position: 'absolute',
                top: '20%',
                left: '12%',
                width: '3px',
                height: '60%',
                background: 'rgba(255,255,255,0.4)',
                borderRadius: '2px'
              }}></div>

              {/* 2 Outgoing Lanes (Right Side) */}
              <div style={{
                position: 'absolute',
                top: '20%',
                right: '5%',
                width: '3px',
                height: '60%',
                background: 'rgba(255,255,255,0.4)',
                borderRadius: '2px'
              }}></div>
              
              <div style={{
                position: 'absolute',
                top: '20%',
                right: '12%',
                width: '3px',
                height: '60%',
                background: 'rgba(255,255,255,0.4)',
                borderRadius: '2px'
              }}></div>

              {/* Platform Tracks (Center) */}
              {[1, 2, 3, 4].map((platform, index) => {
                const platformY = 25 + index * 12
                return (
                  <div key={platform}>
                    {/* Platform Track */}
                    <div style={{
                      position: 'absolute',
                      top: `${platformY}%`,
                      left: '20%',
                      right: '20%',
                      height: '3px',
                      background: 'rgba(255,255,255,0.5)',
                      borderRadius: '2px'
                    }}></div>

                    {/* Parallel Track (dashed) */}
                    <div style={{
                      position: 'absolute',
                      top: `${platformY + 2}%`,
                      left: '20%',
                      right: '20%',
                      height: '0px',
                      borderTop: '2px dashed rgba(255,255,255,0.6)'
                    }}></div>
                    
                    {/* Platform Label */}
                    <div style={{
                      position: 'absolute',
                      top: `${platformY}%`,
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(255,255,255,0.9)',
                      color: 'var(--gov-blue)',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      zIndex: 5
                    }}>
                      Platform {platform}
                    </div>
                  </div>
                )
              })}

              {/* Track Labels */}
              <div style={{
                position: 'absolute',
                top: '15%',
                left: '2%',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed'
              }}>
                Incoming Lanes
              </div>
              
              <div style={{
                position: 'absolute',
                top: '15%',
                right: '2%',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed'
              }}>
                Outgoing Lanes
              </div>

              {/* Home Signals */}
              {[1, 2, 3, 4].map((signal, index) => {
                const platformTrain = animatedTrains.slice(2, 6)[index]
                const occupied = platformTrain && (
                  (platformTrain.isStopped && platformTrain.stopEndTime && platformTrain.stopEndTime > now) ||
                  (typeof platformTrain.position === 'number' && Math.abs(platformTrain.position - 50) < 4)
                )
                const color = occupied ? '#ef4444' : '#10b981'
                return (
                  <div key={signal}>
                    {/* Left Signal */}
                    <div style={{
                      position: 'absolute',
                      top: `${27 + index * 12}%`,
                      left: '12%',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: color,
                      boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                      animation: 'pulse 2s infinite'
                    }}></div>
                    
                    {/* Right Signal */}
                    <div style={{
                      position: 'absolute',
                      top: `${27 + index * 12}%`,
                      right: '12%',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: color,
                      boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                      animation: 'pulse 2s infinite'
                    }}></div>
                  </div>
                )
              })}

              {/* Trains on Incoming Lanes (Left Side) */}
              {animatedTrains.slice(0, 2).map((train, index) => {
                const laneX = 5 + (index * 7) // 5% and 12% positions
                return (
                  <div
                    key={train.id}
                    className="train-move"
                    style={{
                      position: 'absolute',
                      top: `${25 + (index * 15)}%`,
                      left: `${laneX}%`,
                      background: train.type === 'Express' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
                                 train.type === 'Freight' ? 'linear-gradient(135deg, #6b7280, #4b5563)' :
                                 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      boxShadow: '0 3px 8px rgba(0,0,0,0.4)',
                      animationDelay: `${index * 0.5}s`,
                      animationDuration: '8s',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      minWidth: '80px',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <div style={{fontSize: '14px'}}>🚂</div>
                    <div>
                      <div style={{fontSize: '12px', fontWeight: 'bold'}}>{train.TrainNumber}</div>
                      <div style={{fontSize: '9px', opacity: '0.9'}}>{train.type}</div>
                    </div>
                  </div>
                )
              })}

              {/* Trains on Platform Tracks */}
              {animatedTrains.slice(2, 6).map((train, index) => {
                const platformY = 25 + (index * 12)
                const isStoppedActive = train.isStopped && train.stopEndTime && train.stopEndTime > now
                const remainingMs = isStoppedActive ? (train.stopEndTime - now) : 0
                const remainingSeconds = isStoppedActive ? Math.max(0, Math.ceil(remainingMs / 1000)) : 0
                
                return (
                  <div
                    key={train.id}
                    className={isStoppedActive ? 'train-stopped' : 'train-move'}
                    style={{
                      position: 'absolute',
                      top: `${platformY}%`,
                      // Keep trains within platform track span (20% → 80%). If position already scaled to 0-100 in that span, clamp.
                      left: `calc(20% + ${Math.max(0, Math.min(100, train.position))} * 0.6%)`,
                      background: train.type === 'Express' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
                                 train.type === 'Freight' ? 'linear-gradient(135deg, #6b7280, #4b5563)' :
                                 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      boxShadow: '0 3px 8px rgba(0,0,0,0.4)',
                      animationDelay: `${index * 0.5}s`,
                      animationDuration: isStoppedActive ? '5s' : '12s',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      minWidth: '80px',
                      transform: isStoppedActive ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{fontSize: '14px'}}>🚂</div>
                    <div>
                      <div style={{fontSize: '12px', fontWeight: 'bold'}}>{train.TrainNumber}</div>
                      <div style={{fontSize: '9px', opacity: '0.9'}}>{train.type}</div>
                    </div>
                    {isStoppedActive && (
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        padding: '2px 6px',
                        background: '#0ea5e9',
                        color: 'white',
                        borderRadius: '10px',
                        fontSize: '10px',
                        fontWeight: '700',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                      }}>
                        {remainingSeconds}s
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Trains on Outgoing Lanes (Right Side) */}
              {animatedTrains.slice(6, 8).map((train, index) => {
                const laneX = 88 - (index * 7) // 88% and 81% positions
                return (
                  <div
                    key={train.id}
                    className="train-move"
                    style={{
                      position: 'absolute',
                      top: `${25 + (index * 15)}%`,
                      left: `${laneX}%`,
                      background: train.type === 'Express' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
                                 train.type === 'Freight' ? 'linear-gradient(135deg, #6b7280, #4b5563)' :
                                 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      boxShadow: '0 3px 8px rgba(0,0,0,0.4)',
                      animationDelay: `${index * 0.5}s`,
                      animationDuration: '8s',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      minWidth: '80px',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <div style={{fontSize: '14px'}}>🚂</div>
                    <div>
                      <div style={{fontSize: '12px', fontWeight: 'bold'}}>{train.TrainNumber}</div>
                      <div style={{fontSize: '9px', opacity: '0.9'}}>{train.type}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Train Information Panel */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px'}}>
              {animatedTrains.slice(0, 4).map((train, index) => (
                <div
                  key={train.id}
                  className="card animate-slide-in"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    border: '2px solid var(--gov-border)',
                    background: 'white'
                  }}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                    <h4 style={{margin: 0, color: 'var(--gov-blue)'}}>{train.TrainNumber}</h4>
                    <div className={`status-indicator ${train.status === 'On Time' ? 'status-online' : train.status === 'Delayed' ? 'status-warning' : 'status-maintenance'}`}>
                      {train.status}
                    </div>
                  </div>
                  
                  <div style={{marginBottom: '8px'}}>
                    <div style={{fontSize: '14px', color: 'var(--gov-gray)', marginBottom: '4px'}}>Route</div>
                    <div style={{fontWeight: '600'}}>{train.route}</div>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px'}}>
                    <div>
                      <div style={{fontSize: '12px', color: 'var(--gov-gray)'}}>Speed</div>
                      <div style={{fontSize: '18px', fontWeight: 'bold', color: 'var(--gov-blue)'}}>{train.speed} km/h</div>
                    </div>
                    <div>
                      <div style={{fontSize: '12px', color: 'var(--gov-gray)'}}>Delay</div>
                      <div style={{fontSize: '18px', fontWeight: 'bold', color: train.delay > 5 ? 'var(--gov-red)' : 'var(--gov-green)'}}>
                        {train.delay} min
                      </div>
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button className="gov-button" style={{padding: '6px 12px', fontSize: '12px'}}>
                      Track
                    </button>
                    <button className="gov-button gov-button-orange" style={{padding: '6px 12px', fontSize: '12px'}}>
                      Control
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Signal Control */}
      {activeTab === 'signals' && (
        <div style={{gridColumn: 'span 12'}}>
          <div className="card">
            <h3>🚦 Signal Control System</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px'}}>
              {trains.slice(0, 6).map((train, index) => (
                <div key={index} className="card animate-slide-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                    <h4 style={{margin: 0}}>Signal {index + 1}</h4>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: getStatusColor(train.SignalState),
                      animation: 'pulse 2s infinite'
                    }}></div>
                  </div>
                  <div style={{color: 'var(--gov-gray)', marginBottom: '12px'}}>Location: {train.Origin}</div>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button className="gov-button gov-button-green" style={{padding: '6px 12px', fontSize: '12px'}}>
                      Set Green
                    </button>
                    <button className="gov-button gov-button-orange" style={{padding: '6px 12px', fontSize: '12px'}}>
                      Set Yellow
                    </button>
                    <button className="gov-button gov-button-red" style={{padding: '6px 12px', fontSize: '12px'}}>
                      Set Red
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Platform Management */}
      {activeTab === 'platforms' && (
        <div style={{gridColumn: 'span 12'}}>
          <div className="card">
            <h3>🚉 Platform Management</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px'}}>
              {trains.slice(0, 4).map((train, index) => (
                <div key={index} className="card animate-slide-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                    <h4 style={{margin: 0}}>Platform {index + 1}</h4>
                    <div className={`status-indicator ${train.TrackStatus === 'On Time' ? 'status-online' : train.TrackStatus === 'Maintenance' ? 'status-maintenance' : 'status-warning'}`}>
                      {train.TrackStatus}
                    </div>
                  </div>
                  {train.TrainNumber && (
                    <div style={{color: 'var(--gov-gray)', marginBottom: '12px'}}>Train: {train.TrainNumber}</div>
                  )}
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button className="gov-button" style={{padding: '6px 12px', fontSize: '12px'}}>
                      Assign Train
                    </button>
                    <button className="gov-button gov-button-orange" style={{padding: '6px 12px', fontSize: '12px'}}>
                      Maintenance
                    </button>
                    <button className="gov-button gov-button-red" style={{padding: '6px 12px', fontSize: '12px'}}>
                      Clear
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card" style={{gridColumn: 'span 12'}}>
        <h3>⚡ Quick Actions</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
          {[
            { name: 'All Signals Green', icon: '🚦', color: 'gov-button-green' },
            { name: 'Clear All Platforms', icon: '🚂', color: 'gov-button' },
            { name: 'Maintenance Mode', icon: '🔧', color: 'gov-button-orange' },
            { name: 'Emergency Stop', icon: '🚨', color: 'gov-button-red' }
          ].map((action, index) => (
            <button
              key={action.name}
              className={`gov-button ${action.color} animate-bounce`}
              style={{
                padding: '16px',
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                animationDelay: `${index * 0.1}s`
              }}
            >
              {action.icon} {action.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}