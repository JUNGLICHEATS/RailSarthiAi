import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''

export default function Dashboard(){
  const [kpis, setKpis] = useState(null)
  const [trains, setTrains] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Carousel slides data
  const slides = [
    {
      title: "Industry's most intuitive train graph",
      features: [
        "View train routes with accurate downstream ETAs.",
        "Drag and drop string lines to resolve meet-and-pass conflicts.",
        "Find and reserve maintenance work windows.",
        "See speed restrictions and tracks out of service.",
        "Collaborate and talk to other users in real time."
      ],
      image: "/railwayrule2.jpg",
      backgroundImage: "/train-graph-background.svg"
    },
    {
      title: "Advanced AI-Powered Analytics",
      features: [
        "Machine learning algorithms predict delays before they happen.",
        "Real-time performance monitoring and alerting.",
        "Automated conflict resolution suggestions.",
        "Historical data analysis for trend identification.",
        "Predictive maintenance scheduling optimization."
      ],
      image: "/trainrule1.webp",
      backgroundImage: "/ai-analytics-background.svg"
    },
    {
      title: "Smart Route Optimization",
      features: [
        "Dynamic routing based on real-time conditions.",
        "Multi-objective optimization for efficiency and safety.",
        "Weather and traffic pattern integration.",
        "Fuel consumption optimization algorithms.",
        "Emergency rerouting capabilities."
      ],
      image: "/images (3).jpg",
      backgroundImage: "/route-optimization-background.svg"
    },
    {
      title: "Integrated Communication Hub",
      features: [
        "Real-time messaging between dispatchers and operators.",
        "Automated incident reporting and tracking.",
        "Multi-language support for diverse teams.",
        "Voice-to-text integration for hands-free operation.",
        "Emergency broadcast system for critical alerts."
      ],
      image: "/images (4).jpg",
      backgroundImage: "/communication-hub-background.svg"
    },
    {
      title: "Comprehensive Safety Management",
      features: [
        "Automated safety protocol enforcement.",
        "Real-time risk assessment and mitigation.",
        "Integration with safety equipment and sensors.",
        "Compliance monitoring and reporting.",
        "Emergency response coordination tools."
      ],
      image: "/railwayrule3.jpg",
      backgroundImage: "/safety-management-background.svg"
    }
  ]

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

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }
          @keyframes slideRight {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(5px); }
          }
        `}
      </style>
    <div className="grid" style={{
      background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(226, 232, 240, 0.95) 100%), url("https://www.neweb.info/wp-content/uploads/2023/01/10-REXDATA-Rail-Software-Digital-Locomotor.jpg") center/cover',
      backgroundAttachment: 'fixed',
      minHeight: '100vh'
    }}>
       {/* Animated Carousel Section */}
       <div className="card" style={{gridColumn:'span 12', padding: 0, overflow: 'hidden', position: 'relative'}}>
        <div style={{
          position: 'relative',
          height: '400px',
          overflow: 'hidden'
        }}>
          {/* Slides Container */}
          <div style={{
            display: 'flex',
            width: `${slides.length * 100}%`,
            height: '100%',
            transform: `translateX(-${currentSlide * (100 / slides.length)}%)`,
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            {slides.map((slide, index) => (
              <div
                key={index}
                style={{
                  width: `${100 / slides.length}%`,
                  backgroundImage: `url(${slide.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  color: 'white',
                  padding: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '100%',
                  position: 'relative'
                }}
              >
                {/* Dark overlay for better text readability */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1
                }}></div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', width: '100%', position: 'relative', zIndex: 2}}>
                  <div style={{
                    opacity: currentSlide === index ? 1 : 0.7,
                    transform: currentSlide === index ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease'
                  }}>
            <h2 style={{fontSize: '32px', fontWeight: '700', marginBottom: '20px'}}>
                      {slide.title}
            </h2>
            <ul style={{listStyle: 'none', padding: 0, fontSize: '16px', lineHeight: '1.6'}}>
                      {slide.features.map((feature, featureIndex) => (
                        <li 
                          key={featureIndex}
                          style={{
                            marginBottom: '12px', 
                            display: 'flex', 
                            alignItems: 'center',
                            opacity: currentSlide === index ? 1 : 0.8,
                            transform: currentSlide === index ? 'translateX(0)' : 'translateX(-10px)',
                            transition: `all 0.6s ease ${featureIndex * 0.1}s`
                          }}
                        >
                <span style={{marginRight: '12px', fontSize: '20px'}}>•</span>
                          {feature}
              </li>
                      ))}
            </ul>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{
                      width: '400px',
                      height: '280px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed rgba(255,255,255,0.3)',
                      margin: '0 auto',
                      opacity: currentSlide === index ? 1 : 0.7,
                      transform: currentSlide === index ? 'scale(1)' : 'scale(0.95)',
                      transition: 'all 0.6s ease'
                    }}>
                      <img
                        src={slide.image}
                        alt={`${slide.title} illustration`}
                        style={{ 
                          width: 'auto', 
                          height: 'auto', 
                          maxWidth: '380px',
                          maxHeight: '260px',
                          borderRadius: '12px',
                          objectFit: 'cover'
                        }}
  />
