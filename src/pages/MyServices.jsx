import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import EditServicePanel from "./EditServicePanel";
import { useScrollAnimation } from "../hooks/useScrollAnimation"; // NEW

const initialServices = [
  {
    id: "s1",
    title: "Premium City Bike Rental",
    description: "Rent a high-quality city bike for exploring downtown. Includes helmet and lock.",
    price: "35/day",
    category: "camping",
    available: true,
    imageUrl: null,
  },
  {
    id: "s2",
    title: "Airport Transfer - Luxury Sedan",
    description: "Professional and comfortable airport transfer service in a luxury vehicle.",
    price: "120/trip",
    category: "vehicles",
    available: true,
    imageUrl: null,
    vehicleNumber: "AB-1234",
    passengers: 4,
  },
  {
    id: "s3",
    title: "Private Guided Hiking Tour",
    description: "Personalized 4-hour tour of the local mountain trails with an experienced guide.",
    price: "80/hour",
    category: "tour",
    available: false,
    imageUrl: null,
  },
];

const MyServices = () => {
  const [services, setServices] = useState(initialServices);
  const [editingService, setEditingService] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // ⭐ NEW scroll animation hook
  const contentRef = useRef(null);
  useScrollAnimation(contentRef, true);

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

  const handleDelete = (id) => {
    if (!confirm("Delete this service?")) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div ref={contentRef} className="p-6 md:p-10 overflow-hidden">
      {/* ⭐ Animated heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-on-scroll opacity-0 translate-y-4">
        My Services
      </h1>

      {/* ⭐ Animated subtitle */}
      <p className="text-gray-600 mb-8 animate-on-scroll opacity-0 translate-y-4">
        Manage your listings for rentals and services.
      </p>

      {/* ⭐ Animated grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((s) => (
          <div
            key={s.id}
            className="bg-white p-6 rounded-xl shadow-lg relative animate-on-scroll opacity-0 translate-y-4"
          >
            <div className="mb-4">
              <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center border overflow-hidden">
                {s.imageUrl ? (
                  <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-300">No image</div>
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2">{s.title}</h3>
            <p className="text-gray-600 mb-4">{s.description}</p>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-extrabold text-[#217964]">{s.price}</span>
                <div className="text-sm text-gray-500">Category: {s.category}</div>
              </div>

              <div className="flex flex-col items-end">
                <button
                  onClick={() => openEditor(s)}
                  className="px-3 py-1 rounded-lg bg-[#217964] text-white hover:bg-[#1a5d4e] transition flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  <span className="text-sm">Edit Service</span>
                </button>

                <div className="mt-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      s.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {s.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <EditServicePanel
        open={panelOpen}
        service={editingService}
        onClose={closeEditor}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MyServices;
