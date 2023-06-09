import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";



const EmailVerify = () => {
	const [validUrl, setValidUrl] = useState('Invalid Link');
    const [st,setst]=useState(false);
	const param = useParams();
	const[clr,setclr]=useState('red') 
	

	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				const url = `http://localhost:5000/api/users/${param.id}/verify/${param.token}`;
				const res  = await axios.get(url);
				console.log(res);
				if(res.data.message){ setValidUrl(res.data.message); }
				
                if(res.status===201) { setst(true); setclr('green'); }
				
			} catch (error) {
				console.log(error);
				
				
				
			}
			
		};
		verifyEmailUrl();
		
	});

    

	
	

	return (
		<div>
			
				<div >
					
					<h1 style={{color:clr}}>{validUrl}</h1>
					{st && <Link to="/login">
						<button style={{position:"relative",left:"400px"}} className="btn">Login</button>
					</Link>}
				</div>
			
		</div>
	);
};

export default EmailVerify;