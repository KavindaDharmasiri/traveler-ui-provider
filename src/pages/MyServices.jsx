import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faBoxOpen, faTrash } from "@fortawesome/free-solid-svg-icons";
import EditServicePanel from "./EditServicePanel";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import axiosInstance from "../api/axiosInstance";
import LoadingScreen from "../components/common/LoadingScreen";
import Swal from 'sweetalert2';

const MyServices = ({ setCurrentPage }) => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageMapper, setImageMapper] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [currentPage, setCurrentPageNum] = useState(1);
  const itemsPerPage = 6;

  const contentRef = useRef(null);
  // useScrollAnimation(contentRef, true); // Temporarily disabled
  
  console.log('Services state:', services);
  console.log('Loading state:', loading);

  useEffect(() => {
    fetchServices();
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
    setImageMapper(mapper);
  };

  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get('core/api/v1/provider/item', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      console.log('API Response:', response.data);
      const servicesData = Array.isArray(response.data) ? response.data : [];
      console.log('Services Data:', servicesData);
      setServices(servicesData);
      
      // Collect all image UUIDs
      const allImageUuids = servicesData.flatMap(service => service.images || []);
      if (allImageUuids.length > 0) {
        await fetchImages(allImageUuids);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const openEditor = (service) => {
    setEditingService(service);
    setPanelOpen(true);
  };

  const closeEditor = () => {
    setPanelOpen(false);
    setTimeout(() => setEditingService(null), 250);
  };

  const handleSave = (updated) => {
    setServices((prev) => prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)));
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Service?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`core/api/v1/provider/item/${id}`);
        setServices((prev) => prev.filter((s) => s.id !== id));
        Swal.fire('Deleted!', 'Service has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting service:', error);
        Swal.fire('Error!', 'Failed to delete service.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <LoadingScreen message="Loading your services..." />
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto">
      <div ref={contentRef} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                My Services
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                Manage and showcase your service offerings
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {services.length} Services
                </span>
              </div>
            </div>
          </div>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faBoxOpen} className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No services yet</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Start building your service portfolio and reach more customers
              </p>
              <button 
                onClick={() => setCurrentPage('add')}
                className="inline-flex items-center px-6 py-3 bg-[#217964] text-white font-medium rounded-xl hover:bg-[#1a5d4e] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Your First Service
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Services Grid */}
            <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
              {/* Add New Service Card */}
              {services.length < 6 && (
                <div className="w-full lg:col-span-1">
                  <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border-2 border-[#217964]/20 p-6 h-full hover:shadow-xl hover:border-[#217964]/40 transition-all duration-300 group relative overflow-hidden">
                    {/* Highlight pulse effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#217964]/5 to-transparent animate-pulse"></div>
                    <div className="relative z-10 text-center h-full flex flex-col justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#217964] to-[#1a5d4e] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <FontAwesomeIcon icon={faPlus} className="text-2xl text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2"> Add Service</h3>
                      <p className="text-[#217964] text-sm mb-6 leading-relaxed font-medium">
                        Expand your offerings and reach more customers
                      </p>
                      <button 
                        onClick={() => setCurrentPage('add')}
                        className="w-full py-3 bg-[#217964] text-white rounded-xl font-medium hover:bg-[#1a5d4e] transition-colors duration-200"
                      >
                        Create Service
                      </button>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Progress</div>
                        <div className="text-lg font-bold text-[#217964] mb-2">{services.length}/6</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-[#217964] to-[#1a5d4e] h-1.5 rounded-full transition-all duration-500" 
                            style={{width: `${(services.length / 6) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Services List */}
              <div className={`w-full ${services.length < 6 ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {services
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((s, index) => (
                    <div
                      key={s.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Image Section */}
                      <div className="relative h-48 bg-gray-50 overflow-hidden">
                        {s.images && s.images.length > 0 ? (
                          <>
                            <img 
                              src={imageMapper[s.images[currentImageIndex[s.id] || 0]]} 
                              alt={s.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                            {s.images.length > 1 && (
                              <>
                                <button 
                                  onClick={() => setCurrentImageIndex(prev => ({
                                    ...prev, 
                                    [s.id]: ((prev[s.id] || 0) - 1 + s.images.length) % s.images.length
                                  }))}
                                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg"
                                >
                                  ‹
                                </button>
                                <button 
                                  onClick={() => setCurrentImageIndex(prev => ({
                                    ...prev, 
                                    [s.id]: ((prev[s.id] || 0) + 1) % s.images.length
                                  }))}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg"
                                >
                                  ›
                                </button>
                                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                  {s.images.map((_, idx) => (
                                    <div 
                                      key={idx}
                                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                        idx === (currentImageIndex[s.id] || 0) ? 'bg-white scale-125' : 'bg-white/60'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-gray-400 text-center">
                              <FontAwesomeIcon icon={faBoxOpen} className="text-3xl mb-2" />
                              <div className="text-sm">No image</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                            s.status === 'ACTIVE'
                              ? "bg-green-100/90 text-green-700 border border-green-200/50"
                              : "bg-red-100/90 text-red-700 border border-red-200/50"
                          }`}>
                            {s.status === 'ACTIVE' ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{s.name}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{s.description}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-[#217964] mb-1">
                              {s.currency} {s.pricePerDay}
                              <span className="text-sm font-normal text-gray-500">/day</span>
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                              {s.category}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setCurrentPage('add', s.id)}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-[#217964] hover:text-white transition-all duration-200"
                            >
                              <FontAwesomeIcon icon={faEdit} className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleDelete(s.id)}
                              className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200"
                            >
                              <FontAwesomeIcon icon={faTrash} className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Pagination */}
            {services.length > itemsPerPage && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button
                    onClick={() => setCurrentPageNum(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-2 sm:px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                  >
                    Prev
                  </button>
                  
                  {Array.from({ length: Math.ceil(services.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPageNum(page)}
                      className={`px-2 sm:px-3 py-2 rounded-lg text-sm ${
                        page === currentPage
                          ? 'bg-[#217964] text-white'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPageNum(prev => Math.min(prev + 1, Math.ceil(services.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(services.length / itemsPerPage)}
                    className="px-2 sm:px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <EditServicePanel
          open={panelOpen}
          service={editingService}
          onClose={closeEditor}
          onSave={handleSave}
          onDelete={handleDelete}
        />
        
        {/* Floating Plus Icon - shows when more than 6 services */}
        {services.length > 5 && (
          <button
            onClick={() => setCurrentPage('add')}
            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-[#217964] to-[#1a5d4e] text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 z-50 group"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xl group-hover:rotate-90 transition-transform duration-300" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MyServices;
