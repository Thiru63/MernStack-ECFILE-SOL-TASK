import axios from 'axios';
import { useState,useEffect } from 'react';
import { useSelector } from 'react-redux'
import UsersCard from '../components/UsersCard'
import { toast } from 'react-toastify'
import Login from './Login'
import { useNavigate } from 'react-router-dom'

const AdminPanel=()=>{

    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)

    const[data,setdata]=useState([])
    
const onclick= async (e)=>{
    e.preventDefault();

    try {
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        const res= await axios.get('https://ecfile-sol-task.onrender.com/api/users/',config)
        console.log(res)
        if(res.data) setdata(res.data)
        
    } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
    }
}

useEffect(() => {
    

    if (!user) {
      navigate('/login')
    }

    

     
     
  }, [user, navigate])

if(!user) {
    return <Login/>
   }

    return(
        <>
        
        <section className='heading'>
      <p>Admin Dashboard</p>
        <h1>Welcome {user && user.name}</h1>
        
      </section>
        <div>
            <button style={{position:'relative',left:'400px'}} className='btn' onClick={onclick}>Users Data</button>
        </div>
        <div>
            {data.length>0 && data.map(user=>{
                return <UsersCard key={user._id} user={user}/>
                
            })}
        </div>
        </>
    )
}

export default AdminPanel