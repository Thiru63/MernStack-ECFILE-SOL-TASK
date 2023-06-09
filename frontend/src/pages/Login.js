import { useState, useEffect } from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import './Popup.css'
import axios from 'axios'

function Login() {
  const [email, setemail]=useState('')
  const [password,setpassword]=useState('')
  const [popup,setPop]=useState(false)
  const[number,setnumber]=useState('')
  const[otp,setotp]=useState('')
  

  

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    if(message && message.startsWith('An Otp')) setPop(true)

    if (isSuccess || user) {
        if(message) toast.success(message)
      if(user) navigate('/')
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

 const verifyOtp= async (e)=>{
  e.preventDefault()
  const data={
    number,
    otp,
  }
  setnumber('');
  setotp('')
  setPop(false)
  try {
    const res=await axios.post('https://ecfile-sol-task.onrender.com/api/users/otpverify',data)
   if(res.status===201) toast.success(res.data.message)
   else toast.error(res.data.message)
    
  } catch (error) {
    console.log(error)
    toast.error(error.response.data.message)
  }
   
 }  

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      email,
      password,
    }
    setemail('')
    setpassword('')
    dispatch(login(userData))
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
    <div>{popup?
                     ( <div className="main">
                        <div className="popup">
                            <div className="popup-header">
                                <h2>OTP Verification</h2>
                                <h1 onClick={()=>setPop(false)}>X</h1>
                            </div>
                            <div >
                            <form onSubmit={verifyOtp} className='form-ogroup'>
                              <input className='form-control'
                              type='number' name='number'
                              value={number} onChange={e=>setnumber(e.target.value)} 
                              placeholder='Enter your mobile number'/>
                              <input 
                              type='number' name='otp'
                              value={otp} onChange={e=>setotp(e.target.value)} 
                              placeholder='Enter six digit otp'/>
                              <button type='submit' className='btn'>verify</button>
                            </form>
                            </div>
                        </div>
                      </div>):

    
    ( <div> <section className='heading'>
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Login Your Account</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Enter your email'
              onChange={e=>setemail(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='password is name+last five digits of your number,name is case-insensitive'
              onChange={e=>setpassword(e.target.value)}
            />
          </div>

          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Submit
            </button>
          </div>
        </form>
      </section></div>)}
      </div>
    </>
  )
}

export default Login