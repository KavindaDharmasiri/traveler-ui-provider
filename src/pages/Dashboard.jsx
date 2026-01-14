import React from 'react';
import { DollarSign, PackageOpen, Users, TrendingUp, Calendar, CircleUser } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation'; // Pathing fixed

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="p-5 bg-white rounded-xl shadow-lg flex items-center justify-between animate-on-scroll transform opacity-0 translate-y-4">
    <div className="flex flex-col">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
      <Icon size={24} className={color.replace('bg-', 'text-')} />
    </div>
  </div>
);

const Dashboard = () => {
  const contentRef = React.useRef(null);
  useScrollAnimation(contentRef, true);

  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  
  const today = new Date();
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
  const currentDate = today.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Create array with empty cells for proper day alignment
  const calendarDays = [];
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div ref={contentRef} className="p-6 md:p-2 min-h-screen overflow-hidden">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Revenue" value="$45,231" icon={DollarSign} color="text-green-600 bg-green-100" />
        <StatCard title="New Orders" value="125" icon={PackageOpen} color="text-blue-600 bg-blue-100" />
        <StatCard title="Total Users" value="2,430" icon={Users} color="text-yellow-600 bg-yellow-100" />
        <StatCard title="Conversion Rate" value="12.5%" icon={TrendingUp} color="text-red-600 bg-red-100" />
      </div>

      {/* Main Content Area */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg animate-on-scroll transform opacity-0 translate-y-4 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Calendar</h3>
          <div className="h-96 bg-gradient-to-br from-[#217964]/5 via-[#217964]/10 to-[#217964]/15 rounded-xl border border-[#217964]/20 shadow-inner overflow-hidden">
            <div className="p-4 h-full relative">
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h4 className="font-bold text-[#217964] text-lg">{monthName} {currentYear}</h4>
                <div className="flex space-x-2">
                  <button onClick={prevMonth} className="px-4 py-2 text-sm bg-gradient-to-r from-[#217964] to-[#217964]/80 text-white rounded-lg hover:scale-110 transition-all duration-300 shadow-lg">‹</button>
                  <button onClick={nextMonth} className="px-4 py-2 text-sm bg-gradient-to-r from-[#217964] to-[#217964]/80 text-white rounded-lg hover:scale-110 transition-all duration-300 shadow-lg">›</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm relative z-10">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-3 font-bold text-[#217964] border-b-2 border-[#217964]/30">{day}</div>
                ))}
                {calendarDays.map((day, i) => (
                  <div key={i} className={`p-3 rounded-lg cursor-pointer transition-all duration-300 font-medium ${
                    day === null 
                      ? '' 
                      : day === currentDate && currentMonth === today.getMonth() && currentYear === today.getFullYear()
                        ? 'bg-gradient-to-br from-[#217964] to-[#217964]/80 text-white shadow-xl scale-110' 
                        : 'text-gray-700 hover:text-[#217964] hover:scale-110 hover:bg-[#217964]/20 hover:shadow-lg'
                  }`}>
                    {day || ''}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg animate-on-scroll transform opacity-0 translate-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <DollarSign size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">New order #1004 received</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <CircleUser size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Jane Doe registered a new account</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Service 'City Guide' updated</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg animate-on-scroll transform opacity-0 translate-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Products</h3>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center justify-between">
              <span>Premium Mountain Bike Rental</span>
              <span className="font-semibold text-green-600">$1200</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Guided 3-Day Hiking Tour</span>
              <span className="font-semibold text-green-600">$900</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Luxury City Transfer</span>
              <span className="font-semibold text-green-600">$850</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;