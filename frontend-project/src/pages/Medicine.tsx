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

type Category = {
  categoryId: string;
  categoryName: string;
  storageInstructions: string;
};

const emptyMedicine: Medicine = {
  medicineId: "",
  categoryId: "",
  tradeName: "",
  genericName: "",
  unitPrice: "",
};

export default function Medicine(){
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Medicine>(emptyMedicine);
  const [editingId, setEditingId] = useState("");

  const getMessage = (data: unknown) => {
    if(typeof data === "string"){
      return data;
    }

    if(data && typeof data === "object" && "message" in data){
      return String(data.message);
    }

    return "Done";
  };

  const loadMedicines = async () => {
    const res = await axios.get<Medicine[]>("http://localhost:600/medicine", {withCredentials:true});
    setMedicines(res.data);
  };

  const loadCategories = async () => {
    const res = await axios.get<Category[]>("http://localhost:600/category", {withCredentials:true});
    setCategories(res.data);
  };

  useEffect(() => {
    Promise.all([loadMedicines(), loadCategories()]).catch(() => alert("Failed to load related data"));
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = editingId
        ? await axios.put(`http://localhost:600/medicine/${editingId}`, form, {withCredentials:true})
        : await axios.post("http://localhost:600/medicine", form, {withCredentials:true});

      alert(getMessage(res.data));
      setForm(emptyMedicine);
      setEditingId("");
      await loadMedicines();
    } catch {
      alert("Operation failed");
    }
  };

  const editMedicine = (medicine: Medicine) => {
    setForm(medicine);
    setEditingId(medicine.medicineId);
  };

  const deleteMedicine = async (medicineId: string) => {
    try {
      const res = await axios.delete(`http://localhost:600/medicine/${medicineId}`, {withCredentials:true});
      alert(getMessage(res.data));
      await loadMedicines();
    } catch {
      alert("Delete failed");
    }
  };

  return(
    <div>
      <Navbar/>
      <h1>Medicine</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="medicine id"
          value={form.medicineId}
          disabled={Boolean(editingId)}
          onChange={(e)=>setForm({...form, medicineId:e.target.value})}
        />
        <select
          value={form.categoryId}
          onChange={(e)=>setForm({...form, categoryId:e.target.value})}
        >
          <option value="">Select category</option>
          {categories.map((category)=>(
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryId} - {category.categoryName}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="trade name"
          value={form.tradeName}
          onChange={(e)=>setForm({...form, tradeName:e.target.value})}
        />
        <input
          type="text"
          placeholder="generic name"
          value={form.genericName}
          onChange={(e)=>setForm({...form, genericName:e.target.value})}
        />
        <input
          type="number"
          placeholder="unit price"
          value={form.unitPrice}
          onChange={(e)=>setForm({...form, unitPrice:e.target.value})}
        />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && (
          <button type="button" onClick={()=>{ setForm(emptyMedicine); setEditingId(""); }}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Medicine Id</th>
            <th>Category Id</th>
            <th>Trade Name</th>
            <th>Generic Name</th>
            <th>Unit Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine)=>(
            <tr key={medicine.medicineId}>
              <td>{medicine.medicineId}</td>
              <td>{medicine.categoryId}</td>
              <td>{medicine.tradeName}</td>
              <td>{medicine.genericName}</td>
              <td>{medicine.unitPrice}</td>
              <td>
                <button type="button" onClick={()=>editMedicine(medicine)}>Edit</button>
                <button type="button" onClick={()=>deleteMedicine(medicine.medicineId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
