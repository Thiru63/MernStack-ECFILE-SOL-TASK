

const UsersCard=({user})=>{

    const imge=require(`../uploads/${user.imagefile}`)
    const t='true'
    const f='false'
  
    return(
        <div style={{backgroundColor:'lightgray', marginBottom:'15px',width:'500px',marginTop:'10px',position:'relative',left:"200px"}}>
            <div>
                <img src={imge} alt="" height='200px' width='200px'></img>
            </div>
            <div>
                <h4>ID: {user._id}</h4>
            <h4>Name: {user.name} </h4>
            <h4>Email: {user.email}</h4>
            <h4>Mobile: {user.mobilenumber}</h4>
            <h4>EmailVerified: {user.emailverified ? t: f}</h4>
            <h4>MobileVerified: {user.mobileverified ? t : f}</h4>
            <h4>User CreatedAt: {user.createdAt}</h4>
            <h4>User UpdatedAt: {user.updatedAt}</h4>
            </div>
        </div>
    )
}

export default UsersCard