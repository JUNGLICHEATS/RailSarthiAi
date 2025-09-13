import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''

export default function ControlPanel() {
  const [activeTab, setActiveTab] = useState('tracking')
  const [trains, setTrains] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [animatedTrains, setAnimatedTrains] = useState([])
  const [now, setNow] = useState(Date.now())
  const [isRealTimeMode, setIsRealTimeMode] = useState(false)
  const [systemStatus, setSystemStatus] = useState('operational')
  const animationRef = useRef()
  const lastUpdateRef = useRef(Date.now())

  // Generate realistic train data when API is not available
  const generateMockTrains = () => {
    const trainTypes = ['Express', 'Passenger', 'Freight', 'Superfast']
    const origins = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad']
    const destinations = ['Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Patna', 'Bhubaneswar']
    const statuses = ['On Time', 'Delayed', 'Maintenance', 'Boarding']
    
    return Array.from({ length: 8 }, (_, index) => ({
      TrainNumber: `12${String(index + 1).padStart(3, '0')}${String(Math.floor(Math.random() * 10))}`,
      Origin: origins[Math.floor(Math.random() * origins.length)],
      Destination: destinations[Math.floor(Math.random() * destinations.length)],
      Type: trainTypes[Math.floor(Math.random() * trainTypes.length)],
      Priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
      TrackStatus: statuses[Math.floor(Math.random() * statuses.length)],
      SignalState: ['Green', 'Yellow', 'Red'][Math.floor(Math.random() * 3)]
    }))
  }

  // Initialize trains with dynamic positioning
  const initializeTrains = (trainData) => {
    const trains = trainData || generateMockTrains()
    
    return trains.slice(0, 8).map((train, index) => {
      // Determine train state based on index and realistic scenarios
      const isIncoming = index < 2
      const isPlatform = index >= 2 && index < 6
      const isOutgoing = index >= 6
      
      // Create realistic movement patterns
      let position, direction, status, isStopped, stopEndTime
      
      if (isIncoming) {
        // Incoming trains start from left and move towards platforms
        position = Math.random() * 30 // 0-30% from left
        direction = 'inbound'
        status = 'Approaching'
        isStopped = false
        stopEndTime = null
      } else if (isOutgoing) {
        // Outgoing trains start from right and move away
        position = 70 + Math.random() * 30 // 70-100% from left
        direction = 'outbound'
        status = 'Departing'
        isStopped = false
        stopEndTime = null
        } else {
          // Platform trains - more realistic behavior with collision avoidance
          const platformIndex = index - 2
          const shouldStop = Math.random() > 0.4 // 60% chance to stop
          const isStoppedAtPlatform = shouldStop && Math.random() > 0.3
          
          // Determine direction based on platform position
          // Platforms 1-2 (indices 0-1) are inbound, Platforms 3-4 (indices 2-3) are outbound
          direction = platformIndex < 2 ? 'inbound' : 'outbound'
          
          // Assign specific track based on direction to prevent collisions
          const track = direction === 'inbound' ? 'platform-inbound' : 'platform-outbound'
          
          if (isStoppedAtPlatform) {
            position = 50 // Center of platform
            status = 'Stopped'
            isStopped = true
            stopEndTime = Date.now() + (3000 + Math.random() * 7000) // 3-10 seconds
          } else if (shouldStop) {
            // Approaching platform - position based on direction
            if (direction === 'inbound') {
              position = 20 + Math.random() * 20 // 20-40% (approaching from left)
            } else {
              position = 60 + Math.random() * 20 // 60-80% (approaching from right)
            }
            status = 'Approaching Platform'
            isStopped = false
            stopEndTime = null
          } else {
            // Moving through platform - position based on direction
            if (direction === 'inbound') {
              position = 30 + Math.random() * 30 // 30-60% (moving right through platform)
            } else {
              position = 40 + Math.random() * 30 // 40-70% (moving left through platform)
            }
            status = 'On Time'
            isStopped = false
            stopEndTime = null
          }
          
        }

      return {
        ...train,
        id: `train-${index}`,
        position: Math.max(0, Math.min(100, position)),
        speed: Math.floor(Math.random() * 40) + 20, // 20-60 km/h
        delay: Math.floor(Math.random() * 10), // 0-10 minutes
        direction,
        status,
        route: `${train.Origin} → ${train.Destination}`,
        type: train.Type,
        priority: train.Priority,
        isStopped,
        stopEndTime,
        platform: isPlatform ? (index - 1) : null,
        track: isIncoming ? 'incoming' : isOutgoing ? 'outgoing' : 
               (direction === 'inbound' ? 'platform-inbound' : 'platform-outbound'),
        lastUpdate: Date.now()
      }
    })
  }

  // Calculate distance between two trains
  const calculateDistance = (train1, train2) => {
    if (train1.track !== train2.track) return Infinity // Different tracks
    return Math.abs(train1.position - train2.position)
  }

  // Check if trains are on conflicting paths
  const areTrainsConflicting = (train1, train2) => {
    // Same track = conflict
    if (train1.track === train2.track) return true
    
    // Platform conflicts: inbound and outbound platforms can conflict
    if (train1.track === 'platform-inbound' && train2.track === 'platform-outbound') return false
    if (train1.track === 'platform-outbound' && train2.track === 'platform-inbound') return false
    
    // Incoming/outgoing lanes conflict with platform tracks
    if ((train1.track === 'incoming' && train2.track.startsWith('platform')) ||
        (train2.track === 'incoming' && train1.track.startsWith('platform'))) return true
    if ((train1.track === 'outgoing' && train2.track.startsWith('platform')) ||
        (train2.track === 'outgoing' && train1.track.startsWith('platform'))) return true
    
    return false
  }

  // Check for collision risk and calculate safe speed
  const calculateSafeSpeed = (train, allTrains) => {
    const minSafeDistance = 12 // Minimum safe distance between trains
    const baseSpeed = train.speed / 1000
    
    // Find trains that could conflict with this train
    const conflictingTrains = allTrains.filter(t => 
      t.id !== train.id && 
      areTrainsConflicting(train, t) && 
      !t.isStopped
    )
    
    let safeSpeed = baseSpeed
    
    conflictingTrains.forEach(otherTrain => {
      const distance = calculateDistance(train, otherTrain)
      
      if (distance < minSafeDistance) {
        // Calculate if trains are moving towards each other
        const isApproaching = (train.direction === 'inbound' && otherTrain.direction === 'outbound') ||
                             (train.direction === 'outbound' && otherTrain.direction === 'inbound')
        
        if (isApproaching || distance < minSafeDistance) {
          // Slow down or stop based on distance
          if (distance < 3) {
            safeSpeed = 0 // Stop completely
          } else if (distance < 6) {
            safeSpeed = baseSpeed * 0.1 // Very slow
          } else if (distance < 9) {
            safeSpeed = baseSpeed * 0.3 // Slow
          } else {
            safeSpeed = baseSpeed * 0.6 // Reduced speed
          }
        }
      }
    })
    
    return safeSpeed
  }

  // Real-time animation loop with collision detection
  const animateTrains = () => {
    setAnimatedTrains(prevTrains => {
      const now = Date.now()
      
      // First pass: calculate safe speeds for all trains
      const trainsWithSafeSpeeds = prevTrains.map(train => ({
        ...train,
        safeSpeed: calculateSafeSpeed(train, prevTrains)
      }))
      
      // Second pass: update positions with safe speeds
      return trainsWithSafeSpeeds.map(train => {
        let newPosition = train.position
        let newStatus = train.status
        let newIsStopped = train.isStopped
        let newStopEndTime = train.stopEndTime

        // Handle stopped trains
        if (train.isStopped && train.stopEndTime && train.stopEndTime <= now) {
          // Train finished stopping, continue movement
          newIsStopped = false
          newStopEndTime = null
          newStatus = train.direction === 'inbound' ? 'Departing' : 'Approaching'
        }

        // Move trains based on their state with collision avoidance
        if (!newIsStopped) {
          const timeDelta = (now - train.lastUpdate) / 1000 // seconds
          const safeSpeed = train.safeSpeed || (train.speed / 1000)
          
          if (train.direction === 'inbound') {
            // Inbound trains move from left to right (0 to 100)
            newPosition = Math.min(100, train.position + safeSpeed * timeDelta)
            if (newPosition >= 100) {
              // Train reached end, reset to start
              newPosition = 0
              newStatus = 'Approaching'
            }
          } else if (train.direction === 'outbound') {
            // Outbound trains move from right to left (100 to 0)
            newPosition = Math.max(0, train.position - safeSpeed * timeDelta)
            if (newPosition <= 0) {
              // Train reached end, reset to start
              newPosition = 100
              newStatus = 'Departing'
            }
          } else {
            // Platform trains - move based on their direction with collision avoidance
            if (train.direction === 'inbound') {
              // Platform inbound trains move right
              newPosition = Math.min(80, train.position + safeSpeed * timeDelta * 0.5)
            } else {
              // Platform outbound trains move left
              newPosition = Math.max(20, train.position - safeSpeed * timeDelta * 0.5)
            }
          }
        }

        return {
          ...train,
          position: newPosition,
          status: newStatus,
          isStopped: newIsStopped,
          stopEndTime: newStopEndTime,
          lastUpdate: now
        }
      })
    })
  }

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        setIsLoading(true)
        let trainData = null
        
        if (API) {
          try {
            const response = await axios.get(`${API}/api/trains`)
            trainData = response.data
            setIsRealTimeMode(false)
          } catch (error) {
            console.log('API not available, using mock data')
            setIsRealTimeMode(true)
          }
        } else {
          setIsRealTimeMode(true)
        }
        
        const initializedTrains = initializeTrains(trainData)
        setTrains(trainData || generateMockTrains())
        setAnimatedTrains(initializedTrains)
        
      } catch (error) {
        console.error('Error initializing trains:', error)
        setIsRealTimeMode(true)
        const mockTrains = generateMockTrains()
        setTrains(mockTrains)
        setAnimatedTrains(initializeTrains(mockTrains))
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTrains()
  }, [])

  // Real-time animation loop
  useEffect(() => {
    const animate = () => {
      if (isRealTimeMode) {
        animateTrains()
      }
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRealTimeMode])

  // 1s ticker for updating any countdown timers and system status
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
      
      // Update system status based on train states
      const delayedTrains = animatedTrains.filter(train => train.delay > 5).length
      const maintenanceTrains = animatedTrains.filter(train => train.status === 'Maintenance').length
      
      if (maintenanceTrains > 2) {
        setSystemStatus('maintenance')
      } else if (delayedTrains > 3) {
        setSystemStatus('delayed')
      } else {
        setSystemStatus('operational')
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [animatedTrains])

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
    <>
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
  justifyContent: 'center'
}}>
  <img 
    src="/brand1.jpg" 
    alt="Settings Icon" 
    style={{ width: '48px', height: '48px' , borderRadius: '12px' }} 
  />
