import axios from "axios";
import { Link } from "react-router-dom";

export default function(){
    const logout = async () =>{
        await axios.get("http://localhost:600/logout",
            {withCredentials:true});
             window.location.href = "/";
    }
    return(
        <nav className="Navbar">
            <Link to="/Categories">Categories</Link>
            <Link to="/Medicine">Medicine</Link>
            <Link to="/Inventory">Inventory</Link>
            <Link to="/Sales">Sales</Link>
            <Link to="/Report">Report</Link>
            <button onClick={logout}>logout</button>
        </nav>
    );
}