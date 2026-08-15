import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Sparkles, 
  DollarSign, 
  PieChart as PieIcon,
  ShieldAlert
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { travelApi } from '../services/api';
import { Expense } from '../types';

const COLORS = ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

export const BudgetPage: React.FC = () => {
  const [totalBudget, setTotalBudget] = useState(150000);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Food');

  const fetchExpenses = () => {
    travelApi.getExpenses()
      .then(res => setExpenses(res.data))
      .catch(err => console.error("Expense error:", err));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;

    try {
      await travelApi.addExpense({
        category: newCategory,
        title: newTitle,
        amount_inr: parseFloat(newAmount),
        date_str: "Today"
      });
      setNewTitle('');
      setNewAmount('');
      fetchExpenses();
    } catch (err) {
      console.error("Add expense error:", err);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      await travelApi.deleteExpense(id);
      fetchExpenses();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount_inr, 0);
  const remainingBudget = Math.max(0, totalBudget - totalSpent);

  // Group by category for pie chart
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount_inr;
  });

  const chartData = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    value: categoryTotals[cat]
  }));

  if (chartData.length === 0) {
    chartData.push(
      { name: 'Stay', value: 58000 },
      { name: 'Flights', value: 45000 },
      { name: 'Activities', value: 20000 },
      { name: 'Food', value: 12000 }
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Budget & Expense Optimizer" 
          subtitle="Knapsack mathematical allocation, live spending tracking, and expense breakdown" 
        />

        <main className="p-8 max-w-7xl w-full space-y-6">
          {/* Top 3 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Budget</span>
              <p className="text-2xl font-black text-slate-900 mt-1">₹ {totalBudget.toLocaleString('en-IN')}</p>
              <span className="text-[11px] text-blue-600 font-bold mt-1 block">Allocated Target</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Estimated / Spent</span>
              <p className="text-2xl font-black text-blue-600 mt-1">₹ {totalSpent.toLocaleString('en-IN')}</p>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">Across {expenses.length} tracked items</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Remaining Buffer</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">₹ {remainingBudget.toLocaleString('en-IN')}</p>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Positive Reserve</span>
            </div>
          </div>

          {/* Charts & Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Pie Chart Card */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Category Expenditure Breakdown</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-600">
                {chartData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span>{item.name} (₹{item.value.toLocaleString('en-IN')})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Expense Form */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Log New Expense</h3>
              <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Expense Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Scuba Diving Pass, Beach Dinner"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Amount (₹ INR)</label>
                    <input
                      type="number"
                      required
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      placeholder="e.g. 3500"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900"
                    >
                      <option>Stay</option>
                      <option>Flight</option>
                      <option>Activities</option>
                      <option>Food</option>
                      <option>Transport</option>
                      <option>Misc</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Expense Item</span>
                </button>
              </form>

              {/* Expense List */}
              <div className="space-y-2 pt-2 max-h-48 overflow-y-auto">
                {expenses.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{exp.title}</p>
                      <span className="text-[10px] text-slate-400">{exp.category} • {exp.date_str}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-blue-600">₹{exp.amount_inr.toLocaleString('en-IN')}</span>
                      <button onClick={() => handleDeleteExpense(exp.id)} className="text-slate-400 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
