import axios from 'axios'

const API_URL = 'http://localhost:5000/api/users/'
const config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData,config)


  
 
  return response
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (!response.data.message) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
}

const authService = {
  register,
  logout,
  login,
}

export default authService