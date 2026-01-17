import React from 'react'

export default function OrderCard({ order, onViewDetails, onUpdateStatus }) {
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
          <Link to={`/orders/view-details`}>
          <button
            onClick={() => onViewDetails(order.orderCode)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
          >
            View Details
          </button>
          </Link>
          
          {order.items?.some(item => item.status === 'PENDING') && (
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  const result = await Swal.fire({
                    title: 'Accept All Items?',
                    text: 'Are you sure you want to accept all items in this order?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#217964',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, Accept All'
                  });
                  
                  if (result.isConfirmed) {
                    if (!order.orderId) {
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
                  }
                }}
                className="bg-[#217964] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1a5d4e] transition"
              >
                Accept All
              </button>
              <button
                onClick={async () => {
                  const result = await Swal.fire({
                    title: 'Reject All Items?',
                    text: 'Are you sure you want to reject all items in this order?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#6b7280',
                    confirmButtonText: 'Yes, Reject All'
                  });
                  
                  if (result.isConfirmed) {
                    if (!order.orderId) {
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
}