</div>
</div>
            </div>
          </div>
            ))}
          </div>
        </div>
        
        {/* Slide Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 10
        }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Train Window Solutions Banner */}
      <div className="card" style={{gridColumn:'span 12', padding:0, background: 'transparent'}}>
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          borderRadius: '20px',
          padding: '40px',
          margin: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          border: '3px solid #34495e'
        }}>
          {/* Train Window Frame */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '20px',
            border: '8px solid #2c3e50',
            borderRadius: '15px',
            background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(41, 128, 185, 0.1) 100%)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
            zIndex: 1
          }}>
            {/* Window Glass Effect */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              right: '10px',
              bottom: '10px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              borderRadius: '10px',
              backdropFilter: 'blur(1px)',
              zIndex: 2
            }}></div>
            
            {/* Window Cross Frame */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '10px',
              right: '10px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, #34495e 20%, #34495e 80%, transparent 100%)',
              zIndex: 3
            }}></div>
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '10px',
              bottom: '10px',
              width: '2px',
              background: 'linear-gradient(180deg, transparent 0%, #34495e 20%, #34495e 80%, transparent 100%)',
              zIndex: 3
            }}></div>
          </div>
          
          {/* Content */}
          <div style={{position: 'relative', zIndex: 4}}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#ecf0f1',
              textAlign: 'center',
              marginBottom: '30px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontFamily: 'Arial, sans-serif'
            }}>
              🚂 Solutions for Railroads of All Sizes
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr auto 1fr',
              gap: '20px',
              alignItems: 'center',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              {/* Visibility Block */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.2) 0%, rgba(39, 174, 96, 0.2) 100%)',
                border: '2px solid #27ae60',
                borderRadius: '15px',
                padding: '25px',
                textAlign: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(46, 204, 113, 0.1) 0%, transparent 70%)',
                  animation: 'pulse 3s ease-in-out infinite'
                }}></div>
                <div style={{position: 'relative', zIndex: 1}}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#27ae60',
                    marginBottom: '12px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    👁️ Visibility
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#ecf0f1',
                    lineHeight: '1.5',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    See real-time train locations, train paths, and maintenance opportunities in an intuitive graphical interface.
                  </div>
                </div>
              </div>
              
              {/* Arrow 1 */}
              <div style={{
                fontSize: '24px',
                color: '#3498db',
                textAlign: 'center',
                animation: 'slideRight 2s ease-in-out infinite'
              }}>
                ➡️
              </div>
              
              {/* Decision Support Block */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.2) 0%, rgba(41, 128, 185, 0.2) 100%)',
                border: '2px solid #3498db',
                borderRadius: '15px',
                padding: '25px',
                textAlign: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(52, 152, 219, 0.1) 0%, transparent 70%)',
                  animation: 'pulse 3s ease-in-out infinite 1s'
                }}></div>
                <div style={{position: 'relative', zIndex: 1}}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#3498db',
                    marginBottom: '12px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    🧠 Decision Support
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#ecf0f1',
                    lineHeight: '1.5',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    Unlock new insights and opportunities with the help of actionable KPIs.
                  </div>
                </div>
              </div>
              
              {/* Arrow 2 */}
              <div style={{
                fontSize: '24px',
                color: '#e74c3c',
                textAlign: 'center',
                animation: 'slideRight 2s ease-in-out infinite 0.5s'
              }}>
                ➡️
              </div>
              
              {/* Optimization Block */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.2) 0%, rgba(192, 57, 43, 0.2) 100%)',
                border: '2px solid #e74c3c',
                borderRadius: '15px',
                padding: '25px',
                textAlign: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(231, 76, 60, 0.1) 0%, transparent 70%)',
                  animation: 'pulse 3s ease-in-out infinite 2s'
                }}></div>
                <div style={{position: 'relative', zIndex: 1}}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#e74c3c',
                    marginBottom: '12px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    ⚡ Optimization
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#ecf0f1',
                    lineHeight: '1.5',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    Resolve meets, passes, and maintenance activities in line with business objectives.
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Train Window Handle */}
          <div style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            width: '20px',
            height: '60px',
            background: 'linear-gradient(180deg, #95a5a6 0%, #7f8c8d 100%)',
            borderRadius: '10px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 5
          }}>
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '8px',
              height: '8px',
              background: '#34495e',
              borderRadius: '50%',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)'
            }}></div>
          </div>
        </div>
      </div>
   
 {/* Indian Railway Optimization Features */}
 <div className="card" style={{gridColumn:'span 12', padding: 0, overflow: 'hidden', position: 'relative'}}>
        <div style={{
          position: 'relative',
          backgroundImage: `url('/optimization-features-background.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '40px',
          borderRadius: '12px'
        }}>
          {/* Dark overlay for better text readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            zIndex: 1
          }}></div>
          <div style={{position: 'relative', zIndex: 2}}>
        <h3 style={{fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
          🚀 Our Advanced Optimization Algorithms Help You:
        </h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px'}}>
          <div className="animate-slide-in" style={{textAlign: 'center', padding: '20px'}}>
            <div style={{
              width: 'auto',
              height: 'auto',
            }}>
              <img src="/trainrule1.webp" alt="Train" style={{width:'200px',height:'200px', borderRadius: '12px' }}/>
            </div>
            <h4 style={{margin: '0 0 8px 0', color: '#ffffff', fontWeight: '600', textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
              Run more trains or schedule more maintenance.
            </h4>
          </div>
          
          <div className="animate-slide-in" style={{textAlign: 'center', padding: '20px', animationDelay: '0.1s'}}>
          <div style={{
              width: 'auto',
              height: 'auto',
            }}>
              <img src="/images (3).jpg" alt="Train" style={{width:'200px',height:'200px', borderRadius: '12px' }}/>
            </div>
            <h4 style={{margin: '0 0 8px 0', color: '#ffffff', fontWeight: '600', textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
              Change train meets and passes to improve schedule adherence.
            </h4>
          </div>
          
          <div className="animate-slide-in" style={{textAlign: 'center', padding: '20px', animationDelay: '0.2s'}}>
          <div style={{
              width: 'auto',
              height: 'auto',
            }}>
              <img src="/railwayrule2.jpg" alt="Train" style={{width:'200px',height:'200px', borderRadius: '12px' }}/>
            </div>
            <h4 style={{margin: '0 0 8px 0', color: '#ffffff', fontWeight: '600', textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
              Re-route traffic to reduce congestion and delay.
            </h4>
          </div>
          
          <div className="animate-slide-in" style={{textAlign: 'center', padding: '20px', animationDelay: '0.3s'}}>
          <div style={{
              width: 'auto',
              height: 'auto',
            }}>
              <img src="/images (4).jpg" alt="Train" style={{width:'200px',height:'200px', borderRadius: '12px' }}/>
            </div>
            <h4 style={{margin: '0 0 8px 0', color: '#ffffff', fontWeight: '600', textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
              Create multiple scenarios and compare KPIs to find the best plan.
            </h4>
          </div>
        </div>
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
    </>
  )
}