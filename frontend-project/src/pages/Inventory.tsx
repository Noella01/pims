import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import Navbar from "../components/Navbar";

type Medicine = {
  medicineId: string;
  categoryId: string;
  tradeName: string;
  genericName: string;
  unitPrice: string;
};

type InventoryForm = {
  stockNumber: string;
  medicineId: string;
  quantityInhand: string;
  expiryDate: string;
};

const emptyInventory: InventoryForm = {
  stockNumber: "",
  medicineId: "",
  quantityInhand: "",
  expiryDate: "",
};

export default function Inventory(){
  const [form, setForm] = useState<InventoryForm>(emptyInventory);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const getMessage = (data: unknown) => {
    if(typeof data === "string"){
      return data;
    }

    if(data && typeof data === "object" && "message" in data){
      return String(data.message);
    }

    return "Done";
  };

  useEffect(() => {
    axios.get<Medicine[]>("http://localhost:600/medicine", {withCredentials:true})
      .then((res)=>setMedicines(res.data))
      .catch(()=>alert("Failed to load medicines"));
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:600/inventoryStock", form, {withCredentials:true});
      alert(getMessage(res.data));
      setForm(emptyInventory);
    } catch {
      alert("Operation failed");
    }
  };

  return(
    <div>
      <Navbar/>
      <h1>Inventory Stock</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="stock number"
          value={form.stockNumber}
          onChange={(e)=>setForm({...form, stockNumber:e.target.value})}
        />
        <select
          value={form.medicineId}
          onChange={(e)=>setForm({...form, medicineId:e.target.value})}
        >
          <option value="">Select medicine</option>
          {medicines.map((medicine)=>(
            <option key={medicine.medicineId} value={medicine.medicineId}>
              {medicine.medicineId} - {medicine.tradeName}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="quantity in hand"
          value={form.quantityInhand}
          onChange={(e)=>setForm({...form, quantityInhand:e.target.value})}
        />
        <input
          type="date"
          placeholder="expiry date"
          value={form.expiryDate}
          onChange={(e)=>setForm({...form, expiryDate:e.target.value})}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
