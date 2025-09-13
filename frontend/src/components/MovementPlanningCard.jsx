import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Zap, Target, Shield, ArrowRight, Activity, Cpu, Network } from 'lucide-react';

const MovementPlanningCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [slidePosition, setSlidePosition] = useState(0);
  const animationRef = useRef();

  useEffect(() => {
    setIsVisible(true);
    
    // Continuous slide animation
    const animateSlide = () => {
      setSlidePosition(prev => (prev + 0.5) % 100);
      animationRef.current = requestAnimationFrame(animateSlide);
    };
    
    animationRef.current = requestAnimationFrame(animateSlide);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: Target,
      text: "Resolving meets and passes based on business goals",
      delay: 0,
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Shield,
      text: "Suggesting maintenance to avoid disruptions",
      delay: 100,
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      text: "Getting your network back on track after an unplanned event",
      delay: 200,
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: CheckCircle,
      text: "Optimizing your network based on your goals",
      delay: 300,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 shadow-2xl border border-blue-500/20 group">
      {/* Animated Slide Background */}
      <div className="absolute inset-0 opacity-20">
        {/* Moving Railway Tracks */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateX(${slidePosition}%)`,
            transition: 'transform 0.1s linear'
          }}
        >
          <svg width="200%" height="100%" viewBox="0 0 1600 400" className="absolute inset-0">
            <defs>
              <pattern id="railway-tracks" width="200" height="40" patternUnits="userSpaceOnUse">
                <rect width="200" height="40" fill="none" />
                {/* Railway tracks */}
                <line x1="0" y1="20" x2="200" y2="20" stroke="#3b82f6" strokeWidth="3" opacity="0.6"/>
                <line x1="0" y1="25" x2="200" y2="25" stroke="#3b82f6" strokeWidth="1" opacity="0.4"/>
                <line x1="0" y1="15" x2="200" y2="15" stroke="#3b82f6" strokeWidth="1" opacity="0.4"/>
                {/* Sleepers */}
                {[...Array(20)].map((_, i) => (
                  <rect key={i} x={i * 10} y="12" width="2" height="16" fill="#3b82f6" opacity="0.3"/>
                ))}
              </pattern>
              
              <linearGradient id="train-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6"/>
                <stop offset="50%" stopColor="#10b981"/>
                <stop offset="100%" stopColor="#3b82f6"/>
              </linearGradient>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#railway-tracks)" />
            
            {/* Moving Trains */}
            {[...Array(3)].map((_, i) => (
              <g key={i}>
                <rect
                  x={50 + i * 400}
                  y="10"
                  width="80"
                  height="20"
                  fill="url(#train-gradient)"
                  rx="4"
                  className="animate-pulse"
                  style={{
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '3s'
                  }}
                />
                <circle cx={60 + i * 400} cy="30" r="6" fill="#1f2937" opacity="0.8"/>
                <circle cx={120 + i * 400} cy="30" r="6" fill="#1f2937" opacity="0.8"/>
                <rect x={55 + i * 400} y="5" width="70" height="8" fill="#1e40af" rx="2"/>
              </g>
            ))}
          </svg>
        </div>

        {/* Floating Data Packets */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + Math.sin(i) * 30}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + i * 0.2}s`
              }}
            />
          ))}
        </div>

        {/* Network Connection Lines */}
        <svg width="100%" height="100%" className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <line
              key={i}
              x1={`${20 + i * 15}%`}
              y1="30%"
              x2={`${30 + i * 10}%`}
              y2="70%"
              stroke="#3b82f6"
              strokeWidth="2"
              opacity="0.3"
              className="animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </svg>

        {/* Floating Icons */}
        <div className="absolute inset-0">
          {[Activity, Cpu, Network, Zap].map((Icon, i) => (
            <div
              key={i}
              className="absolute text-blue-400/30 animate-float"
              style={{
                left: `${15 + i * 20}%`,
                top: `${25 + Math.sin(i) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '4s'
              }}
            >
              <Icon size={24} />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header with Enhanced Animation */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl backdrop-blur-sm border border-blue-400/30 group-hover:scale-110 transition-all duration-500">
              <Zap className="w-7 h-7 text-blue-400 animate-pulse" />
            </div>
            <h3 className={`text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{
                  backgroundSize: '200% 100%',
                  animation: isVisible ? 'gradient-shift 3s ease-in-out infinite' : 'none'
                }}>
              Real-time Movement Planning
            </h3>
          </div>
          
          <p className={`text-slate-300 text-lg leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            True dispatch by exception takes the pressure off you by leveraging advanced AI algorithms 
            and predictive analytics to optimize your operations automatically.
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 hover:border-blue-400/50 transition-all duration-500 cursor-pointer overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ 
                  transitionDelay: `${feature.delay + 400}ms`,
                  transform: hoveredItem === index ? 'translateY(-4px) scale(1.02)' : ''
                }}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{
                       backgroundSize: '200% 100%',
                       animation: hoveredItem === index ? 'border-flow 2s linear infinite' : 'none'
                     }} />
                <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90" />
                
                <div className="relative flex items-start gap-4">
                  <div className={`flex-shrink-0 p-3 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg group-hover:shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium leading-relaxed group-hover:text-white transition-colors duration-300">
                      {feature.text}
                    </p>
                    
                    {/* Enhanced Progress bar animation */}
                    <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${feature.color} rounded-full transition-all duration-700 ease-out`}
                        style={{
                          width: hoveredItem === index ? '100%' : '0%'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Arrow indicator */}
                  <ArrowRight 
                    className={`w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-all duration-300 ${hoveredItem === index ? 'translate-x-1' : ''}`} 
                  />
                </div>

                {/* Enhanced Floating particles on hover */}
                {hoveredItem === index && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-2 h-2 bg-gradient-to-r ${feature.color} rounded-full animate-ping`}
                        style={{
                          left: `${10 + i * 8}%`,
                          top: `${20 + (i % 3) * 30}%`,
                          animationDelay: `${i * 50}ms`,
                          animationDuration: '1.5s'
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Sliding highlight effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{
                       transform: hoveredItem === index ? 'translateX(100%)' : 'translateX(-100%)',
                       transition: 'transform 0.8s ease-in-out'
                     }} />
              </div>
            );
          })}
        </div>

        {/* Enhanced Bottom Action Bar */}
        <div className={`mt-8 p-6 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-slate-300 text-sm font-medium">System Status: Active & Optimizing</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span>Real-time Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes border-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MovementPlanningCard;
