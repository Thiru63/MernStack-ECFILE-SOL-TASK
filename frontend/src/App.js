import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import EmailVerify from './pages/EmailVerify'
import PageNotFound from './pages/PageNotFound'
import AdminPanel from './pages/AdminPanel'
import { useSelector } from 'react-redux'


function App() {
  const { user } = useSelector(
    (state) => state.auth
  )
  let page=<Dashboard/>
  if(user && user.email===process.env.REACT_APP_ADMIN_EMAIL) {
    page = <AdminPanel/>
  }

  return (
    <>
    
      <Router>
        <div className='container'>
          <Header />
          <Routes>
          
            
            <Route path='/' exact element={page} />
            <Route path='/login' exact element={<Login />} />
            <Route path='/register' exact element={<Register />} />
            <Route path='/users/:id/verify/:token' exact element={<EmailVerify />} />
            <Route path='*' exact element={<PageNotFound/>} />
          </Routes>
        </div>

        
      </Router>
      
      <ToastContainer />
    </>
  )
}

export default App
