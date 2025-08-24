import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, User, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/authApi'

const Login = () => {
  const [step, setStep] = useState('details') // 'details' or 'otp'
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    username: '',
    otp: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await authApi.sendOtp(formData.email, formData.fullName, formData.username)
      setSuccess('OTP sent successfully to your email!')
      setStep('otp')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authApi.verifyOtp(formData.email, formData.otp)
      
      // Login user
      login(response.data.user, response.data.accessToken)
      
      setSuccess('Login successful!')
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    setStep('details')
    setError('')
    setSuccess('')
    setFormData(prev => ({ ...prev, otp: '' }))
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-3xl font-bold text-gray-900">
            {step === 'details' ? 'Welcome to Urvann' : 'Verify Your Email'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'details' 
              ? 'Sign in to your account or create a new one'
              : `Enter the OTP sent to ${formData.email}`
            }
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Forms */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">
          {step === 'details' ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="input pl-10"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="input pl-10"
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center space-x-2 py-3"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{loading ? 'Sending OTP...' : 'Send OTP'}</span>
              </button>

              <p className="text-xs text-gray-500 text-center">
                We'll send you a one-time password to verify your email address.
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="input text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Check your email for the 6-digit code
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full flex items-center justify-center space-x-2 py-3"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{loading ? 'Verifying...' : 'Verify & Login'}</span>
                </button>

                <button
                  type="button"
                  onClick={goBack}
                  className="btn btn-secondary w-full"
                >
                  Back to Details
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => handleSendOtp({ preventDefault: () => {} })}
                  disabled={loading}
                  className="text-sm text-primary-600 hover:text-primary-700 underline"
                >
                  Didn't receive the code? Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login