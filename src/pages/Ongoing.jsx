import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import jsPDF from 'jspdf';
import travelerLogo from '../assets/traveler_logo.png';
import completeImage from '../assets/complete.png';
import cancelImage from '../assets/cancel.png';
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
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageMapper, setImageMapper] = useState({});

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchImages = async (imageUuids) => {
    const mapper = {};
    for (const uuid of imageUuids) {
      try {
        const response = await axiosInstance.get(
          `storage/files/download/${uuid}`,
          { responseType: 'blob' }
        );
        mapper[uuid] = URL.createObjectURL(response.data);
      } catch (error) {
        console.error(`Error fetching image ${uuid}:`, error);
      }
    }
    setImageMapper(prev => ({ ...prev, ...mapper }));
  };

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('core/api/v1/order/past');
      const orders = response.data || [];
      setAllOrders(orders);

      const allImageUuids = [];
      orders.forEach(order => {
        order.items?.forEach(item => {
          if (item.itemObj?.images) {
            allImageUuids.push(...item.itemObj.images);
          }
        });
      });

      if (allImageUuids.length > 0) {
        await fetchImages([...new Set(allImageUuids)]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  /* ---------------- FILTERING ---------------- */

  const ongoingOrders = allOrders
    .filter(order => order.status === 'ACCEPTED' || order.status === 'PAYED')
    .sort((a, b) => {
      if (a.status === 'PAYED' && b.status !== 'PAYED') return -1;
      if (b.status === 'PAYED' && a.status !== 'PAYED') return 1;
      return 0;
    });

  const pastOrders = allOrders.filter(
    order => order.status !== 'ACCEPTED' && order.status !== 'PAYED'
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* HEADER */}
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Received Orders
                </h1>
                <p className="mt-2 text-gray-500">
                  Track your active trips and view your travel history.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-gray-500">
                  {ongoingOrders.length} Active Orders
                </span>
              </div>
            </div>

            {/* TABS */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {['ongoing', 'past'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 text-sm font-medium ${
                      activeTab === tab
                        ? 'border-emerald-600 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab === 'ongoing' ? 'Ongoing Orders' : 'Past Orders'}
                  </button>
                ))}
              </nav>
            </div>

            {/* ONGOING */}
            {activeTab === 'ongoing' && (
              <section>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-b-2 border-emerald-600 rounded-full" />
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {ongoingOrders.length ? (
                      ongoingOrders.map(order => (
                        <PastOrderCard
                          key={order.id}
                          data={order}
                          isOngoing
                          onClick={() => handleOrderClick(order)}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Map className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        No ongoing orders found
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* PAST */}
            {activeTab === 'past' && (
              <section>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-b-2 border-emerald-600 rounded-full" />
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {pastOrders.length ? (
                      pastOrders.map(order => (
                        <PastOrderCard
                          key={order.id}
                          data={order}
                          onClick={() => handleOrderClick(order)}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <CheckCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        No past orders found
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

          </div>
        </div>
      </main>

      {/* MODAL */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border">
            <div className="p-6 border-b flex justify-between">
              <h2 className="text-2xl font-bold">
                Order Details – {selectedOrder.orderCode}
              </h2>
              <button onClick={closeModal}>✕</button>
            </div>

            <div className="p-6 space-y-4">
              {selectedOrder.items?.map(item => (
                <div key={item.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold">{item.itemObj?.name}</h4>
                  <p className="text-sm text-gray-600">
                    Rs. {item.totalPrice}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

/* ---------------- CARD ---------------- */

const PastOrderCard = ({ data, isOngoing, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border rounded-xl p-6 shadow hover:shadow-md cursor-pointer"
    >
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold text-lg">
            Order {data.orderCode}
          </h3>
          <p className="text-sm text-gray-500">
            Customer: {data.customerName}
          </p>
        </div>
        <span className="px-3 py-1 text-xs rounded-full bg-gray-100">
          {data.status}
        </span>
      </div>
    </div>
  );
};

export default Ongoing;
