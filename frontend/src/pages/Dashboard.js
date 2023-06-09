import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Login from './Login'
import { BsDownload } from "react-icons/bs";
import axios from 'axios'






function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [popup,setPop]=useState(false)
  const[USER,setUSER]=useState('')
  
  const { user } = useSelector((state) => state.auth)
  

  const onclick= async (e)=>{
    e.preventDefault();
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const res= await axios.get('http://localhost:5000/api/users/user',config)
   if(res.data) setUSER(res.data)
   console.log(res)
   if(res.data)setPop(true)
      
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
      
    }

    

  }
  

  useEffect(() => {
    

    if (!user) {
      navigate('/login')
    }

    

     
     
  }, [user, navigate,  dispatch])
   
   if(!user) {
    return <Login/>
   }



  const img=require(`../uploads/${user.imagefile}`)

  return (
    <>
    <div>
      {popup?(<div style={{backgroundColor:'gray',height:'500px'}} className='popup'>
        <div className='popup-header'>
          <h2>My data</h2>
          <h1 onClick={e=>setPop(false)}>X</h1>
        </div>
       <img src={img} alt='' height='300px' width='300px'></img>
       <a href={img} download><i title='download image' ><BsDownload/></i></a>
       
       <div>
        <h4>Name: {USER.name} </h4>
        <h4>Email: {USER.email}</h4>
        <h4>Mobile: {USER.mobilenumber}</h4>
       </div>
       
       
       

      </div>):(<div>

        <section className='heading'>
      <p>User Dashboard</p>
        <h1>Welcome {user && user.name}</h1>
        
      </section>
      <div>
        
        <button style={{position:'relative',left:'400px'}} className='btn' onClick={onclick}>Show my data</button>
      </div>

      </div>)}
    </div>
    
      
    </>
  )
}

export default Dashboard