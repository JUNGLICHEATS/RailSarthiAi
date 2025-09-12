import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [trainsResponse, kpisResponse] = await Promise.all([
          axios.get(`${API}/api/trains`),
          axios.get(`${API}/api/kpis`)
        ])
        setTrains(trainsResponse.data)
        setKpis(kpisResponse.data)
        
        // Initialize random speeds for all trains
        const initialSpeeds = {}
        trainsResponse.data.forEach((train, index) => {
          initialSpeeds[train.TrainNumber] = Math.floor(Math.random() * 50)
        })
        setSpeeds(initialSpeeds)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

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

      {/* Train Grid - Full Screen */}
      {!isLoading && (
        <div className="hidden-scrollbar" style={{
          gridColumn: 'span 12',
          height: 'calc(100vh - 200px)',
          overflowY: 'auto',
          paddingRight: '8px'
        }}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px'}}>
            {trains.map((train, index) => {
              const trainData = getTrainData(train, index)
              return (
                <div 
                  key={index}
                  className="card animate-slide-in"
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'white',
                    cursor: 'pointer',
                    border: selectedTrain === trainData.id ? '2px solid #10b981' : '1px solid #475569',
                    boxShadow: selectedTrain === trainData.id ? '0 8px 25px rgba(16,185,129,0.3)' : '0 4px 6px -1px rgba(0,0,0,0.1)',
                    transform: selectedTrain === trainData.id ? 'translateY(-4px)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    animationDelay: `${index * 0.1}s`,
                    minHeight: '280px'
                  }}
                  onClick={() => setSelectedTrain(trainData.id)}
                >
                  {/* Train Number Header */}
                  <div style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    textAlign: 'center'
                  }}>
                    {trainData.trainNumber}
                  </div>

                  {/* Train Type Image */}
                  <div style={{
                    width: '100%',
                    height: '60px',
                    background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px'
                  }}>
                    {getTrainTypeImage(trainData.type)}
                  </div>

                  {/* Status Icons */}
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                    <div style={{color: trainData.power ? '#10b981' : '#ef4444', fontSize: '16px'}}>
                      {trainData.power ? '🟢' : '🔴'}
                    </div>
                    <div style={{color: trainData.wifi ? '#10b981' : '#ef4444', fontSize: '16px'}}>
                      📶
                    </div>
                  </div>

                  {/* Operational Hours */}
                  <div style={{marginBottom: '12px'}}>
                    <div style={{fontSize: '10px', color: '#94a3b8', marginBottom: '4px'}}>
                      Hours of Operation
                    </div>
                    <div style={{
                      background: trainData.exceeded ? '#ef4444' : '#374151',
                      padding: '6px',
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{fontSize: '10px'}}>
                        {trainData.currentHours}h / {trainData.maxHours}h
                      </span>
                      <div style={{
                        background: trainData.exceeded ? '#ef4444' : '#3b82f6',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        {trainData.exceeded ? '3!' : `${Math.round((trainData.currentHours / trainData.maxHours) * 100)}%`}
                      </div>
                    </div>
                  </div>

                  {/* Current Speed */}
                  <div style={{marginBottom: '12px', textAlign: 'center'}}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: trainData.speed > 0 ? '#10b981' : '#3b82f6'
                    }}>
                      {trainData.speed} Km/h
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div style={{fontSize: '9px', color: '#94a3b8', marginBottom: '12px', textAlign: 'center'}}>
                    🕐 {trainData.lastUpdated}
                  </div>

                  {/* Action Button */}
                  <button style={{
                    width: '100%',
                    padding: '6px',
                    background: getStatusColor(trainData.status),
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}>
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
    </>
  )
}