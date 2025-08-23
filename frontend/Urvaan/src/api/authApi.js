const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const authApi = {
  // Send OTP for login/registration
  sendOtp: async (email, fullName, username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, fullName, username }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Network error occurred')
    }
  },

  // Verify OTP and login
  verifyOtp: async (email, otp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Network error occurred')
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to refresh token')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Network error occurred')
    }
  },
}