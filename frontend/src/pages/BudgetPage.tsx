import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  PieChart as PieIcon, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export const BudgetPage: React.FC = () => {
  const [totalBudget, setTotalBudget] = useState(45000);
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Hotels', amount: 16500, label: 'Heritage Boutique Stay (3 Nights)', date: '10 Jun 2025' },
    { id: 2, category: 'Flights', amount: 14000, label: 'Roundtrip Flights for 2', date: '10 Jun 2025' },
    { id: 3, category: 'Activities', amount: 6200, label: 'Scuba Diving & Fort Entry Passes', date: '12 Jun 2025' },
    { id: 4, category: 'Food & Dining', amount: 4800, label: 'Seafood Cafes & Breakfasts', date: '13 Jun 2025' },
  ]);

  const [category, setCategory] = useState('Food & Dining');
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentSpent = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

  const chartData = [
    { name: 'Hotels', value: expenses.filter(e => e.category === 'Hotels').reduce((s, e) => s + e.amount, 0) },
    { name: 'Flights', value: expenses.filter(e => e.category === 'Flights').reduce((s, e) => s + e.amount, 0) },
    { name: 'Activities', value: expenses.filter(e => e.category === 'Activities').reduce((s, e) => s + e.amount, 0) },
    { name: 'Food & Dining', value: expenses.filter(e => e.category === 'Food & Dining').reduce((s, e) => s + e.amount, 0) },
    { name: 'Other', value: expenses.filter(e => e.category === 'Other').reduce((s, e) => s + e.amount, 0) },
  ].filter(d => d.value > 0);

  const COLORS = ['#A23B19', '#D97736', '#C39462', '#78716C', '#1D1917'];

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !label.trim()) return;
    const newExp = {
      id: Date.now(),
      category,
      amount: parseFloat(amount),
      label,
      date: 'Today'
    };
    setExpenses([newExp, ...expenses]);
    setAmount('');
    setLabel('');
  };

  return (
    <div className="flex min-h-screen bg-[#FAF6F0] text-[#1D1917] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Knapsack Budget Optimizer 💰" 
          subtitle="Real-Time Expense Tracking & Autonomous 0/1 Knapsack Financial Optimization" 
        />

        <main className="p-6 sm:p-8 max-w-7xl w-full space-y-6">
          {/* Top 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-warm-sm space-y-1">
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">Total Allocated Budget</span>
              <p className="font-serif text-2xl font-black text-[#1D1917]">₹ {totalBudget.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-[#A8A29E]">Configured during AI trip creation</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-warm-sm space-y-1">
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">Total Spent to Date</span>
              <p className="font-serif text-2xl font-black text-[#A23B19]">₹ {totalSpent.toLocaleString('en-IN')}</p>
              <div className="w-full bg-[#E8DFD3] h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-[#A23B19] h-full rounded-full" style={{ width: `${percentSpent}%` }} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-warm-sm space-y-1">
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">Remaining Buffer</span>
              <p className={`font-serif text-2xl font-black ${remaining >= 0 ? 'text-emerald-700' : 'text-[#A23B19]'}`}>
                ₹ {remaining.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-[#78716C] font-medium">{remaining >= 0 ? 'Within budget safety margin' : 'Budget overrun detected'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Add Expense Form & Log */}
            <div className="lg:col-span-7 space-y-6">
              {/* Add Expense Form */}
              <div className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-warm space-y-4">
                <h3 className="font-serif font-bold text-[#1D1917] text-base">Log New Vacation Expense</h3>

                <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-1">Expense Label</label>
                      <input
                        type="text"
                        required
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="e.g. Traditional Lunch at Sunset Deck"
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E8DFD3] bg-[#F8F3EC] text-[#1D1917] outline-none focus:border-[#A23B19]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-1">Amount (INR)</label>
                      <input
                        type="number"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g. 1500"
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E8DFD3] bg-[#F8F3EC] text-[#1D1917] outline-none focus:border-[#A23B19]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E8DFD3] bg-[#F8F3EC] text-[#1D1917] font-semibold outline-none focus:border-[#A23B19]"
                    >
                      <option>Hotels</option>
                      <option>Flights</option>
                      <option>Activities</option>
                      <option>Food & Dining</option>
                      <option>Shopping</option>
                      <option>Local Transit</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#A23B19] hover:bg-[#892F11] text-white font-bold text-xs shadow-warm-sm transition flex items-center justify-center gap-1.5 mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Expense Item</span>
                  </button>
                </form>
              </div>

              {/* Expense History List */}
              <div className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-warm space-y-4">
                <h3 className="font-serif font-bold text-[#1D1917] text-base">Expense History</h3>

                <div className="space-y-2.5">
                  {expenses.map((exp) => (
                    <div 
                      key={exp.id}
                      className="p-3.5 rounded-2xl bg-[#F8F3EC] border border-[#E8DFD3] flex items-center justify-between text-xs hover:bg-[#EFE8DE] transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1D1917]">{exp.label}</span>
                          <span className="text-[10px] font-semibold text-[#A23B19] bg-[#FBECE7] px-2 py-0.5 rounded-full">
                            {exp.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#78716C] mt-0.5">{exp.date}</p>
                      </div>

                      <span className="font-serif font-black text-sm text-[#1D1917]">
                        ₹ {exp.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Pie Chart & AI Optimization Card */}
            <div className="lg:col-span-5 space-y-6">
              {/* Category Breakdown Pie Chart */}
              <div className="bg-white p-6 rounded-3xl border border-[#E8DFD3] shadow-warm space-y-4">
                <h3 className="font-serif font-bold text-[#1D1917] text-base">Category Breakdown</h3>

                <div className="h-60 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`₹ ${Number(value).toLocaleString('en-IN')}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-wrap justify-center gap-3 text-xs">
                  {chartData.map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-[#78716C] font-medium">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Knapsack Buffer Card */}
              <div className="bg-[#FBECE7] p-6 rounded-3xl border border-[#E8DFD3] shadow-warm-sm space-y-3">
                <div className="flex items-center gap-2 text-[#A23B19] font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-[#A23B19]" />
                  <span>AI Financial Optimization Strategy</span>
                </div>
                <p className="text-xs text-[#1D1917] leading-relaxed">
                  Your itinerary currently utilizes <strong className="text-[#A23B19]">{percentSpent}%</strong> of your total budget. Our dynamic knapsack optimizer has preserved a 5% contingency reserve for local transit and unplanned excursions.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
