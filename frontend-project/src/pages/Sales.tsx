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

type SalesForm = {
  saleNumber: string;
  medicineId: string;
  quantitySold: string;
  SaleDate: string;
};

const emptySales: SalesForm = {
  saleNumber: "",
  medicineId: "",
  quantitySold: "",
  SaleDate: new Date().toISOString().split("T")[0],
};

export default function Sales(){
  const [form, setForm] = useState<SalesForm>(emptySales);
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
      const res = await axios.post("http://localhost:600/sales", form, {withCredentials:true});
      const message = getMessage(res.data);
      const total = res.data && typeof res.data === "object" && "totalAmount" in res.data
        ? `\nTotal Amount: ${String(res.data.totalAmount)}`
        : "";
      alert(`${message}${total}`);
      setForm(emptySales);
    } catch (error) {
      if(axios.isAxiosError(error)){
        const errorMessage = error.response?.data?.message || "Operation failed";
        alert(errorMessage);
        return;
      }

      alert("Operation failed");
    }
  };

  return(
    <div>
      <Navbar/>
      <h1>Sales</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="sale number"
          value={form.saleNumber}
          onChange={(e)=>setForm({...form, saleNumber:e.target.value})}
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
          placeholder="quantity sold"
          value={form.quantitySold}
          onChange={(e)=>setForm({...form, quantitySold:e.target.value})}
        />
        <input
          type="date"
          placeholder="sale date"
          value={form.SaleDate}
          onChange={(e)=>setForm({...form, SaleDate:e.target.value})}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
