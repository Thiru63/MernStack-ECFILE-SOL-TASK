import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser } from 'react-icons/fa'
import { register, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

function Register() {
  
    const[name,setname]=useState('');
    const[email,setemail]=useState('');
    const[mobilenumber,setmobilenumber]=useState('');
    const[imagefile,setimagefile]=useState('');
    
    const setName=(e)=>{
      const { value } = e.target;
      setname(value)
    }
    const setEmail=(e)=>{
      const { value } = e.target;
      setemail(value)
    }
    const setMN=(e)=>{
      const { value } = e.target;
      setmobilenumber(value)
    }
    const setimgfile = (e) => {
      setimagefile(e.target.files[0])
    }
    
    
    
  

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
     toast.success(message)
    
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  

  const onSubmit = async (e) => {
    e.preventDefault()

    
        var formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("mobilenumber",mobilenumber);
  formData.append("imagefile",imagefile)

  if(imagefile) {

  const base64 = await convertToBase64(imagefile);
  console.log(base64)
  
  
  const obj={
    name,
    email,
    mobilenumber,
    base64,
    imagefile,
  }
      setname('')
      setemail('')
      setmobilenumber('')
      setimagefile('')
 console.log(obj)
 
      dispatch(register(obj))
} else toast.error('Please add all fields')
    
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className='heading'>
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              id='name'
              name='name'
              value={name}
              placeholder='Enter your name'
              onChange={setName}
            />
          </div>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Enter your email'
              onChange={setEmail}
            />
          </div>
          <div className='form-group'>
            <input
              type='number'
              className='form-control'
              id='mobilenumber'
              name='mobilenumber'
              value={mobilenumber}
              placeholder='Enter mobile number'
              onChange={setMN}
            />
          </div>
          <div className='form-group'>
            <input
              type='file'
              className='form-control'
              id='imagefile'
              name='imagefile'
            
            title='Upload an image'
             
              onChange={setimgfile}
            />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Register

function convertToBase64(file){
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result)
    };
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}
