import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import Navbar from "../components/Navbar";

type Category = {
  categoryId: string;
  categoryName: string;
  storageInstructions: string;
};

const emptyCategory: Category = {
  categoryId: "",
  categoryName: "",
  storageInstructions: "",
};

export default function Categories(){
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Category>(emptyCategory);
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

  const loadCategories = async () => {
    const res = await axios.get<Category[]>("http://localhost:600/category", {withCredentials:true});
    setCategories(res.data);
  };

  useEffect(() => {
    loadCategories().catch(() => alert("Failed to load categories"));
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = editingId
        ? await axios.put(`http://localhost:600/category/${editingId}`, form, {withCredentials:true})
        : await axios.post("http://localhost:600/category", form, {withCredentials:true});

      alert(getMessage(res.data));
      setForm(emptyCategory);
      setEditingId("");
      await loadCategories();
    } catch {
      alert("Operation failed");
    }
  };

  const editCategory = (category: Category) => {
    setForm(category);
    setEditingId(category.categoryId);
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const res = await axios.delete(`http://localhost:600/category/${categoryId}`, {withCredentials:true});
      alert(getMessage(res.data));
      await loadCategories();
    } catch {
      alert("Delete failed");
    }
  };

  return(
    <div>
      <Navbar />
      <h1>Categories</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="category id"
          value={form.categoryId}
          disabled={Boolean(editingId)}
          onChange={(e)=>setForm({...form, categoryId:e.target.value})}
        />
        <input
          type="text"
          placeholder="category name"
          value={form.categoryName}
          onChange={(e)=>setForm({...form, categoryName:e.target.value})}
        />
        <input
          type="text"
          placeholder="storage instructions"
          value={form.storageInstructions}
          onChange={(e)=>setForm({...form, storageInstructions:e.target.value})}
        />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && (
          <button type="button" onClick={()=>{ setForm(emptyCategory); setEditingId(""); }}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Category Id</th>
            <th>Category Name</th>
            <th>Storage Instructions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category)=>(
            <tr key={category.categoryId}>
              <td>{category.categoryId}</td>
              <td>{category.categoryName}</td>
              <td>{category.storageInstructions}</td>
              <td>
                <button type="button" onClick={()=>editCategory(category)}>Edit</button>
                <button type="button" onClick={()=>deleteCategory(category.categoryId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
