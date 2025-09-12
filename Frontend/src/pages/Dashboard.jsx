import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// StatCard Component
function StatCard({ title, value, icon, color, bgColor }) {
  return (
    <div className="p-6 transition-all duration-300 border shadow-lg bg-white/70 backdrop-blur-sm border-slate-200/60 rounded-2xl hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const [overviewRes, revenueRes, customersRes, productsRes] =
         await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/overview`, { headers }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/revenue`, { headers }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/top-customers`, { headers }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/top-products`, { headers }),
        ]);

        setOverview(overviewRes.data);
        setRevenue(revenueRes.data);
        setTopCustomers(customersRes.data);
        setTopProducts(productsRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 mx-auto border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="font-medium text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );

  if (error) 
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-md p-8 mx-4 text-center bg-white shadow-lg rounded-2xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">Error Loading Data</h3>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm border-slate-200/60">
        <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-500">Welcome back to your analytics</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/25"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="px-6 py-8 mx-auto space-y-8 max-w-7xl">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Customers" 
            value={overview.totalCustomers}
            icon="👥"
            color="from-blue-500 to-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard 
            title="Total Orders" 
            value={overview.totalOrders}
            icon="📦"
            color="from-emerald-500 to-emerald-600"
            bgColor="bg-emerald-50"
          />
          <StatCard 
            title="Revenue" 
            value={`₹${overview.totalRevenue.toFixed(2)}`}
            icon="💰"
            color="from-amber-500 to-amber-600"
            bgColor="bg-amber-50"
          />
          <StatCard 
            title="Products" 
            value={overview.totalProducts}
            icon="🛍️"
            color="from-purple-500 to-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Revenue Chart */}
        <div className="p-8 transition-all duration-300 border shadow-xl bg-white/70 backdrop-blur-sm border-slate-200/60 rounded-2xl hover:shadow-2xl">
          <div className="flex items-center mb-6 space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Revenue Analytics</h2>
              <p className="text-sm text-slate-500">Track your revenue performance over time</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={{ stroke: '#cbd5e1' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar 
                dataKey="revenue" 
                fill="url(#gradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {/* Top Customers */}
          <div className="overflow-hidden transition-all duration-300 border shadow-xl bg-white/70 backdrop-blur-sm border-slate-200/60 rounded-2xl hover:shadow-2xl">
            <div className="p-6 text-white bg-gradient-to-r from-blue-500 to-indigo-600">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold">Top Customers</h2>
                  <p className="text-sm text-blue-100">Your most valuable customers</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-slate-50 border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Customer</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-right uppercase text-slate-600">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topCustomers.map((c, index) => (
                    <tr key={c.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-blue-400 to-indigo-500">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{c.name}</p>
                            <p className="text-sm text-slate-500">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                          ₹{c.totalSpent.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="overflow-hidden transition-all duration-300 border shadow-xl bg-white/70 backdrop-blur-sm border-slate-200/60 rounded-2xl hover:shadow-2xl">
            <div className="p-6 text-white bg-gradient-to-r from-emerald-500 to-teal-600">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold">Top Products</h2>
                  <p className="text-sm text-emerald-100">Best performing items</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-slate-50 border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">Product</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-right uppercase text-slate-600">Sold</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-right uppercase text-slate-600">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topProducts.map((p, index) => (
                    <tr key={p.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-white rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500">
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{p.title}</p>
                            <p className="text-sm text-slate-500">Price: ₹{p.price.toFixed(2) || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                          {p.sold}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                          ₹{p.revenue.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}