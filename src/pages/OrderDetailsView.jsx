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
                  <p className="text-gray-600">Rs. {item.totalPrice} • {item.rentalDays} days • Qty: {item.qty}</p>
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
              
              {/* Vehicle Details Section */}
              {item.itemObj?.category === "VEHICLES" && item.itemObj?.vehicleDetails && (
                <div className="mb-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <p className="text-sm font-semibold text-teal-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                    Vehicle Details
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-gray-600">Vehicle No:</span>
                      <p className="font-semibold text-gray-800">{item.itemObj.vehicleDetails.vehicleNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Passengers:</span>
                      <p className="font-semibold text-gray-800">{item.itemObj.vehicleDetails.passengerCount}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Condition:</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.itemObj.vehicleDetails.condition === 'AC' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.itemObj.vehicleDetails.condition}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Driver:</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.itemObj.vehicleDetails.driverStatus === 'WITH_DRIVER' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {item.itemObj.vehicleDetails.driverStatus === 'WITH_DRIVER' ? 'With Driver' : 'Self Drive'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">KM/Day:</span>
                      <p className="font-semibold text-gray-800">{item.itemObj.vehicleDetails.kmPerDay} km</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Extra KM:</span>
                      <p className="font-semibold text-gray-800">{item.itemObj.currency} {item.itemObj.vehicleDetails.pricePerExtraKm}/km</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Waiting:</span>
                      <p className="font-semibold text-gray-800">{item.itemObj.currency} {item.itemObj.vehicleDetails.waitingChargePerNight}/night</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Hotel Details Section */}
              {item.itemObj?.category === "HOTELS" && item.itemObj?.hotelDetails && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Hotel Details
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="md:col-span-2">
                      <span className="text-gray-600">Address:</span>
                      <p className="font-semibold text-gray-800">{item.itemObj.hotelDetails.address}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Max Guests:</span>
                      <p className="font-semibold text-gray-800">{item.itemObj.hotelDetails.maxGuests} guests</p>
                    </div>
                    {item.itemObj.hotelDetails.roomNumber && (
                      <div>
                        <span className="text-gray-600">Room Number:</span>
                        <p className="font-semibold text-gray-800">{item.itemObj.hotelDetails.roomNumber}</p>
                      </div>
                    )}
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

export default OrderDetailsView;