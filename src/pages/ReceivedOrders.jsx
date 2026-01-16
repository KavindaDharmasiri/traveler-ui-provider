import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faFilter, faTimes, faStore, faMapPin } from '@fortawesome/free-solid-svg-icons';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import axiosInstance from '../api/axiosInstance';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import OrderDetailsView from './OrderDetailsView';
import OrderCard from './OrderCard';


const ReceivedOrders = () => {
  const contentRef = React.useRef(null);
  useScrollAnimation(contentRef, true);
  
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('core/api/v1/order');
        
        // Group items by order code
        let orders = [];
        const responseData = response.data || {};
        const orderMap = new Map();

        Object.keys(responseData).forEach((tenantId) => {
          const tenantData = responseData[tenantId];
          
          if (tenantData && typeof tenantData === 'object') {
            Object.keys(tenantData).forEach((customerName) => {
              const items = tenantData[customerName];
              if (Array.isArray(items)) {
                items.forEach(item => {
                  const orderCode = item.orderCode;
                  if (!orderMap.has(orderCode)) {
                    orderMap.set(orderCode, {
                      id: orderCode,
                      orderCode: orderCode,
                      customerName: item.customerName,
                      status: item.status,
                      clientTenant: item.clientTenant,
                      groupTenant: item.groupTenant,
                      groupName: item.groupName,
                      orderId: null, // Will be set from first item
                      items: []
                    });
                  }
                  const orderData = orderMap.get(orderCode);
                  // orderId will be set when we fetch order details
                  orderData.items.push(item);
                });
              }
            });
          }
        });

        orders = Array.from(orderMap.values());
        setOrderData(orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrderData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (!filterStatus) return orderData;
    return orderData.filter((order) => {
      return order.items && order.items.some(item => 
        (item.status || "").toLowerCase() === filterStatus.toLowerCase()
      );
    });
  }, [filterStatus, orderData]);

  const statuses = ["Pending", "Cancelled"];

  // Fetch order details
  useEffect(() => {
    if (selectedOrderId === null || selectedOrderId === undefined) {
      setSelectedOrderDetails(null);
      return;
    }

    const fetchOrderDetails = async () => {
      setLoadingDetails(true);
      try {
        const response = await axiosInstance.get(`core/api/v1/order/code/${selectedOrderId}`);
        setSelectedOrderDetails(response.data);
        
        // Update the order data with the correct order ID
        if (response.data && response.data.id) {
          setOrderData(prevOrders => 
            prevOrders.map(order => 
              order.orderCode === selectedOrderId 
                ? { ...order, orderId: response.data.id }
                : order
            )
          );
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setSelectedOrderDetails(null);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchOrderDetails();
  }, [selectedOrderId]);

  // Update order status
  const updateOrderStatus = async (orderId, itemId, status) => {
    try {
      const itemIdParam = itemId === null ? 'null' : itemId;
      await axiosInstance.put(`core/api/v1/order/updateStatusSingle/${orderId}/${itemIdParam}/${status}`);
      // Refresh orders
      window.location.reload();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const colorMap = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      ACCEPTED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
      COMPLETED: 'bg-blue-100 text-blue-700',
    };
    return (
      <span className={`px-3 py-1 text-sm rounded-full font-medium ${colorMap[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  // Render order details view
  if (selectedOrderId !== null) {
    if (loadingDetails) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow">Loading order details...</div>
        </div>
      );
    }

    if (selectedOrderDetails) {
      return (
        <OrderDetailsView
          order={selectedOrderDetails}
          onBack={() => {
            setSelectedOrderId(null);
            setSelectedOrderDetails(null);
          }}
          onUpdateStatus={updateOrderStatus}
        />
      );
    }
    
    // If no details found, go back to list
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow">
          <p>Order not found.</p>
          <button 
            onClick={() => setSelectedOrderId(null)}
            className="mt-4 bg-[#217964] text-white px-4 py-2 rounded"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={contentRef} className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-6 animate-on-scroll">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center flex items-center justify-center gap-3">
          <FontAwesomeIcon icon={faClipboardList} className="text-[#217964]" />
          Received Orders
        </h2>

        {/* Filter Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex items-center text-gray-600 font-semibold text-lg">
            <FontAwesomeIcon icon={faFilter} className="mr-2 text-blue-500" />
            Filter by Status:
          </div>

          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 
                  ${
                    filterStatus === status
                      ? "bg-[#217964] text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {status}
              </button>
            ))}

            {filterStatus && (
              <button
                onClick={() => setFilterStatus(null)}
                className="px-3 py-2 text-sm font-medium rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-1" size="sm" />
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center p-12">
            <h3 className="text-xl font-semibold text-gray-700">Loading orders...</h3>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center p-12">
            <h3 className="text-xl font-semibold text-gray-700">
              No {filterStatus} Orders Found
            </h3>
            <p className="mt-2 text-gray-500">Try clearing the filter to see all orders.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.orderCode}
                order={order}
                onViewDetails={(id) => setSelectedOrderId(id)}
                onUpdateStatus={updateOrderStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


function getStatusBadge(status) {
  const colorMap = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    ACCEPTED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`px-3 py-1 text-sm rounded-full font-medium ${colorMap[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}

export default ReceivedOrders;
