import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";


export default function App(){
  const [username, setUsername] = useState ("");
  const [password, setPassword] = useState ("");
  
const handleLogin =async ()=>{
  try {
    const res =  await axios.post("http://localhost:600/login", 
       {username,password},
      {withCredentials:true});
       alert(res.data.message || "login successful");
  
      if(res.data.success){
        window.location.href = "/Categories"; 
      }
  } catch (error) {
    alert("Login failed");
    console.log(error);
    }
};

  return(
    <div>
    <h1>Login</h1>
     
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
      
    <button onClick={handleLogin}>login</button>
<p>Don't have account <Link to="/Register">Register</Link></p>

    </div>
  );
}
