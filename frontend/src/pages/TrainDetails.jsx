import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''

export default function TrainDetails() {
  const [trains, setTrains] = useState([])
  const [selectedTrain, setSelectedTrain] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState('trainNumber')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        setIsLoading(true)
        let trainData = null
        
        if (API) {
          try {
        const response = await axios.get(`${API}/api/trains`)
            trainData = response.data
          } catch (error) {
            console.log('API not available, using mock data')
            trainData = generateMockTrains()
          }
        } else {
          trainData = generateMockTrains()
        }
        
        setTrains(trainData)
        setIsVisible(true)
      } catch (error) {
        console.error('Error fetching trains:', error)
        setTrains(generateMockTrains())
        setIsVisible(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTrains()
  }, [])

  // Generate mock train data when API is not available
  const generateMockTrains = () => {
    const trainTypes = ['Express', 'Passenger', 'Freight', 'Superfast', 'Rajdhani', 'Shatabdi']
    const origins = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad']
    const destinations = ['Jaipur', 'Lucknow', 'Patna', 'Bhubaneswar', 'Kochi', 'Goa', 'Varanasi', 'Amritsar']
    const statuses = ['On Time', 'Delayed', 'Maintenance', 'Cancelled', 'Boarding']
    const priorities = ['High', 'Medium', 'Low']
    const weathers = ['Clear', 'Rainy', 'Foggy', 'Stormy', 'Snowy']
    const disruptions = ['None', 'Track Maintenance', 'Signal Failure', 'Weather', 'Accident']
    
    return Array.from({ length: 500 }, (_, index) => ({
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

  // Enhanced search and filtering with useMemo for performance
  const filteredAndSortedTrains = useMemo(() => {
    let filtered = trains.filter(train => {
      const matchesSearch = !searchTerm || 
    train.TrainNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    train.TrainName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    train.Origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    train.Destination?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = filterType === 'all' || train.Type?.toLowerCase() === filterType.toLowerCase()
      const matchesStatus = filterStatus === 'all' || train.TrackStatus?.toLowerCase() === filterStatus.toLowerCase()
      
      return matchesSearch && matchesType && matchesStatus
    })

    // Sorting logic
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'trainNumber':
          aValue = a.TrainNumber || ''
          bValue = b.TrainNumber || ''
          break
        case 'type':
          aValue = a.Type || ''
          bValue = b.Type || ''
          break
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }
          aValue = priorityOrder[a.Priority] || 0
          bValue = priorityOrder[b.Priority] || 0
          break
        case 'status':
          aValue = a.TrackStatus || ''
          bValue = b.TrackStatus || ''
          break
        case 'origin':
          aValue = a.Origin || ''
          bValue = b.Origin || ''
          break
        case 'destination':
          aValue = a.Destination || ''
          bValue = b.Destination || ''
          break
        case 'speed':
          aValue = a.Speed || 0
          bValue = b.Speed || 0
          break
        case 'delay':
          aValue = a.Delay || 0
          bValue = b.Delay || 0
          break
        default:
          aValue = a.TrainNumber || ''
          bValue = b.TrainNumber || ''
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }
    })
    
    return filtered
  }, [trains, searchTerm, sortBy, sortOrder, filterType, filterStatus])

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'on time': return '#10b981'
      case 'delayed': return '#f59e0b'
      case 'cancelled': return '#ef4444'
      case 'maintenance': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <>
    <div className="grid">
      {/* Loading State with Animation */}
      {isLoading && (
        <div style={{
          gridColumn: 'span 12', 
          textAlign: 'center', 
          padding: '60px',
          background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
          borderRadius: '16px',
          color: 'white',
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: '48px', 
            marginBottom: '20px',
            animation: 'pulse 2s ease-in-out infinite'
          }}>🚂</div>
          <div style={{fontSize: '20px', marginBottom: '10px', fontWeight: '600'}}>Loading Train Data...</div>
          <div style={{fontSize: '14px', opacity: '0.8'}}>Please wait while we fetch the latest information</div>
        </div>
      )}

      {/* Enhanced Search and Filter */}
      <div className="card" style={{
        gridColumn:'span 12',
        background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
        border: '1px solid #cbd5e1',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '8px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '20px'
          }}>🚂</div>
          <h3 style={{
            fontSize: '28px', 
            fontWeight: '700', 
            margin: 0,
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Train Search & Filter
        </h3>
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px'}}>
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151'}}>
              Search Trains
            </label>
          <input
            type="text"
              placeholder="Train number, name, origin, destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                background: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6'
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
          
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151'}}>
              Train Type
            </label>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Types</option>
              <option value="express">Express</option>
              <option value="passenger">Passenger</option>
              <option value="freight">Freight</option>
              <option value="superfast">Superfast</option>
              <option value="rajdhani">Rajdhani</option>
              <option value="shatabdi">Shatabdi</option>
            </select>
          </div>
          
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151'}}>
              Status
            </label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Status</option>
              <option value="on time">On Time</option>
              <option value="delayed">Delayed</option>
              <option value="maintenance">Maintenance</option>
              <option value="cancelled">Cancelled</option>
              <option value="boarding">Boarding</option>
          </select>
          </div>
          
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151'}}>
              Sort By
            </label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="trainNumber">Train Number</option>
              <option value="type">Type</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="origin">Origin</option>
              <option value="destination">Destination</option>
              <option value="speed">Speed</option>
              <option value="delay">Delay</option>
          </select>
          </div>
          
          <div>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151'}}>
              Order
            </label>
            <div style={{display: 'flex', gap: '8px'}}>
              <button
                onClick={() => setSortOrder('asc')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: sortOrder === 'asc' ? '#3b82f6' : 'white',
                  color: sortOrder === 'asc' ? 'white' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                ↑ Ascending
              </button>
              <button
                onClick={() => setSortOrder('desc')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: sortOrder === 'desc' ? '#3b82f6' : 'white',
                  color: sortOrder === 'desc' ? 'white' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                ↓ Descending
              </button>
            </div>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <div style={{fontSize: '16px', fontWeight: '600', color: '#1e40af'}}>
            Showing {filteredAndSortedTrains.length} of {trains.length} trains
          </div>
          <div style={{fontSize: '14px', color: '#64748b'}}>
            {searchTerm && `Search: "${searchTerm}"`}
            {filterType !== 'all' && ` • Type: ${filterType}`}
            {filterStatus !== 'all' && ` • Status: ${filterStatus}`}
          </div>
        </div>
      </div>

      {/* Enhanced Train List */}
      <div className="card" style={{
        gridColumn:'span 12',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out 0.2s'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '8px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '20px'
          }}>🚂</div>
          <h3 style={{
            fontSize: '28px', 
            fontWeight: '700', 
            margin: 0,
            background: 'linear-gradient(135deg, #059669, #10b981)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Train Details ({filteredAndSortedTrains.length} trains)
        </h3>
        </div>
        
        <div style={{overflowX: 'auto', borderRadius: '12px', border: '1px solid #e5e7eb'}}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'white'
          }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                borderBottom: '2px solid #cbd5e1'
              }}>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                  borderRight: '1px solid #e5e7eb'
                }}>Train</th>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                  borderRight: '1px solid #e5e7eb'
                }}>Type</th>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                  borderRight: '1px solid #e5e7eb'
                }}>Priority</th>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                  borderRight: '1px solid #e5e7eb'
                }}>Route</th>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                  borderRight: '1px solid #e5e7eb'
                }}>Status</th>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                  borderRight: '1px solid #e5e7eb'
                }}>Speed</th>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                  borderRight: '1px solid #e5e7eb'
                }}>Signal</th>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                  borderRight: '1px solid #e5e7eb'
                }}>Weather</th>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                  borderRight: '1px solid #e5e7eb'
                }}>Disruption</th>
                <th style={{
                  padding: '16px 12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTrains.slice(0, 50).map((train, i) => (
                <tr 
                  key={i} 
                  style={{
                  cursor: 'pointer',
                    background: selectedTrain === train.TrainNumber ? 'linear-gradient(135deg, #dbeafe, #bfdbfe)' : 'transparent',
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'all 0.3s ease',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                    animationDelay: `${i * 0.05}s`
                  }} 
                  onClick={() => setSelectedTrain(train.TrainNumber)}
                  onMouseEnter={(e) => {
                    if (selectedTrain !== train.TrainNumber) {
                      e.target.style.background = 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
                      e.target.style.transform = 'translateX(4px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTrain !== train.TrainNumber) {
                      e.target.style.background = 'transparent'
                      e.target.style.transform = 'translateX(0)'
                    }
                  }}
                >
                  <td style={{padding: '16px 12px', borderRight: '1px solid #f1f5f9'}}>
                    <div style={{fontWeight: 'bold', fontSize: '16px', color: '#1e40af'}}>{train.TrainNumber}</div>
                    <div style={{fontSize: '12px', color: '#64748b'}}>{train.TrainName}</div>
                  </td>
                  <td style={{padding: '16px 12px', borderRight: '1px solid #f1f5f9'}}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: 'linear-gradient(135deg, #e5e7eb, #d1d5db)',
                      color: '#374151',
                      display: 'inline-block'
                    }}>
                      {train.Type}
                    </span>
                  </td>
                  <td style={{padding: '16px 12px', borderRight: '1px solid #f1f5f9'}}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: getPriorityColor(train.Priority),
                      color: 'white',
                      display: 'inline-block'
                    }}>
                      {train.Priority}
                    </span>
                  </td>
                  <td style={{padding: '16px 12px', borderRight: '1px solid #f1f5f9'}}>
                    <div style={{fontSize: '14px', fontWeight: '500'}}>
                      {train.Origin} → {train.Destination}
                    </div>
                  </td>
                  <td style={{padding: '16px 12px', borderRight: '1px solid #f1f5f9'}}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: getStatusColor(train.TrackStatus),
                      color: 'white',
                      display: 'inline-block'
                    }}>
                      {train.TrackStatus}
                    </span>
                  </td>
                  <td style={{padding: '16px 12px', borderRight: '1px solid #f1f5f9'}}>
                    <div style={{fontSize: '14px', fontWeight: '600', color: '#059669'}}>
                      {train.Speed} km/h
                    </div>
                    {train.Delay > 0 && (
                      <div style={{fontSize: '12px', color: '#f59e0b'}}>
                        +{train.Delay} min delay
                      </div>
                    )}
                  </td>
                  <td style={{padding: '16px 12px', borderRight: '1px solid #f1f5f9'}}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: train.SignalState === 'Green' ? '#10b981' : 
                                 train.SignalState === 'Red' ? '#ef4444' : '#f59e0b',
                      color: 'white',
                      display: 'inline-block'
                    }}>
                      {train.SignalState}
                    </span>
                  </td>
                  <td style={{padding: '16px 12px', borderRight: '1px solid #f1f5f9'}}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: '#dbeafe',
                      color: '#1e40af',
                      display: 'inline-block'
                    }}>
                      {train.Weather}
                    </span>
                  </td>
                  <td style={{padding: '16px 12px', borderRight: '1px solid #f1f5f9'}}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: train.Disruption === 'None' ? '#dcfce7' : '#fef2f2',
                      color: train.Disruption === 'None' ? '#166534' : '#dc2626',
                      display: 'inline-block'
                    }}>
                      {train.Disruption}
                    </span>
                  </td>
                  <td style={{padding: '16px 12px'}}>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button style={{
                        padding: '8px 16px',
                      fontSize: '12px',
                        fontWeight: '600',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = 'none'
                      }}
                      >
                      View
                    </button>
                      <button style={{
                        padding: '8px 16px',
                      fontSize: '12px',
                        fontWeight: '600',
                        background: 'linear-gradient(135deg, #f97316, #fb923c)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = 'none'
                      }}
                      >
                      Control
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Selected Train Details */}
      {selectedTrain && (
        <div className="card" style={{
          gridColumn:'span 12',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out 0.4s',
          background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
          border: '2px solid #3b82f6',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '20px'
        }}>
          {(() => {
            const train = trains.find(t => t.TrainNumber === selectedTrain)
            if (!train) return null
            
            return (
                <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    padding: '8px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '20px'
                  }}>🚂</div>
                  <h3 style={{
                    fontSize: '28px', 
                    fontWeight: '700', 
                    margin: 0,
                    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Train Details: {selectedTrain}
                  </h3>
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '16px',
                      color: '#1e40af',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      📋 Basic Information
                    </h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9'}}>
                        <span style={{fontWeight: '600', color: '#374151'}}>Train Number:</span>
                        <span style={{color: '#1e40af', fontWeight: '600'}}>{train.TrainNumber}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9'}}>
                        <span style={{fontWeight: '600', color: '#374151'}}>Train Name:</span>
                        <span style={{color: '#64748b'}}>{train.TrainName}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9'}}>
                        <span style={{fontWeight: '600', color: '#374151'}}>Type:</span>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          background: '#e5e7eb',
                          color: '#374151',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>{train.Type}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9'}}>
                        <span style={{fontWeight: '600', color: '#374151'}}>Priority:</span>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          background: getPriorityColor(train.Priority),
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>{train.Priority}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0'}}>
                        <span style={{fontWeight: '600', color: '#374151'}}>Route:</span>
                        <span style={{color: '#059669', fontWeight: '600'}}>{train.Origin} → {train.Destination}</span>
                      </div>
                  </div>
                </div>
                
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '16px',
                      color: '#1e40af',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      📊 Current Status
                    </h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9'}}>
                        <span style={{fontWeight: '600', color: '#374151'}}>Track Status:</span>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          background: getStatusColor(train.TrackStatus),
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>{train.TrackStatus}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9'}}>
                        <span style={{fontWeight: '600', color: '#374151'}}>Signal State:</span>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          background: train.SignalState === 'Green' ? '#10b981' : 
                                     train.SignalState === 'Red' ? '#ef4444' : '#f59e0b',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>{train.SignalState}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9'}}>
                        <span style={{fontWeight: '600', color: '#374151'}}>Speed:</span>
                        <span style={{color: '#059669', fontWeight: '600'}}>{train.Speed} km/h</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9'}}>
                        <span style={{fontWeight: '600', color: '#374151'}}>Weather:</span>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          background: '#dbeafe',
                          color: '#1e40af',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>{train.Weather}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0'}}>
                        <span style={{fontWeight: '600', color: '#374151'}}>Disruption:</span>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          background: train.Disruption === 'None' ? '#dcfce7' : '#fef2f2',
                          color: train.Disruption === 'None' ? '#166534' : '#dc2626',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>{train.Disruption}</span>
                      </div>
                  </div>
                </div>
                
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '16px',
                      color: '#1e40af',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      ⚡ Actions
                    </h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    <button style={{
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = 'none'
                      }}
                      >
                      🚦 Control Signals
                    </button>
                    <button style={{
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = 'none'
                      }}
                      >
                      🚉 Platform Assignment
                    </button>
                    <button style={{
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = 'none'
                      }}
                      >
                      ⚠️ Report Issue
                    </button>
                    <button style={{
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)'
                        e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = 'none'
                      }}
                      >
                      🚨 Emergency Stop
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

    </div>
    
    {/* CSS Animations */}
    <style jsx>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
      }
      
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      .animate-slide-in {
        animation: slideInUp 0.6s ease-out forwards;
      }
      
      .animate-slide-left {
        animation: slideInLeft 0.6s ease-out forwards;
      }
    `}</style>
    </>
  )
}
