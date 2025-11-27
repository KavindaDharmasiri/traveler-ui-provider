import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ReceivedOrders = () => {
  const contentRef = React.useRef(null);
  useScrollAnimation(contentRef, true);

  const orders = [
    { id: '#00123', customer: 'John Doe', item: 'Camping Tent', amount: 1200, date: '2025-09-05', status: 'Pending', statusColor: 'yellow' },
    { id: '#00124', customer: 'Sarah Smith', item: 'Car Rental', amount: 3500, date: '2025-09-06', status: 'Confirmed', statusColor: 'green' },
    { id: '#00125', customer: 'Michael Lee', item: 'Hotel Room (Double)', amount: 2200, date: '2025-09-07', status: 'Cancelled', statusColor: 'red' },
  ];

  const getStatusBadge = (status, color) => {
    const colorMap = {
      green: 'bg-green-100 text-green-700',
      yellow: 'bg-yellow-100 text-yellow-700',
      red: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-3 py-1 text-sm rounded-full font-medium ${colorMap[color]}`}>
        {status}
      </span>
    );
  };

  return (
    <div ref={contentRef} className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-6 animate-on-scroll">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
          Received Orders
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#217964]/10 text-left text-gray-700">
                <th className="px-4 py-3 rounded-l-lg">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Price(Rs.)</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{order.id}</td>
                  <td className="px-4 py-3">{order.customer}</td>
                  <td className="px-4 py-3">{order.item}</td>
                  <td className="px-4 py-3 text-[#217964] font-semibold">{order.amount}</td>
                  <td className="px-4 py-3">{order.date}</td>
                  <td className="px-4 py-3">{getStatusBadge(order.status, order.statusColor)}</td>
                  <td className="px-4 py-3 space-x-2">
                    {order.status === 'Pending' ? (
                      <>
                        <button
                          className="bg-[#217964] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#1a5d4e] transition"
                          onClick={() => console.log('Accept', order.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                          onClick={() => console.log('Decline', order.id)}
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <button
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm cursor-not-allowed"
                        disabled
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReceivedOrders;
