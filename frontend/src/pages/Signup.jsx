import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [captchaText, setCaptchaText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [isCaptchaValid, setIsCaptchaValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  // Generate random captcha text
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaText(result)
    setUserInput('')
    setIsCaptchaValid(false)
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleCaptchaChange = (e) => {
    const value = e.target.value
    setUserInput(value)
    setIsCaptchaValid(value.toLowerCase() === captchaText.toLowerCase())
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    
    if (!isCaptchaValid) {
      setMessage('Please complete the reCAPTCHA verification')
      generateCaptcha()
      return
    }

    if (!validateForm()) {
      setMessage('Please fix the errors below')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show OTP verification
      setShowOtp(true)
      setMessage('OTP sent to your email. Please check your inbox.')
    } catch (error) {
      setMessage('Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerification = async (e) => {
    e.preventDefault()
    
    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage('Account created successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      setMessage('Invalid OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    setMessage('Resending OTP...')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('OTP resent to your email')
    } catch (error) {
      setMessage('Failed to resend OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(30, 64, 175, 0.95) 100%), url("https://www.neweb.info/wp-content/uploads/2023/01/10-REXDATA-Rail-Software-Digital-Locomotor.jpg") center/cover',
      backgroundAttachment: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <style>
        {`
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
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          
          .signup-container {
            animation: slideInUp 0.6s ease-out;
          }
          
          .pulse-animation {
            animation: pulse 2s infinite;
          }
          
          .shake-animation {
            animation: shake 0.5s ease-in-out;
          }
        `}
      </style>

      <div className="signup-container" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '32px',
            boxShadow: '0 10px 25px rgba(249, 115, 22, 0.3)'
          }}>
            🚆
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 8px 0'
          }}>
            Create Account
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '16px',
            margin: 0
          }}>
            Join RailSarthiAi Dashboard
          </p>
        </div>

        {!showOtp ? (
          /* Signup Form */
          <form onSubmit={handleSignup}>
            {/* Name Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${errors.name ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  background: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = errors.name ? '#ef4444' : '#e5e7eb'}
              />
              {errors.name && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {errors.name}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${errors.email ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  background: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = errors.email ? '#ef4444' : '#e5e7eb'}
              />
              {errors.email && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Phone Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your 10-digit phone number"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${errors.phone ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  background: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = errors.phone ? '#ef4444' : '#e5e7eb'}
              />
              {errors.phone && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {errors.phone}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a strong password"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${errors.password ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  background: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = errors.password ? '#ef4444' : '#e5e7eb'}
              />
              {errors.password && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${errors.confirmPassword ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  background: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = errors.confirmPassword ? '#ef4444' : '#e5e7eb'}
              />
              {errors.confirmPassword && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Custom reCAPTCHA */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Security Verification
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#f8fafc',
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid #e5e7eb'
              }}>
                <div style={{
                  background: 'linear-gradient(45deg, #f97316, #ea580c)',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  letterSpacing: '2px',
                  fontFamily: 'monospace',
                  minWidth: '120px',
                  textAlign: 'center'
                }}>
                  {captchaText}
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  🔄
                </button>
                <input
                  type="text"
                  value={userInput}
                  onChange={handleCaptchaChange}
                  placeholder="Type the text above"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              {isCaptchaValid && (
                <div style={{
                  color: '#10b981',
                  fontSize: '12px',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  ✅ Verification successful
                </div>
              )}
            </div>

            {/* Message */}
            {message && (
              <div style={{
                background: message.includes('successful') ? '#d1fae5' : '#fee2e2',
                color: message.includes('successful') ? '#065f46' : '#991b1b',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {message}
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading || !isCaptchaValid}
              style={{
                width: '100%',
                background: isLoading || !isCaptchaValid 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #f97316, #ea580c)',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading || !isCaptchaValid ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading && isCaptchaValid) {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 20px rgba(249, 115, 22, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 15px rgba(249, 115, 22, 0.3)'
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Link */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                Already have an account?{' '}
                <Link to="/login" style={{
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}>
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        ) : (
          /* OTP Verification */
          <form onSubmit={handleOtpVerification}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '24px'
              }}>
                📧
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 8px 0'
              }}>
                Verify Your Email
              </h2>
              <p style={{
                color: '#64748b',
                fontSize: '14px',
                margin: 0
              }}>
                We've sent a 6-digit code to {formData.email}
              </p>
            </div>

            {/* OTP Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '18px',
                  textAlign: 'center',
                  letterSpacing: '4px',
                  fontFamily: 'monospace',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Message */}
            {message && (
              <div style={{
                background: message.includes('successful') ? '#d1fae5' : '#fee2e2',
                color: message.includes('successful') ? '#065f46' : '#991b1b',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {message}
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              style={{
                width: '100%',
                background: isLoading || otp.length !== 6 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading || otp.length !== 6 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                marginBottom: '12px'
              }}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {/* Resend OTP */}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              style={{
                width: '100%',
                background: 'none',
                color: '#3b82f6',
                border: '2px solid #3b82f6',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {isLoading ? 'Sending...' : 'Resend OTP'}
            </button>

            {/* Back to Signup */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setShowOtp(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                ← Back to Signup
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
