import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''

// Train type images mapping
const getTrainTypeImage = (type) => {
  const trainImages = {
    'Express': '🚄', // High-speed train
    'Passenger': '🚂', // Regular passenger train
    'Freight': '🚛', // Freight train
    'Local': '🚃', // Local train
    'Metro': '🚇', // Metro train
    'Maintenance': '🔧', // Maintenance train
    'Special': '⭐', // Special train
    'default': '🚂' // Default train
  }
  return trainImages[type] || trainImages['default']
}

// Random speed generator with decreasing trend
const generateRandomSpeed = (baseSpeed = 0) => {
  const variation = Math.random() * 20 - 10 // -10 to +10 variation
  const newSpeed = Math.max(0, baseSpeed + variation)
  return Math.round(newSpeed)
}

export default function KPI() {
  const [trains, setTrains] = useState([])
  const [selectedTrain, setSelectedTrain] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [speeds, setSpeeds] = useState({})
  const [kpis, setKpis] = useState(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef(null)
  const slideIntervalRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        let trainData = null
        let kpiData = null
        
        if (API) {
          try {
            const [trainsResponse, kpisResponse] = await Promise.all([
              axios.get(`${API}/api/trains`),
              axios.get(`${API}/api/kpis`)
            ])
            trainData = trainsResponse.data
            kpiData = kpisResponse.data
          } catch (error) {
            console.log('API not available, using mock data')
            trainData = generateMockTrains()
            kpiData = generateMockKPIs()
          }
        } else {
          trainData = generateMockTrains()
          kpiData = generateMockKPIs()
        }
        
        setTrains(trainData)
        setKpis(kpiData)
        
        // Initialize random speeds for all trains
        const initialSpeeds = {}
        trainData.forEach((train, index) => {
          initialSpeeds[train.TrainNumber] = Math.floor(Math.random() * 50)
        })
        setSpeeds(initialSpeeds)
      } catch (error) {
        console.error('Error fetching data:', error)
        setTrains(generateMockTrains())
        setKpis(generateMockKPIs())
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Generate mock train data when API is not available
  const generateMockTrains = () => {
    const trainTypes = ['Express', 'Passenger', 'Freight', 'Superfast', 'Rajdhani', 'Shatabdi', 'Local', 'Metro']
    const origins = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad']
    const destinations = ['Jaipur', 'Lucknow', 'Patna', 'Bhubaneswar', 'Kochi', 'Goa', 'Varanasi', 'Amritsar']
    const statuses = ['On Time', 'Delayed', 'Maintenance', 'Cancelled', 'Boarding']
    const priorities = ['High', 'Medium', 'Low']
    const weathers = ['Clear', 'Rainy', 'Foggy', 'Stormy', 'Snowy']
    const disruptions = ['None', 'Track Maintenance', 'Signal Failure', 'Weather', 'Accident']
    
    return Array.from({ length: 100 }, (_, index) => ({
      TrainNumber: `12${String(index + 1).padStart(3, '0')}${String(Math.floor(Math.random() * 10))}`,
      TrainName: `Train ${index + 1}`,
      Origin: origins[Math.floor(Math.random() * origins.length)],
      Destination: destinations[Math.floor(Math.random() * destinations.length)],
      Type: trainTypes[Math.floor(Math.random() * trainTypes.length)],
      Priority: priorities[Math.floor(Math.random() * priorities.length)],
      TrackStatus: statuses[Math.floor(Math.random() * statuses.length)],
      SignalState: ['Green', 'Yellow', 'Red'][Math.floor(Math.random() * 3)],
      Weather: weathers[Math.floor(Math.random() * weathers.length)],
      Disruption: disruptions[Math.floor(Math.random() * disruptions.length)],
      PassengerLoad: Math.floor(Math.random() * 100) + '%',
      Speed: Math.floor(Math.random() * 80) + 20,
      Delay: Math.floor(Math.random() * 30)
    }))
  }

  // Generate mock KPI data
  const generateMockKPIs = () => ({
    punctuality: Math.floor(Math.random() * 20) + 70,
    avgDelay: Math.floor(Math.random() * 15) + 5,
    throughput: Math.floor(Math.random() * 50) + 150,
    utilization: Math.floor(Math.random() * 20) + 75
  })

  // Update speeds every 3 seconds with decreasing trend
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeeds(prevSpeeds => {
        const newSpeeds = {}
        Object.keys(prevSpeeds).forEach(trainNumber => {
          const currentSpeed = prevSpeeds[trainNumber]
          newSpeeds[trainNumber] = generateRandomSpeed(currentSpeed)
        })
        return newSpeeds
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Auto-rotate slides every 4 seconds
  useEffect(() => {
    if (trains.length > 0) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentSlideIndex(prevIndex => (prevIndex + 1) % trains.length)
      }, 4000)
    }

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current)
      }
    }
  }, [trains.length])

  // Animation effect for slide transitions
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 800) // Animation duration
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  // Trigger animation when slide index changes
  useEffect(() => {
    setIsAnimating(true)
  }, [currentSlideIndex])

  const getTrainData = (train, index) => {
    const trainNumber = train.TrainNumber || `TRAIN ${String(index + 1).padStart(2, '0')}`
    const power = train.TrackStatus !== 'Maintenance'
    const wifi = train.SignalState === 'Green' || train.SignalState === 'Yellow'
    const currentHours = Math.floor(Math.random() * 1000) + 500
    const maxHours = 1000
    const speed = speeds[train.TrainNumber] || 0
    const lastUpdated = new Date().toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }) + ' | ' + new Date().toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    
    let status = 'none'
    if (train.Disruption !== 'None') status = 'alert'
    else if (train.TrackStatus === 'Maintenance') status = 'maintenance'
    else if (speed === 0) status = 'battery'
    
    const exceeded = currentHours > maxHours
    const color = exceeded ? 'red' : 'blue'

    return {
      id: trainNumber,
      trainNumber,
      trainName: train.TrainName,
      power,
      wifi,
      currentHours,
      maxHours,
      speed,
      lastUpdated,
      status,
      color,
      exceeded,
      type: train.Type,
      priority: train.Priority,
      origin: train.Origin,
      destination: train.Destination
    }
  }

  // Show all trains in vertical scroll

  const getStatusIcon = (status) => {
    switch(status) {
      case 'battery': return '🔋'
      case 'alert': return '⚠️'
      case 'maintenance': return '🔧'
      default: return '▶️'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'battery': return '#1976d2'
      case 'alert': return '#f44336'
      case 'maintenance': return '#1976d2'
      default: return '#1976d2'
    }
  }

  return (
    <>
      <style>
        {`
          .hidden-scrollbar {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* Internet Explorer 10+ */
          }
          .hidden-scrollbar::-webkit-scrollbar {
            display: none; /* WebKit browsers */
          }
        `}
      </style>
      <div className="grid" style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%), url("https://www.neweb.info/wp-content/uploads/2023/01/10-REXDATA-Rail-Software-Digital-Locomotor.jpg") center/cover',
        backgroundAttachment: 'fixed',
        height: '100vh',
        overflow: 'hidden'
      }}>
      {/* Header Section */}
      <div className="card" style={{
        gridColumn: 'span 12',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: 'white',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        
        
        {/* KPIs Row */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px'}}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{fontSize: '12px', color: '#94a3b8', marginBottom: '4px'}}>PUNCTUALITY</div>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#10b981'}}>
              {isLoading ? '...' : kpis?.punctuality || 0}%
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{fontSize: '12px', color: '#94a3b8', marginBottom: '4px'}}>AVG DELAY</div>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#ef4444'}}>
              {isLoading ? '...' : Math.floor(Math.random() * 15) + 5} min
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{fontSize: '12px', color: '#94a3b8', marginBottom: '4px'}}>THROUGHPUT</div>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#3b82f6'}}>
              {isLoading ? '...' : Math.floor(Math.random() * 50) + 150} trains/day
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{fontSize: '12px', color: '#94a3b8', marginBottom: '4px'}}>UTILIZATION</div>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#f59e0b'}}>
              {isLoading ? '...' : Math.floor(Math.random() * 20) + 75}%
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{gridColumn: 'span 12', textAlign: 'center', padding: '40px'}}>
          <div style={{fontSize: '24px', marginBottom: '16px'}}>🚂</div>
          <div style={{fontSize: '18px', color: '#94a3b8'}}>Loading train data...</div>
        </div>
      )}

      {/* Animated Train Grid - Full Screen */}
      {!isLoading && (
        <div className="hidden-scrollbar" style={{
          gridColumn: 'span 12',
          height: 'calc(100vh - 200px)',
          overflowY: 'auto',
          paddingRight: '8px',
          position: 'relative'
        }}>
          <div style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '16px',
            position: 'relative'
          }}>
            {trains.map((train, index) => {
              const trainData = getTrainData(train, index)
              const isCurrentSlide = index === currentSlideIndex
              const slidePosition = (index - currentSlideIndex + trains.length) % trains.length
              
              // Calculate animation properties based on slide position
              const getSlideStyle = () => {
                const baseStyle = {
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'white',
                  cursor: 'pointer',
                  border: selectedTrain === trainData.id ? '2px solid #10b981' : '1px solid #475569',
                  boxShadow: selectedTrain === trainData.id ? '0 8px 25px rgba(16,185,129,0.3)' : '0 4px 6px -1px rgba(0,0,0,0.1)',
                  minHeight: '280px',
                  position: 'relative',
                  overflow: 'hidden'
                }

                if (isAnimating) {
                  // During animation, slides move smoothly
                  const translateX = (slidePosition - 2) * 25 // Move slides horizontally
                  const scale = slidePosition === 2 ? 1.05 : 1 // Center slide is slightly larger
                  const opacity = slidePosition <= 3 ? 1 : 0.3 // Fade out distant slides
                  
                  return {
                    ...baseStyle,
                    transform: `translateX(${translateX}%) scale(${scale})`,
                    opacity: opacity,
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: slidePosition === 2 ? 10 : 5 - slidePosition
                  }
                } else {
                  // Static state - all slides in normal grid position
                  return {
                    ...baseStyle,
                    transform: selectedTrain === trainData.id ? 'translateY(-4px)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    animationDelay: `${index * 0.1}s`
                  }
                }
              }

              return (
                <div 
                  key={`${trainData.id}-${currentSlideIndex}`}
                  className="card animate-slide-in"
                  style={getSlideStyle()}
                  onClick={() => setSelectedTrain(trainData.id)}
                >
                  {/* Animated Background Pattern */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                    backgroundSize: '200% 200%',
                    animation: isAnimating ? 'shimmer 2s ease-in-out infinite' : 'none',
                    pointerEvents: 'none'
                  }} />

                  {/* Train Number Header with Animation */}
                  <div style={{
                    background: isCurrentSlide ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : '#3b82f6',
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 2,
                    transform: isCurrentSlide ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    boxShadow: isCurrentSlide ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none'
                  }}>
                    {trainData.trainNumber}
                  </div>

                  {/* Train Type Image with Enhanced Animation */}
                  <div style={{
                    width: '100%',
                    height: '60px',
                    background: isCurrentSlide ? 'linear-gradient(45deg, #fbbf24, #f59e0b, #fbbf24)' : 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isCurrentSlide ? '32px' : '28px',
                    position: 'relative',
                    zIndex: 2,
                    transform: isCurrentSlide ? 'scale(1.1) rotate(2deg)' : 'scale(1) rotate(0deg)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isCurrentSlide ? '0 8px 20px rgba(251, 191, 36, 0.4)' : '0 4px 8px rgba(0,0,0,0.2)',
                    animation: isCurrentSlide ? 'pulse-glow 2s ease-in-out infinite' : 'none'
                  }}>
                    {getTrainTypeImage(trainData.type)}
                  </div>

                  {/* Status Icons with Enhanced Animation */}
                  <div style={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '12px',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    <div style={{
                      color: trainData.power ? '#10b981' : '#ef4444', 
                      fontSize: '16px',
                      transform: isCurrentSlide ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                      animation: trainData.power ? 'pulse 2s ease-in-out infinite' : 'none'
                    }}>
                      {trainData.power ? '🟢' : '🔴'}
                    </div>
                    <div style={{
                      color: trainData.wifi ? '#10b981' : '#ef4444', 
                      fontSize: '16px',
                      transform: isCurrentSlide ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                      animation: trainData.wifi ? 'pulse 2s ease-in-out infinite' : 'none'
                    }}>
                      📶
                    </div>
                  </div>

                  {/* Operational Hours with Enhanced Styling */}
                  <div style={{marginBottom: '12px', position: 'relative', zIndex: 2}}>
                    <div style={{
                      fontSize: '10px', 
                      color: '#94a3b8', 
                      marginBottom: '4px',
                      fontWeight: '600'
                    }}>
                      Hours of Operation
                    </div>
                    <div style={{
                      background: trainData.exceeded ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #374151, #4b5563)',
                      padding: '8px',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transform: isCurrentSlide ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                      boxShadow: isCurrentSlide ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <span style={{fontSize: '10px', fontWeight: '600'}}>
                        {trainData.currentHours}h / {trainData.maxHours}h
                      </span>
                      <div style={{
                        background: trainData.exceeded ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        transform: isCurrentSlide ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.3s ease'
                      }}>
                        {trainData.exceeded ? '3!' : `${Math.round((trainData.currentHours / trainData.maxHours) * 100)}%`}
                      </div>
                    </div>
                  </div>

                  {/* Current Speed with Enhanced Animation */}
                  <div style={{
                    marginBottom: '12px', 
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    <div style={{
                      fontSize: isCurrentSlide ? '24px' : '20px',
                      fontWeight: 'bold',
                      color: trainData.speed > 0 ? '#10b981' : '#3b82f6',
                      transform: isCurrentSlide ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                      textShadow: isCurrentSlide ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none'
                    }}>
                      {trainData.speed} Km/h
                    </div>
                  </div>

                  {/* Last Updated with Enhanced Styling */}
                  <div style={{
                    fontSize: '9px', 
                    color: '#94a3b8', 
                    marginBottom: '12px', 
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 2,
                    fontWeight: '500'
                  }}>
                    🕐 {trainData.lastUpdated}
                  </div>

                  {/* Action Button with Enhanced Animation */}
                  <button style={{
                    width: '100%',
                    padding: '8px',
                    background: isCurrentSlide ? 
                      `linear-gradient(135deg, ${getStatusColor(trainData.status)}, ${getStatusColor(trainData.status)}dd)` : 
                      getStatusColor(trainData.status),
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    position: 'relative',
                    zIndex: 2,
                    transform: isCurrentSlide ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    boxShadow: isCurrentSlide ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)'
                    e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = isCurrentSlide ? 'scale(1.05)' : 'scale(1)'
                    e.target.style.boxShadow = isCurrentSlide ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  >
                    {getStatusIcon(trainData.status)}
                    {trainData.status === 'battery' ? 'Battery' : 
                     trainData.status === 'alert' ? 'Alert' : 
                     trainData.status === 'maintenance' ? 'Maintenance' : 'Control'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{gridColumn: 'span 12', textAlign: 'center', marginTop: '20px', color: '#94a3b8', fontSize: '12px'}}>
        © 2024 RailSarthiAi | Digital Railway Services All rights reserved.
      </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 8px 20px rgba(251, 191, 36, 0.4);
            transform: scale(1.1) rotate(2deg);
          }
          50% { 
            box-shadow: 0 12px 30px rgba(251, 191, 36, 0.6);
            transform: scale(1.15) rotate(3deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.1);
          }
        }
        
        @keyframes slide-rotate {
          0% { 
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          25% { 
            transform: translateX(-25%) scale(0.95);
            opacity: 0.8;
          }
          50% { 
            transform: translateX(-50%) scale(0.9);
            opacity: 0.6;
          }
          75% { 
            transform: translateX(-75%) scale(0.95);
            opacity: 0.8;
          }
          100% { 
            transform: translateX(-100%) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .slide-enter {
          animation: slide-rotate 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .slide-exit {
          animation: slide-rotate 0.8s cubic-bezier(0.4, 0, 0.2, 1) reverse forwards;
        }
        
        .train-card {
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, opacity;
        }
        
        .train-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        .current-slide {
          z-index: 10;
          transform: scale(1.05);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        
        .slide-transition {
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  )
}