</div>

          Indian Railways Control System
        </h1>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px'}}>
          <div className="animate-slide-in">
            <div style={{fontSize: '16px', opacity: '0.9', marginBottom: '8px', fontWeight: '500'}}>System Status</div>
            <div style={{
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: systemStatus === 'operational' ? '#10b981' : 
                     systemStatus === 'delayed' ? '#f59e0b' : '#ef4444',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {systemStatus === 'operational' ? '🟢' : 
               systemStatus === 'delayed' ? '🟡' : '🔴'}
              {systemStatus === 'operational' ? 'Operational' : 
               systemStatus === 'delayed' ? 'Delayed' : 'Maintenance'}
            </div>
            <div style={{fontSize: '14px', opacity: '0.8'}}>
              {isRealTimeMode ? 'Real-time simulation active' : 'Live data connected'}
            </div>
          </div>
          <div className="animate-slide-in" style={{animationDelay: '0.1s'}}>
            <div style={{fontSize: '16px', opacity: '0.9', marginBottom: '8px', fontWeight: '500'}}>Active Trains</div>
            <div style={{fontSize: '32px', fontWeight: 'bold', marginBottom: '4px'}}>
              {isLoading ? <div className="loading-spinner" style={{width: '32px', height: '32px'}}></div> : animatedTrains.length}
            </div>
            <div style={{fontSize: '14px', opacity: '0.8'}}>
              On time: {isLoading ? '...' : animatedTrains.filter(t => t.status === 'On Time' || t.status === 'Approaching').length} | 
              Delayed: {isLoading ? '...' : animatedTrains.filter(t => t.delay > 5).length}
            </div>
          </div>
          <div className="animate-slide-in" style={{animationDelay: '0.2s'}}>
            <div style={{fontSize: '16px', opacity: '0.9', marginBottom: '8px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px'}}>
              🚦 Traffic Control
            </div>
            <div style={{fontSize: '32px', fontWeight: 'bold', marginBottom: '4px'}}>
              {isRealTimeMode ? 'Simulation' : 'Live'}
            </div>
            <div style={{fontSize: '14px', opacity: '0.8'}}>
              Signals: {isLoading ? '...' : Math.min(animatedTrains.length, 8)} monitored | 
              Platforms: {isLoading ? '...' : animatedTrains.filter(t => t.track === 'platform').length} active
            </div>
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
                const isMoving = train.direction === 'inbound' && !train.isStopped
                return (
                  <div
                    key={train.id}
                    className={isMoving ? "train-move" : "train-stopped"}
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
                      animationDuration: isMoving ? '8s' : 'none',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      minWidth: '80px',
                      transform: 'translateX(-50%)',
                      opacity: train.position < 5 ? 0.3 : 1,
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    <div style={{fontSize: '14px'}}>🚂</div>
                    <div>
                      <div style={{fontSize: '12px', fontWeight: 'bold'}}>{train.TrainNumber}</div>
                      <div style={{fontSize: '9px', opacity: '0.9'}}>{train.type}</div>
                    </div>
                    {train.isStopped && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        padding: '2px 4px',
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '8px',
                        fontWeight: '700'
                      }}>
                        STOP
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Trains on Platform Tracks */}
              {animatedTrains.slice(2, 6).map((train, index) => {
                const platformY = 25 + (index * 12)
                const isStoppedActive = train.isStopped && train.stopEndTime && train.stopEndTime > now
                const remainingMs = isStoppedActive ? (train.stopEndTime - now) : 0
                const remainingSeconds = isStoppedActive ? Math.max(0, Math.ceil(remainingMs / 1000)) : 0
                
                // Calculate position within platform area (20% to 80%)
                const platformPosition = Math.max(20, Math.min(80, train.position))
                const leftPosition = `calc(20% + ${(platformPosition - 20) * 0.6}%)`
                
                // Determine if train is visible (not off-screen)
                const isVisible = train.position >= 15 && train.position <= 85
                
                return (
                  <div
                    key={train.id}
                    className={isStoppedActive ? 'train-stopped' : 
                              train.direction === 'outbound' ? 'train-move-outbound' : 'train-move'}
                    style={{
                      position: 'absolute',
                      top: `${platformY}%`,
                      left: leftPosition,
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
                      animationDuration: isStoppedActive ? 'none' : '12s',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      minWidth: '80px',
                      transform: isStoppedActive ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                      opacity: isVisible ? 1 : 0.3,
                      transform: `translateX(-50%) ${isStoppedActive ? 'scale(1.1)' : 'scale(1)'}`
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
                    {/* Direction indicator */}
                    <div style={{
                      position: 'absolute',
                      top: '-5px',
                      left: '-5px',
                      fontSize: '8px',
                      background: train.direction === 'inbound' ? '#10b981' : '#3b82f6',
                      color: 'white',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {train.direction === 'inbound' ? '→' : '←'}
                    </div>
                  </div>
                )
              })}

              {/* Trains on Outgoing Lanes (Right Side) */}
              {animatedTrains.slice(6, 8).map((train, index) => {
                const laneX = 88 - (index * 7) // 88% and 81% positions
                const isMoving = train.direction === 'outbound' && !train.isStopped
                return (
                  <div
                    key={train.id}
                    className={isMoving ? "train-move-outbound" : "train-stopped"}
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
                      animationDuration: isMoving ? '8s' : 'none',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      minWidth: '80px',
                      transform: 'translateX(-50%)',
                      opacity: train.position > 95 ? 0.3 : 1,
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    <div style={{fontSize: '14px'}}>🚂</div>
                    <div>
                      <div style={{fontSize: '12px', fontWeight: 'bold'}}>{train.TrainNumber}</div>
                      <div style={{fontSize: '9px', opacity: '0.9'}}>{train.type}</div>
                    </div>
                    {train.isStopped && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        padding: '2px 4px',
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '8px',
                        fontWeight: '700'
                      }}>
                        STOP
                      </div>
                    )}
                    {/* Direction indicator */}
                    <div style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      fontSize: '8px',
                      background: '#3b82f6',
                      color: 'white',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      ←
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Train Information Panel */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px'}}>
              {animatedTrains.slice(0, 6).map((train, index) => {
                // Check for collision warnings
                const conflictingTrains = animatedTrains.filter(t => 
                  t.id !== train.id && 
                  areTrainsConflicting(train, t) && 
                  calculateDistance(train, t) < 15
                )
                const hasCollisionWarning = conflictingTrains.length > 0
                
                return (
                  <div
                    key={train.id}
                    className="card animate-slide-in"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      border: hasCollisionWarning ? '2px solid #ef4444' : '2px solid var(--gov-border)',
                      background: hasCollisionWarning ? '#fef2f2' : 'white',
                      boxShadow: hasCollisionWarning ? '0 0 10px rgba(239, 68, 68, 0.3)' : 'none'
                    }}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                      <h4 style={{margin: 0, color: 'var(--gov-blue)'}}>{train.TrainNumber}</h4>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        {hasCollisionWarning && (
                          <div style={{
                            background: '#ef4444',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }}>
                            ⚠️ COLLISION RISK
                          </div>
                        )}
                        <div className={`status-indicator ${train.status === 'On Time' ? 'status-online' : train.status === 'Delayed' ? 'status-warning' : 'status-maintenance'}`}>
                          {train.status}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{marginBottom: '8px'}}>
                      <div style={{fontSize: '14px', color: 'var(--gov-gray)', marginBottom: '4px'}}>Route</div>
                      <div style={{fontWeight: '600'}}>{train.route}</div>
                    </div>
                    
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px'}}>
                      <div>
                        <div style={{fontSize: '12px', color: 'var(--gov-gray)'}}>Speed</div>
                        <div style={{
                          fontSize: '18px', 
                          fontWeight: 'bold', 
                          color: train.safeSpeed < train.speed / 1000 ? '#f59e0b' : 'var(--gov-blue)'
                        }}>
                          {Math.round((train.safeSpeed || train.speed / 1000) * 1000)} km/h
                          {train.safeSpeed < train.speed / 1000 && (
                            <span style={{fontSize: '12px', color: '#f59e0b', marginLeft: '4px'}}>
                              (reduced)
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div style={{fontSize: '12px', color: 'var(--gov-gray)'}}>Track</div>
                        <div style={{fontSize: '14px', fontWeight: 'bold', color: 'var(--gov-blue)'}}>
                          {train.track.replace('-', ' ').toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    {hasCollisionWarning && (
                      <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '4px',
                        padding: '8px',
                        marginBottom: '12px',
                        fontSize: '12px',
                        color: '#dc2626'
                      }}>
                        <strong>⚠️ Collision Warning:</strong> Too close to {conflictingTrains.length} other train(s)
                      </div>
                    )}
                    
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button className="gov-button" style={{padding: '6px 12px', fontSize: '12px'}}>
                        Track
                      </button>
                      <button className="gov-button gov-button-orange" style={{padding: '6px 12px', fontSize: '12px'}}>
                        Control
                      </button>
                      {hasCollisionWarning && (
                        <button className="gov-button gov-button-red" style={{padding: '6px 12px', fontSize: '12px'}}>
                          Emergency Stop
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
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
              {trains.slice(0, 8).map((train, index) => (
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
    </div>
    
    {/* CSS Animations */}
    <style jsx>{`
      @keyframes train-move-inbound {
        0% { transform: translateX(-100px); }
        100% { transform: translateX(calc(100vw + 100px)); }
      }
      
      @keyframes train-move-outbound {
        0% { transform: translateX(100px); }
        100% { transform: translateX(calc(-100vw - 100px)); }
      }
      
      .train-move {
        animation: train-move-inbound 8s linear infinite;
      }
      
      .train-move-outbound {
        animation: train-move-outbound 8s linear infinite;
      }
      
      .train-stopped {
        animation: none;
      }
      
      .loading-spinner {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      .animate-slide-in {
        animation: slideIn 0.6s ease-out forwards;
        opacity: 0;
        transform: translateY(20px);
      }
      
      @keyframes slideIn {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
    </>
  )
}