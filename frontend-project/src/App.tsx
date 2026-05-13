import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Categories from "./pages/Categories";
import Medicine from "./pages/Medicine";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Report from "./pages/Report";

export default function App(){
  return(
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/Register" element={<Register/>}/>
          <Route path="/Categories" element={<Categories/>}/>
          <Route path="/Medicine" element={<Medicine/>}/>
          <Route path="/Inventory" element={<Inventory/>}/>
          <Route path="/Sales" element={<Sales/>}/>
          <Route path="/Report" element={<Report/>}/>
        </Routes>
    </BrowserRouter>
  );
}