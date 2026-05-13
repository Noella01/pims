import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";


export default function App(){
  const [username, setUsername] = useState ("");
  const [password, setPassword] = useState ("");
  
const handleRegistration =async ()=>{
  try {
    const res =  await axios.post("http://localhost:600/register", 
       {username,password},
      {withCredentials:true});
      alert(res.data.message || "register successful");
      if(res.data.success){
        window.location.href = "/";
      }
  } catch (error) {
    alert("Registration failed");
    console.log(error);
  }
}

  return(
    <div>
    <h1>Registration</h1>
     
     <input type="text"
     placeholder="username"
     onChange={(e)=>setUsername(e.target.value)}
     />
     <br />
    <input type="password"
     value={password}
     placeholder="password"
     onChange={(e)=>setPassword(e.target.value)}
     /> 
     <br />
      
    <button onClick={handleRegistration}>Register</button>
<p>Have account <Link to="/">Login</Link></p>

    </div>
  );
}
