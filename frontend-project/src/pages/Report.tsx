import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import Navbar from "../components/Navbar";

type DailyReportRow = {
  tradeName: string;
  quantitySold: number;
  remainingStock: number;
};

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function Report() {
  const [reportDate, setReportDate] = useState(todayDate());
  const [rows, setRows] = useState<DailyReportRow[]>([]);

  const loadReport = async (dateValue: string) => {
    const res = await axios.get<DailyReportRow[]>("http://localhost:600/reports/daily", {
      params: { date: dateValue },
      withCredentials: true
    });
    setRows(res.data);
  };

  useEffect(() => {
    loadReport(reportDate).catch(() => alert("Failed to load daily report"));
  }, [reportDate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await loadReport(reportDate).catch(() => alert("Failed to load daily report"));
  };

  return(
    <div>
      <Navbar/>
      <h1>Daily Report</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={reportDate}
          onChange={(e)=>setReportDate(e.target.value)}
        />
        <button type="submit">Generate</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Trade Name</th>
            <th>Quantity Sold</th>
            <th>Remaining Stock</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.tradeName}>
              <td>{row.tradeName}</td>
              <td>{row.quantitySold}</td>
              <td>{row.remainingStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
