import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  ShoppingBag, 
  Wallet as WalletIcon, 
  Settings, 
  Menu, 
  TrendingUp, 
  DollarSign, 
  Landmark, 
  Percent, 
  Calendar, 
  Clock, 
  ShoppingCart, 
  Receipt 
} from 'lucide-react';

const Wallet = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row transition-colors duration-200 font-sans overflow-hidden">

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen relative">

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 px-4 md:px-8 pb-8 pt-4 overflow-y-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            
            {/* Financial Stats Row */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-bold text-slate-800">Financial Performance</h3>
                  <select className="bg-transparent text-sm font-medium text-slate-500 border-none focus:ring-0 cursor-pointer hover:text-emerald-500 outline-none">
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Year</option>
                  </select>
                </div>

                <button className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95">
                  <WalletIcon size={18} />
                  <span>Withdraw Money</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard 
                  title="Total Earnings" 
                  amount="$12,450.00" 
                  percent="12%" 
                  icon={<DollarSign size={20} className="text-green-600" />}
                  bgIcon="bg-green-50"
                />
                <StatCard 
                  title="Total Profit" 
                  amount="$11,200.00" 
                  percent="15%" 
                  icon={<Landmark size={20} className="text-blue-600" />}
                  bgIcon="bg-blue-50"
                />
                <StatCard 
                  title="Net Commission" 
                  amount="$1,250.00" 
                  percent="2%" 
                  icon={<Percent size={20} className="text-purple-600" />}
                  bgIcon="bg-purple-50"
                />
                
                {/* Today's Earnings - Special Style */}
                <div className="bg-white p-6 rounded-2xl border border-emerald-500/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute right-0 top-0 h-full w-1 bg-emerald-500"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Calendar size={20} className="text-emerald-500" />
                    </div>
                    <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <TrendingUp size={14} className="mr-1" />
                      5%
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Today's Earnings</p>
                  <h4 className="text-3xl font-extrabold tracking-tight text-slate-900">$340.00</h4>
                </div>
              </div>
            </section>

            {/* Operational Stats Row */}
            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Daily Operations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-orange-800">Pending Amount</p>
                    <h4 className="text-2xl font-extrabold text-orange-900">$150.00</h4>
                    <a className="text-xs font-bold text-orange-600 hover:underline mt-1 cursor-pointer">View Details</a>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-orange-500">
                    <Clock size={24} />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-slate-500">Orders Today</p>
                    <h4 className="text-2xl font-extrabold text-slate-900">5</h4>
                    <p className="text-xs text-green-600 font-medium">New orders received</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <ShoppingCart size={24} />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-slate-500">Pending Orders</p>
                    <h4 className="text-2xl font-extrabold text-slate-900">2</h4>
                    <p className="text-xs text-orange-500 font-medium">Awaiting payment</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <Receipt size={24} />
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activity Table */}
            <section className="pb-8">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
                  <button className="text-sm font-bold text-emerald-500 hover:text-emerald-600">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                      <tr>
                        <th className="px-6 py-4">Transaction ID</th>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      <TransactionRow 
                        id="#TRX-9821"
                        service="Home Cleaning - Standard"
                        date="Oct 24, 2023"
                        status="Completed"
                        amount="+$120.00"
                        isPositive={true}
                      />
                      <TransactionRow 
                        id="#TRX-9820"
                        service="Garden Maintenance"
                        date="Oct 24, 2023"
                        status="Completed" 
                        amount="$85.00"
                        isPositive={false}
                      />
                      <TransactionRow 
                        id="#TRX-9819"
                        service="Plumbing Repair"
                        date="Oct 23, 2023"
                        status="Completed"
                        amount="+$220.00"
                        isPositive={true}
                      />
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components

const StatCard = ({ title, amount, percent, icon, bgIcon }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${bgIcon}`}>
        {icon}
      </div>
      <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
        <TrendingUp size={14} className="mr-1" />
        {percent}
      </span>
    </div>
    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
    <h4 className="text-3xl font-extrabold tracking-tight text-slate-900">{amount}</h4>
  </div>
);

const TransactionRow = ({ id, service, date, status, amount, isPositive }) => {
  const statusStyles = "bg-green-100 text-green-800";
  
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 font-medium text-slate-900">{id}</td>
      <td className="px-6 py-4 text-slate-600">{service}</td>
      <td className="px-6 py-4 text-slate-500">{date}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles}`}>
          {status}
        </span>
      </td>
      <td className={`px-6 py-4 text-right font-bold ${isPositive ? 'text-slate-900' : 'text-slate-400'}`}>
        {amount}
      </td>
    </tr>
  );
};

export default Wallet;