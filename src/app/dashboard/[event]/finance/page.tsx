"use client";
import DashboardSidebar from "@/components/dashboardSidebar";
import LogoutButton from "@/components/logoutButton";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/Supabase";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

import { MdDeleteForever } from "react-icons/md";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function EventLogistics() {
  const { user } = useAuth();
  const params = useParams();

  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchExpenses = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("event_id", params.event);

      if (error) setError(error.message);
      else setExpenses(data ?? []);
      setLoading(false);
    };

    fetchExpenses();
  }, [user, params.event]);

  const incomes = expenses.filter((e) => (e.expense_type).toLowerCase() === "income");
  const withdrawals = expenses.filter((e) => (e.expense_type).toLowerCase() === "withdrawal");

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    date: new Date(),
    type: "",
    category: ""
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setExpenseForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleNewExpense(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);

    try {
      const { data, error } = await supabase
        .from("expenses")
        .insert([
          {
            expense_title: expenseForm.title,
            expense_amount: expenseForm.amount,
            expense_date: expenseForm.date,
            expense_type: expenseForm.type,
            expense_category: expenseForm.category,
            event_id: params.event,
          },
        ])
        .select();

      if (error) throw error;

      if (data) setExpenses((prev) => [...prev, ...data]);
    } catch (err: any) {
      console.error("Error creating expense:", err);
      setError(err.message);
    } finally {
      setFormLoading(false);
      if (!error) {window.location.reload()}
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase.from("expenses").delete().eq("expense_id", id);
      if (error) throw error;
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      console.error("Error deleting expense:", err);
      setError(err.message);
    } finally {
      if (!error) {window.location.reload()}
    }
  }

  const chartData = {
    labels: ["Income", "Withdrawal"],
    datasets: [
      {
        label: "Amount",
        data: [
          incomes.reduce((sum, item) => sum + Number(item.expense_amount), 0),
          withdrawals.reduce((sum, item) => sum + Number(item.expense_amount), 0),
        ],
        backgroundColor: ["#4ade80", "#f87171"], // green for income, red for withdrawal
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Income vs Withdrawal",
      },
    },
  };

    const withdrawalsCategoryData = withdrawals.reduce((acc: any, expense) => {
      const category = expense.expense_category || "Uncategorized";
      if (!acc[category]) acc[category] = 0;
      acc[category] += Number(expense.expense_amount);
      return acc;
  }, {});

  const WithdrawalPieChartData = {
    labels: Object.keys(withdrawalsCategoryData),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(withdrawalsCategoryData),
        backgroundColor: [
          "#4ade80", "#f87171", "#60a5fa", "#fbbf24", "#34d399", "#ff7f50", "#eab308", "#ec4899",
        ],
      },
    ],
  };

  const WithdrawalPieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Withdrawal Distribution by Category",
      },
    },
  };



  const incomePieChartData = incomes.reduce((acc: any, expense) => {
    const category = expense.expense_category || "Uncategorized";
    if (!acc[category]) acc[category] = 0;
    acc[category] += Number(expense.expense_amount);
    return acc;
  }, {});

  const IncomePieChartData = {
    labels: Object.keys(incomePieChartData),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(incomePieChartData),
        backgroundColor: [
          "#4ade80", "#f87171", "#60a5fa", "#fbbf24", "#34d399", "#ff7f50", "#eab308", "#ec4899",
        ],
      },
    ],
  };

  const IncomePieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Income Distribution by Category",
      },
    },
  };

  return (
    <>
      <div>
        <LogoutButton />
      </div>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <DashboardSidebar uuid={(params.event as string) || ""} />

        <main style={{ flex: 1, padding: "2rem" }}>
          <h1 className="text-3xl font-bold mb-6">Finance</h1>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <div className="w-full space-y-8">
              <div className="flex flex-wrap gap-6 justify-center items-start w-full">
                <div style={{ width: 400, height: 300, minWidth: 250 }}>
                  <Bar data={chartData} options={chartOptions} width={400} height={300} />
                </div>
                <div style={{ width: 400, height: 300, minWidth: 250 }}>
                  <Pie data={WithdrawalPieChartData} options={WithdrawalPieChartOptions} width={400} height={300} />
                </div>
                <div style={{ width: 400, height: 300, minWidth: 250 }}>
                  <Pie data={IncomePieChartData} options={IncomePieChartOptions} width={400} height={300} />
                </div>
              </div>
          
              <form
                onSubmit={handleNewExpense}
                className="flex flex-wrap items-end gap-4 bg-white p-4 rounded-2xl shadow-md"
              >
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    min={0}
                    name="amount"
                    required
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    required
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <select
                    name="type"
                    required
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={expenseForm.type}
                  >
                    <option value="" disabled>
                      Select type
                    </option>
                    <option value="income">Income</option>
                    <option value="withdrawal">Withdrawal</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    required
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={expenseForm.category}
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {(expenseForm.type).toLowerCase() == "income" &&
                    <>
                      <option value="sponsorship">Sponsorship</option>
                      <option value="society">Society</option>
                      <option value="university">University</option>
                      <option value="other">Other</option>
                    </>
                    } 

                    {(expenseForm.type).toLowerCase() == "withdrawal" &&
                    <>
                      <option value="prizes">Prizes</option>
                      <option value="venue">Venue</option>
                      <option value="merchandise">Merchandise</option>
                      <option value="catering">Catering</option>
                      <option value="other">Other</option>
                    </>
                    } 
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {formLoading ? "Loading..." : "Submit"}
                </button>
              </form>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Income</h2>
                <div className="overflow-x-auto rounded-2xl shadow">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3 border-b">title</th>
                        <th className="px-4 py-3 border-b">Amount</th>
                        <th className="px-4 py-3 border-b">Category</th>
                        <th className="px-4 py-3 border-b">Date</th>
                        <th className="px-4 py-3 border-b text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomes.map((e, idx) => (
                        <tr
                          key={e.expense_id || idx}
                          className="odd:bg-white even:bg-gray-50 hover:bg-green-50 transition-colors"
                        >
                          <td className="px-4 py-2 border-b">
                            {e.expense_title || "-"}
                          </td>
                          <td className="px-4 py-2 border-b">{e.expense_amount}</td>
                          <td className="px-4 py-2 border-b">{e.expense_category}</td>

                          <td className="px-4 py-2 border-b">
                            {e.expense_date
                              ? new Date(e.expense_date).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="px-4 py-2 border-b text-center">
                            <button
                              onClick={() => handleDelete(e.expense_id)}
                              className="px-1 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <MdDeleteForever className="h-6 w-6" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>


              <section>
                <h2 className="text-2xl font-semibold mb-4">Withdrawals</h2>
                <div className="overflow-x-auto rounded-2xl shadow">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3 border-b">title</th>
                        <th className="px-4 py-3 border-b">Amount</th>
                        <th className="px-4 py-3 border-b">Category</th>
                        <th className="px-4 py-3 border-b">Date</th>
                        <th className="px-4 py-3 border-b text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map((e, idx) => (
                        <tr
                          key={e.id || idx}
                          className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors"
                        >
                          <td className="px-4 py-2 border-b">
                            {e.expense_title || "-"}
                          </td>
                          <td className="px-4 py-2 border-b">{e.expense_amount}</td>
                          <td className="px-4 py-2 border-b">{e.expense_category}</td>
                          <td className="px-4 py-2 border-b">
                            {e.expense_date
                              ? new Date(e.expense_date).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="px-4 py-2 border-b text-center">
                            <button
                              onClick={() => handleDelete(e.expense_id)}
                              className="px-1 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <MdDeleteForever className="h-6 w-6" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              
            </div>
          )}
        </main>
      </div>
    </>
  );
}
