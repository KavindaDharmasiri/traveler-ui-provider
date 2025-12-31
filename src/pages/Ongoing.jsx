import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  MessageSquare, 
  Home, 
  Grid, 
  ShoppingBag, 
  User, 
  HelpCircle, 
  Settings, 
  LogOut, 
  Map, 
  Compass, 
  Plane, 
  CheckCircle,
  Ticket,
  Calendar
} from 'lucide-react';

const Ongoing = () => {
  const [activeTab, setActiveTab] = useState('ongoing');

  // Mock Data - Renamed to Travel Context
  const activeOrders = [
    {
      id: "#TRV-24891",
      title: "Bali Island Hopping Adventure",
      status: "In Progress",
      startDate: "Oct 24, 2023",
      endDate: "Nov 15, 2023",
      price: "$1,250.00",
      user: "@john_doe",
      items: 2,
      icon: <Map className="w-6 h-6" />,
      color: "blue"
    },
    {
      id: "#TRV-24855",
      title: "Kyoto Cultural Heritage Tour",
      status: "In Progress", // Changed from Awaiting Review
      startDate: "Oct 28, 2023",
      endDate: "Oct 30, 2023",
      price: "$850.00",
      user: "@sarah_smith",
      items: 1,
      icon: <Compass className="w-6 h-6" />,
      color: "purple"
    },
    {
      id: "#TRV-24802",
      title: "Paris Weekend Getaway",
      status: "In Progress", // Changed from Pending Info
      startDate: "Oct 30, 2023",
      endDate: "Nov 05, 2023",
      price: "$450.00",
      user: "@mike_r",
      items: 1,
      icon: <Plane className="w-6 h-6" />,
      color: "orange"
    }
  ];

  const pastOrders = [
    {
      id: "#TRV-24750",
      title: "New York City Pass",
      status: "Completed",
      startDate: "Oct 10, 2023",
      endDate: "Oct 12, 2023",
      price: "$180.00",
      user: "@alex_t",
      items: 3,
      icon: <CheckCircle className="w-6 h-6" />,
      color: "gray"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-200">

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Title Section */}
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Received Orders</h1>
                <p className="mt-2 text-gray-500">Track your active trips and view your travel history.</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-gray-500">{activeOrders.length} Active Orders</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button 
                  onClick={() => setActiveTab('ongoing')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'ongoing' 
                    ? 'border-emerald-600 text-emerald-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Ongoing Orders
                </button>
                <button 
                  onClick={() => setActiveTab('past')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'past' 
                    ? 'border-emerald-600 text-emerald-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Past Orders
                </button>
              </nav>
            </div>

            {/* Active Orders Grid */}
            <section className={activeTab === 'ongoing' ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 gap-6">
                {activeOrders.map((order) => (
                  <OrderCard key={order.id} data={order} isActive={true} />
                ))}
              </div>
            </section>

             {/* Divider / Recently Completed Label */}
             <div className="relative py-4">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-gray-50 dark:bg-gray-900 text-lg font-medium text-gray-500">
                    Recently Completed
                  </span>
                </div>
              </div>

            {/* Past Orders Grid */}
            <section>
              <div className="opacity-75 hover:opacity-100 transition-opacity duration-200">
                <div className="grid grid-cols-1 gap-6">
                  {pastOrders.map((order) => (
                    <OrderCard key={order.id} data={order} isActive={false} />
                  ))}
                </div>
              </div>
            </section>

            <div className="flex justify-center pt-4 pb-8">
              <button className="text-sm text-gray-500 hover:text-emerald-600 font-medium transition-colors">
                Load older orders
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

// --- Sub Components ---

const NavItem = ({ icon, text, active = false }) => (
  <a 
    href="#" 
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
      active 
      ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
  >
    <span className={active ? '' : 'group-hover:text-emerald-600 transition-colors'}>
      {icon}
    </span>
    <span className="font-medium">{text}</span>
  </a>
);

const OrderCard = ({ data, isActive }) => {
  // Color mapping for the icon background
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    gray: "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${!isActive && 'grayscale opacity-90'}`}>
      
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colorClasses[data.color] || colorClasses.blue}`}>
            {data.icon}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${!isActive ? 'line-through decoration-gray-400' : ''}`}>
              {data.title}
            </h3>
            <p className="text-sm text-gray-500">Order ID: {data.id}</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {data.status}
        </span>
      </div>

      {/* Card Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <DetailItem label="Start Date" value={data.startDate} />
        <DetailItem label="Ending Date" value={data.endDate} />
        <DetailItem label="Total Charge" value={data.price} isPrice={true} />
        
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</p>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
               <User size={12} className="text-gray-400" />
            </div>
            <p className="text-sm font-semibold">{data.user}</p>
          </div>
        </div>
      </div>

      {/* Footer - Redesigned Item Count (Button Removed) */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
            <Ticket size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {data.items} {data.items === 1 ? 'Booking' : 'Bookings'}
            </span>
        </div>
        
        {/* Optional: Add a subtle text label or leave empty since button is gone */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
             <Calendar size={14} />
             <span>Updated today</span>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, isPrice = false }) => (
  <div className="space-y-1">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
    <p className={`text-sm font-semibold ${isPrice ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>
      {value}
    </p>
  </div>
);

export default Ongoing;