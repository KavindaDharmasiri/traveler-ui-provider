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

  // Fetch all orders on component mount
  useEffect(() => {
    fetchAllOrders();
  }, []);

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
    setImageMapper(prev => ({...prev, ...mapper}));
  };

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('core/api/v1/order/past');
      const orders = response.data || [];
      setAllOrders(orders);
      
      // Fetch all images for all items
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

  const downloadPDF = async (order) => {
    const doc = new jsPDF();
    const currentYear = new Date().getFullYear();
    
    // Enhanced Header with PNG logo
    doc.setFillColor(33, 121, 100); // Original green color
    doc.rect(0, 0, 210, 30, 'F');
    
    // Add white flight icon text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('✈', 20, 18);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Professional Travel & Rental Services', 120, 12);
    doc.text('Order Management System', 120, 18);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Order Details Section with enhanced styling
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('ORDER INVOICE', 20, 45);
    
    // Order info in a styled box
    doc.setFillColor(248, 250, 252);
    doc.rect(20, 50, 170, 40, 'F');
    doc.setDrawColor(23, 121, 100);
    doc.setLineWidth(0.5);
    doc.rect(20, 50, 170, 40);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Order Information', 25, 60);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`Order Code: ${order.orderCode}`, 25, 68);
    doc.text(`Customer Name: ${order.customerName}`, 25, 75);
    doc.text(`Order Status: ${order.status}`, 25, 82);
    
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 120, 68);
    doc.text(`Client ID: ${order.customerName}`, 120, 75);
    doc.text(`Total Items: ${order.items?.length || 0}`, 120, 82);
    
    // Items Section with enhanced styling
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('ORDER ITEMS DETAILS', 20, 105);
    
    // Status stamp behind order items
    const orderStatus = order.status || 'COMPLETE';
    
    let yPos = 115;
    let totalAmount = 0;
    
    for (let index = 0; index < (order.items?.length || 0); index++) {
      const item = order.items[index];
      totalAmount += parseFloat(item.totalPrice || 0);
      
      // Item header with gradient-like effect
      doc.setFillColor(33, 121, 100);
      doc.rect(20, yPos - 5, 170, 15, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`ITEM ${index + 1}: ${item.itemObj?.name || 'Item ' + item.item}`, 25, yPos + 3);
      
      // Add item image if available
      if (item.itemObj?.images && item.itemObj.images.length > 0) {
        const imageUuid = item.itemObj.images[0];
        if (imageMapper[imageUuid]) {
          try {
            doc.addImage(imageMapper[imageUuid], 'JPEG', 150, yPos - 3, 20, 15);
          } catch (error) {
            console.log('Could not add image to PDF:', error);
          }
        }
      }
      
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      yPos += 20;
      
      // Item details in organized sections
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({opacity: 0.7}));
      doc.setFillColor(250, 250, 250);
      doc.rect(20, yPos, 170, 35, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(20, yPos, 170, 35);
      doc.restoreGraphicsState();
      
      doc.setFontSize(10);
      // Left column
      doc.text(`Category: ${item.itemObj?.category || 'N/A'}`, 25, yPos + 8);
      doc.text(`Quantity: ${item.qty}`, 25, yPos + 15);
      doc.text(`Rental Days: ${item.rentalDays}`, 25, yPos + 22);
      doc.text(`Status: ${item.status}`, 25, yPos + 29);
      
      // Right column
      doc.setFont(undefined, 'bold');
      doc.text(`Price: Rs. ${item.totalPrice}`, 120, yPos + 8);
      doc.setFont(undefined, 'normal');
      doc.text(`Pickup: ${item.pickupDate}`, 120, yPos + 15);
      doc.text(`Return: ${item.returnDate}`, 120, yPos + 22);
      
      yPos += 40;
      
      // Vehicle/Hotel Details in colored boxes
      if (item.itemObj?.category === 'VEHICLES' && item.itemObj?.vehicleDetails) {
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({opacity: 0.7}));
        doc.setFillColor(220, 252, 231); // Light green
        doc.rect(25, yPos, 160, 25, 'F');
        doc.setDrawColor(34, 197, 94);
        doc.rect(25, yPos, 160, 25);
        doc.restoreGraphicsState();
        
        doc.setFont(undefined, 'bold');
        doc.text('VEHICLE DETAILS', 30, yPos + 8);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        doc.text(`Vehicle: ${item.itemObj.vehicleDetails.vehicleNumber}`, 30, yPos + 15);
        doc.text(`Passengers: ${item.itemObj.vehicleDetails.passengerCount}`, 90, yPos + 15);
        doc.text(`Condition: ${item.itemObj.vehicleDetails.condition}`, 30, yPos + 20);
        doc.text(`Driver: ${item.itemObj.vehicleDetails.driverStatus}`, 90, yPos + 20);
        yPos += 30;
      } else if (item.itemObj?.category === 'HOTELS' && item.itemObj?.hotelDetails) {
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({opacity: 0.7}));
        doc.setFillColor(219, 234, 254); // Light blue
        doc.rect(25, yPos, 160, 20, 'F');
        doc.setDrawColor(59, 130, 246);
        doc.rect(25, yPos, 160, 20);
        doc.restoreGraphicsState();
        
        doc.setFont(undefined, 'bold');
        doc.text('HOTEL DETAILS', 30, yPos + 8);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        doc.text(`Address: ${item.itemObj.hotelDetails.address}`, 30, yPos + 15);
        doc.text(`Max Guests: ${item.itemObj.hotelDetails.maxGuests}`, 130, yPos + 15);
        yPos += 25;
      }
      
      yPos += 10;
      
      // Add new page if needed
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
    }
    
    // Total Amount Section
    doc.setFillColor(33, 121, 100);
    doc.rect(120, yPos, 70, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`TOTAL: Rs. ${totalAmount.toFixed(2)}`, 125, yPos + 12);
    
    // Logo with status stamp near total
    doc.addImage(travelerLogo, 'PNG', 125, yPos + 25, 40, 15);
    
    if (orderStatus === 'CANCELLED') {
      doc.setFillColor(220, 38, 38); // Red
      doc.circle(170, yPos + 32, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text('CANCELLED', 155, yPos + 34);
    }
    
    // Enhanced Footer on all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Add complete image watermark to center of each page
      if (orderStatus === 'COMPLETE' || orderStatus === 'COMPLETED') {
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({opacity: 0.5}));
        doc.addImage(completeImage, 'PNG', 60, 140, 90, 90);
        doc.restoreGraphicsState();
      } else if (orderStatus === 'CANCELLED') {
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({opacity: 0.5}));
        doc.addImage(cancelImage, 'PNG', 60, 140, 90, 90);
        doc.restoreGraphicsState();
      }
      
      // Footer background
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 275, 210, 22, 'F');
      doc.setDrawColor(23, 121, 100);
      doc.line(0, 275, 210, 275);
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('This is an official document generated by Traveler Management System', 20, 283);
      doc.text(`Confidential & Proprietary | © ${currentYear} Traveler Inc. All rights reserved.`, 20, 288);
      doc.text('For support contact your service provider', 20, 293);
      
      doc.setTextColor(33, 121, 100);
      doc.setFont(undefined, 'bold');
      doc.text(`Page ${i}/${pageCount}`, 170, 283);
      doc.setFont(undefined, 'normal');
      doc.text(`${new Date().toLocaleString()}`, 155, 288);
    }
    
    // Save PDF with enhanced filename
    doc.save(`Traveler-Invoice-${order.orderCode}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Filter orders based on status
  const ongoingOrders = allOrders.filter(order => 
    order.status === 'ACCEPTED' || order.status === 'PAYED'
  ).sort((a, b) => {
    // PAYED orders first
    if (a.status === 'PAYED' && b.status !== 'PAYED') return -1;
    if (b.status === 'PAYED' && a.status !== 'PAYED') return 1;
    return 0;
  });
  
  const pastOrders = allOrders.filter(order => 
    order.status !== 'ACCEPTED' && order.status !== 'PAYED'
  );

  // Mock Data - Renamed to Travel Context
  const activeOrders = [];

  const pastOrdersData = [];

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
                <span className="text-gray-500">{ongoingOrders.length} Active Orders</span>
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

            {/* Ongoing Orders Grid */}
            <section className={activeTab === 'ongoing' ? 'block' : 'hidden'}>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {ongoingOrders.length > 0 ? (
                    ongoingOrders.map((order) => (
                      <PastOrderCard key={order.id} data={order} isOngoing={true} onClick={() => handleOrderClick(order)} onDownloadPDF={null} />
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Map className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No ongoing orders found</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Past Orders Grid */}
            <section className={activeTab === 'past' ? 'block' : 'hidden'}>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {pastOrders.length > 0 ? (
                    pastOrders.map((order) => (
                      <PastOrderCard key={order.id} data={order} isOngoing={false} onClick={() => handleOrderClick(order)} onDownloadPDF={() => downloadPDF(order)} />
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No past orders found</p>
                    </div>
                  )}
                </div>
              )}
            </section>

             {/* Divider / Recently Completed Label - Only show if there are ongoing orders */}
             {ongoingOrders.length > 0 && (
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
             )}

            {/* Mock Past Orders Grid - Only show on ongoing tab and if there are ongoing orders */}
            {activeTab === 'ongoing' && ongoingOrders.length > 0 && pastOrdersData.length > 0 && (
              <section>
                <div className="opacity-75 hover:opacity-100 transition-opacity duration-200">
                  <div className="grid grid-cols-1 gap-6">
                    {pastOrdersData.map((order) => (
                      <OrderCard key={order.id} data={order} isActive={false} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            <div className="flex justify-center pt-4 pb-8">
              <button className="text-sm text-gray-500 hover:text-emerald-600 font-medium transition-colors">
                Load older orders
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-200 dark:border-gray-600">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Order Details - {selectedOrder.orderCode}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Order Information</h3>
                  <p><span className="font-medium">Customer:</span> {selectedOrder.customerName}</p>
                  <p><span className="font-medium">Status:</span> {selectedOrder.status}</p>
                  {/*<p><span className="font-medium">Client Tenant:</span> {selectedOrder.clientTenant}</p>*/}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-4">Order Items ({selectedOrder.items?.length || 0})</h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={item.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      {/* Item Images */}
                      {item.itemObj?.images && item.itemObj.images.length > 0 && (
                        <div className="mb-4">
                          <div className="flex gap-2 overflow-x-auto">
                            {item.itemObj.images.map((uuid, imgIndex) => (
                              <img
                                key={uuid}
                                src={imageMapper[uuid] || 'https://via.placeholder.com/100'}
                                alt={`${item.itemObj.name} ${imgIndex + 1}`}
                                className="w-20 h-20 object-cover rounded border border-gray-200 flex-shrink-0"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold">{item.itemObj?.name || `Item ${item.item}`}</h4>
                          <p className="text-sm text-gray-600">{item.itemObj?.description}</p>
                          <p className="text-sm"><span className="font-medium">Category:</span> {item.itemObj?.category}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Status:</span> 
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${
                              item.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </p>
                          <p><span className="font-medium">Quantity:</span> {item.qty}</p>
                          <p><span className="font-medium">Rental Days:</span> {item.rentalDays}</p>
                          <p><span className="font-medium">Total Price:</span> Rs. {item.totalPrice}</p>
                          <p><span className="font-medium">Pickup:</span> {item.pickupDate}</p>
                          <p><span className="font-medium">Return:</span> {item.returnDate}</p>
                        </div>
                      </div>
                      
                      {/* Vehicle Details */}
                      {item.itemObj?.category === 'VEHICLES' && item.itemObj?.vehicleDetails && (
                        <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                          <h5 className="font-semibold text-teal-800 mb-2">Vehicle Details</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div><span className="font-medium">Vehicle:</span> {item.itemObj.vehicleDetails.vehicleNumber}</div>
                            <div><span className="font-medium">Passengers:</span> {item.itemObj.vehicleDetails.passengerCount}</div>
                            <div><span className="font-medium">Condition:</span> {item.itemObj.vehicleDetails.condition}</div>
                            <div><span className="font-medium">Driver:</span> {item.itemObj.vehicleDetails.driverStatus}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Hotel Details */}
                      {item.itemObj?.category === 'HOTELS' && item.itemObj?.hotelDetails && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-semibold text-blue-800 mb-2">Hotel Details</h5>
                          <div className="text-xs space-y-1">
                            <div><span className="font-medium">Address:</span> {item.itemObj.hotelDetails.address}</div>
                            <div><span className="font-medium">Max Guests:</span> {item.itemObj.hotelDetails.maxGuests}</div>
                            {item.itemObj.hotelDetails.roomNumber && (
                              <div><span className="font-medium">Room:</span> {item.itemObj.hotelDetails.roomNumber}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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

const PastOrderCard = ({ data, isOngoing = false, onClick, onDownloadPDF }) => {
  const getStatusColor = (status) => {
    if (status === 'ACCEPTED') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (status === 'CANCELLED') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    if (status === 'COMPLETED') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getIconColor = () => {
    if (isOngoing) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    return 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400';
  };

  const getCardBackground = () => {
    if (isOngoing && data.status === 'PAYED') return 'bg-emerald-50 border-emerald-200 shadow-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800';
    if (isOngoing) return 'bg-white dark:bg-gray-800';
    if (data.status === 'CANCELLED') return 'bg-red-50 dark:bg-red-900/10';
    if (data.status === 'COMPLETED') return 'bg-green-50 dark:bg-green-900/10';
    return 'bg-gray-800 dark:bg-gray-900';
  };

  const handleCardClick = (e) => {
    // Don't trigger card click if button was clicked
    if (e.target.tagName === 'BUTTON') return;
    onClick();
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    onDownloadPDF();
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`${getCardBackground()} border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
    >
      
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getIconColor()}`}>
            {isOngoing ? <Map className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${!isOngoing ? 'line-through decoration-gray-400' : ''}`}>
              Order {data.orderCode}
            </h3>
            <p className="text-sm text-gray-500">Customer: {data.customerName}</p>
            {data.status === 'ACCEPTED' && (
              <div className="mt-2 px-3 py-1 bg-yellow-100 border border-yellow-300 rounded-lg shadow-lg animate-pulse">
                <p className="text-xs font-semibold text-yellow-800 flex items-center gap-1">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></span>
                  Payment is pending
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Status Badge */}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(data.status)}`}>
          {data.status}
        </span>
      </div>

      {/* Card Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <DetailItem label="Order Code" value={data.orderCode} />
        <DetailItem label="Customer" value={data.customerName} />
        <DetailItem label="Status" value={data.status} />
        
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Items</p>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
               <Ticket size={12} className="text-gray-400" />
            </div>
            <p className="text-sm font-semibold">{data.items?.length || 0} items</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
            <User size={16} className="text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {data.customerName}
            </span>
        </div>
        
        <div className="flex items-center gap-2">
          {onDownloadPDF && (
            <button 
              onClick={handleDownloadClick}
              className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
            >
              Download PDF
            </button>
          )}
          {isOngoing && data.status !== 'ACCEPTED' && (
            <button className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors">
              Mark Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

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
