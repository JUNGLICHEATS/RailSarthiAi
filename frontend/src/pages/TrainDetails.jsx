import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''

export default function TrainDetails() {
  const [trains, setTrains] = useState([])
  const [selectedTrain, setSelectedTrain] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${API}/api/trains`)
        setTrains(response.data)
      } catch (error) {
        console.error('Error fetching trains:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTrains()
  }, [])

  const filteredTrains = trains.filter(train => 
    train.TrainNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    train.TrainName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    train.Origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    train.Destination?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
    <div className="grid">
    

      {/* Loading State */}
      {isLoading && (
        <div style={{gridColumn: 'span 12', textAlign: 'center', padding: '40px'}}>
          <div style={{fontSize: '24px', marginBottom: '16px'}}>🚂</div>
          <div style={{fontSize: '18px', color: '#666'}}>Loading train data...</div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="card" style={{gridColumn:'span 12'}}>
        <h3 style={{fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: 'var(--gov-blue)'}}>
          🚂 Train Search & Filter
        </h3>
        <div style={{display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px'}}>
          <input
            type="text"
            placeholder="Search trains by number, name, origin, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="professional-input"
            style={{flex: 1}}
          />
          <select className="professional-input" style={{width: '200px'}}>
            <option>All Types</option>
            <option>Express</option>
            <option>Passenger</option>
            <option>Freight</option>
          </select>
          <select className="professional-input" style={{width: '200px'}}>
            <option>All Status</option>
            <option>On Time</option>
            <option>Delayed</option>
            <option>Maintenance</option>
          </select>
        </div>
      </div>

      {/* Train List */}
      <div className="card" style={{gridColumn:'span 12'}}>
        <h3 style={{fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: 'var(--gov-blue)'}}>
          🚂 Train Details ({filteredTrains.length} trains)
        </h3>
        <div style={{overflowX: 'auto'}}>
          <table className="professional-table">
            <thead>
              <tr>
                <th>Train</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Route</th>
                <th>Status</th>
                <th>Track</th>
                <th>Signal</th>
                <th>Weather</th>
                <th>Disruption</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrains.slice(0, 50).map((train, i) => (
                <tr key={i} style={{
                  cursor: 'pointer',
                  background: selectedTrain === train.TrainNumber ? '#f0f9ff' : 'transparent'
                }} onClick={() => setSelectedTrain(train.TrainNumber)}>
                  <td>
                    <div style={{fontWeight: 'bold'}}>{train.TrainNumber}</div>
                    <div style={{fontSize: '12px', color: '#666'}}>{train.TrainName}</div>
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: '#e5e7eb',
                      color: '#374151'
                    }}>
                      {train.Type}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: getPriorityColor(train.Priority),
                      color: 'white'
                    }}>
                      {train.Priority}
                    </span>
                  </td>
                  <td>
                    <div style={{fontSize: '14px'}}>{train.Origin} → {train.Destination}</div>
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: getStatusColor(train.TrackStatus),
                      color: 'white'
                    }}>
                      {train.TrackStatus}
                    </span>
                  </td>
                  <td>{train.TrackStatus}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: train.SignalState === 'Green' ? '#10b981' : 
                                 train.SignalState === 'Red' ? '#ef4444' : '#f59e0b',
                      color: 'white'
                    }}>
                      {train.SignalState}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: '#dbeafe',
                      color: '#1e40af'
                    }}>
                      {train.Weather}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: train.Disruption === 'None' ? '#dcfce7' : '#fef2f2',
                      color: train.Disruption === 'None' ? '#166534' : '#dc2626'
                    }}>
                      {train.Disruption}
                    </span>
                  </td>
                  <td>
                    <button className="professional-button" style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      marginRight: '8px'
                    }}>
                      View
                    </button>
                    <button className="professional-button" style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      background: 'linear-gradient(135deg, #f97316, #fb923c)'
                    }}>
                      Control
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Train Details */}
      {selectedTrain && (
        <div className="card" style={{gridColumn:'span 12'}}>
          <h3>🚂 Train Details: {selectedTrain}</h3>
          {(() => {
            const train = trains.find(t => t.TrainNumber === selectedTrain)
            if (!train) return null
            
            return (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
                <div>
                  <h4>Basic Information</h4>
                  <div style={{background: '#f8f9fa', padding: '16px', borderRadius: '8px'}}>
                    <div style={{marginBottom: '8px'}}><strong>Train Number:</strong> {train.TrainNumber}</div>
                    <div style={{marginBottom: '8px'}}><strong>Train Name:</strong> {train.TrainName}</div>
                    <div style={{marginBottom: '8px'}}><strong>Type:</strong> {train.Type}</div>
                    <div style={{marginBottom: '8px'}}><strong>Priority:</strong> {train.Priority}</div>
                    <div style={{marginBottom: '8px'}}><strong>Route:</strong> {train.Origin} → {train.Destination}</div>
                  </div>
                </div>
                
                <div>
                  <h4>Current Status</h4>
                  <div style={{background: '#f8f9fa', padding: '16px', borderRadius: '8px'}}>
                    <div style={{marginBottom: '8px'}}><strong>Track Status:</strong> {train.TrackStatus}</div>
                    <div style={{marginBottom: '8px'}}><strong>Signal State:</strong> {train.SignalState}</div>
                    <div style={{marginBottom: '8px'}}><strong>Weather:</strong> {train.Weather}</div>
                    <div style={{marginBottom: '8px'}}><strong>Disruption:</strong> {train.Disruption}</div>
                    <div style={{marginBottom: '8px'}}><strong>Passenger Load:</strong> {train.PassengerLoad}</div>
                  </div>
                </div>
                
                <div>
                  <h4>Actions</h4>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                    <button style={{
                      padding: '12px',
                      background: '#0f9d58',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}>
                      🚦 Control Signals
                    </button>
                    <button style={{
                      padding: '12px',
                      background: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}>
                      🚉 Platform Assignment
                    </button>
                    <button style={{
                      padding: '12px',
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}>
                      ⚠️ Report Issue
                    </button>
                    <button style={{
                      padding: '12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}>
                      🚨 Emergency Stop
                    </button>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Statistics */}
      <div className="card" style={{gridColumn:'span 12'}}>
        <h3>📊 Train Statistics</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
          <div style={{padding: '16px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center'}}>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#0f9d58'}}>
              {trains.filter(t => t.TrackStatus === 'On Time').length}
            </div>
            <div style={{fontSize: '14px', color: '#666'}}>On Time</div>
          </div>
          <div style={{padding: '16px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center'}}>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#f59e0b'}}>
              {trains.filter(t => t.TrackStatus === 'Delayed').length}
            </div>
            <div style={{fontSize: '14px', color: '#666'}}>Delayed</div>
          </div>
          <div style={{padding: '16px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center'}}>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#ef4444'}}>
              {trains.filter(t => t.Disruption !== 'None').length}
            </div>
            <div style={{fontSize: '14px', color: '#666'}}>With Disruptions</div>
          </div>
          <div style={{padding: '16px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center'}}>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#1976d2'}}>
              {trains.length}
            </div>
            <div style={{fontSize: '14px', color: '#666'}}>Total Trains</div>
          </div>
        </div>
      </div>
    </div>
  )
}
