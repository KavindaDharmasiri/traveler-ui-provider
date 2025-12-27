import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faFilter, faTimes, faStore, faMapPin } from '@fortawesome/free-solid-svg-icons';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import axiosInstance from '../api/axiosInstance';

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

// Order Card Component
const OrderCard = ({ order, onViewDetails, onUpdateStatus }) => {
  const totalPrice = order.items?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0;
  const itemCount = order.items?.length || 0;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{order.orderCode}</h3>
            <span className="text-sm text-gray-500">• {order.customerName}</span>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
            <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
            <span>Rs. {totalPrice.toFixed(2)}</span>
          </div>
          
          {/* Item previews */}
          <div className="flex flex-wrap gap-2">
            {order.items?.slice(0, 3).map((item, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {item.itemObj?.name || `Item ${item.item}`}
              </span>
            ))}
            {itemCount > 3 && (
              <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                +{itemCount - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            onClick={() => onViewDetails(order.orderCode)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
          >
            View Details
          </button>
          
          {order.items?.some(item => item.status === 'PENDING') && (
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  if (!order.orderId) {
                    // Fetch order details to get the order ID
                    try {
                      const response = await axiosInstance.get(`core/api/v1/order/code/${order.orderCode}`);
                      if (response.data && response.data.id) {
                        onUpdateStatus(response.data.id, null, 'ACCEPTED');
                      }
                    } catch (error) {
                      console.error('Error fetching order ID:', error);
                    }
                  } else {
                    onUpdateStatus(order.orderId, null, 'ACCEPTED');
                  }
                }}
                className="bg-[#217964] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1a5d4e] transition"
              >
                Accept All
              </button>
              <button
                onClick={async () => {
                  if (!order.orderId) {
                    // Fetch order details to get the order ID
                    try {
                      const response = await axiosInstance.get(`core/api/v1/order/code/${order.orderCode}`);
                      if (response.data && response.data.id) {
                        onUpdateStatus(response.data.id, null, 'CANCELLED');
                      }
                    } catch (error) {
                      console.error('Error fetching order ID:', error);
                    }
                  } else {
                    onUpdateStatus(order.orderId, null, 'CANCELLED');
                  }
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
              >
                Reject All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Order Details View Component
const OrderDetailsView = ({ order, onBack, onUpdateStatus }) => {
  const [imageMapper, setImageMapper] = useState({});

  const fetchImages = async (imageUuids) => {
    const mapper = {};
    for (const uuid of imageUuids) {
      try {
        const response = await axiosInstance.get(`storage/files/download/${uuid}`, {
          responseType: 'blob'
        });
        mapper[uuid] = URL.createObjectURL(response.data);
      } catch (error) {
        console.error(`Error fetching image ${uuid}:`, error);
      }
    }
    setImageMapper(mapper);
  };

  useEffect(() => {
    const allImageUuids = [];
    if (order?.items) {
      order.items.forEach(item => {
        if (item.itemObj?.images) {
          allImageUuids.push(...item.itemObj.images);
        }
      });
    }
    if (allImageUuids.length > 0) {
      fetchImages([...new Set(allImageUuids)]);
    }
  }, [order]);

  const totalPrice = order?.items?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg">
        <button 
          onClick={onBack} 
          className="mb-6 flex items-center text-[#217964] hover:text-[#399e8a] font-medium"
        >
          ← Back to Orders List
        </button>

        <header className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Order Details: {order?.orderCode}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Customer: {order?.customerName}
          </p>
          <p className="text-2xl font-extrabold text-[#217964]">
            Total: Rs. {totalPrice.toFixed(2)}
          </p>
        </header>

        <div className="space-y-6">
          {order?.items?.map((item) => (
            <div key={item.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {item.itemObj?.name || `Item ${item.item}`}
                  </h3>
                  <p className="text-gray-600">Rs. {item.totalPrice} • {item.rentalDays} days</p>
                  <p className="text-sm text-gray-500">
                    {item.pickupDate} to {item.returnDate}
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(item.status)}
                  
                  {item.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdateStatus(order.id, item.id, 'ACCEPTED')}
                        className="bg-[#217964] text-white px-3 py-1 rounded text-sm hover:bg-[#1a5d4e] transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => onUpdateStatus(order.id, item.id, 'CANCELLED')}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Item Images */}
              {item.itemObj?.images && item.itemObj.images.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Item Images</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {item.itemObj.images.map((uuid, index) => (
                      <img
                        key={uuid}
                        src={imageMapper[uuid] || 'https://via.placeholder.com/100'}
                        alt={`${item.itemObj.name} ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border border-gray-200 flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Item Description */}
              {item.itemObj?.description && (
                <p className="text-gray-700 text-sm">{item.itemObj.description}</p>
              )}
            </div>
          ))}
        </div>
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
