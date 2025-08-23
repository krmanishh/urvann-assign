// Local storage utility functions

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error('Error parsing stored user:', error)
    return null
  }
}

export const getStoredToken = () => {
  return localStorage.getItem('token')
}

export const setStoredAuth = (user, token) => {
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('token', token)
}

export const removeStoredAuth = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}

export const getStoredCart = () => {
  try {
    const cart = localStorage.getItem('cart')
    return cart ? JSON.parse(cart) : []
  } catch (error) {
    console.error('Error parsing stored cart:', error)
    return []
  }
}

export const setStoredCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart))
}

export const clearStoredCart = () => {
  localStorage.removeItem('cart')
}