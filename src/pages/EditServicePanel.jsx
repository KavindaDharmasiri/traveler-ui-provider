import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";

/**
 * Props:
 * - open: boolean
 * - service: object (id, title, description, price, category, available, imageUrl)
 * - onClose(): close panel
 * - onSave(updatedService): save handler
 * - onDelete(id): delete handler
 */
const EditServicePanel = ({ open, service, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    price: "",
    category: "",
    available: true,
    imageFile: null,
    imagePreview: null,
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (service) {
      setForm({
        id: service.id ?? null,
        title: service.title ?? "",
        description: service.description ?? "",
        price: service.price ?? "",
        category: service.category ?? "",
        available: typeof service.available === "boolean" ? service.available : true,
        imageFile: null,
        imagePreview: service.imageUrl ?? null,
      });
    }
  }, [service]);

  useEffect(() => {
    // cleanup preview URL on unmount
    return () => {
      if (form.imagePreview && typeof form.imagePreview === "object") {
        URL.revokeObjectURL(form.imagePreview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!open) return null;

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    // revoke previous if object
    if (form.imagePreview && typeof form.imagePreview === "object") {
      URL.revokeObjectURL(form.imagePreview);
    }
    setForm(prev => ({ ...prev, imageFile: f, imagePreview: url }));
  };

  const handleToggle = () => {
    setForm(prev => ({ ...prev, available: !prev.available }));
  };

  const handleSave = () => {
    // basic validation
    if (!form.title?.trim()) {
      alert("Title is required");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      alert("Enter a valid price");
      return;
    }
    const payload = {
      id: form.id,
      title: form.title,
      description: form.description,
      price: form.price,
      category: form.category,
      available: form.available,
      // imageFile may be null (unchanged). The caller should handle upload.
      imageFile: form.imageFile,
      imagePreview: form.imagePreview,
    };
    onSave && onSave(payload);
    onClose && onClose();
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    onDelete && onDelete(form.id);
    onClose && onClose();
  };

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={() => onClose && onClose()}
      />

      {/* drawer */}
      <aside className="fixed right-0 top-0 h-full w-full md:w-[420px] bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Edit Service</h3>
          <div className="flex items-center gap-2">
            <button
              className="text-sm px-3 py-1 rounded-md text-red-600 border border-red-100 hover:bg-red-50 transition"
              onClick={handleDelete}
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              {confirmDelete ? "Confirm Delete" : "Delete"}
            </button>

            <button
              aria-label="close"
              onClick={() => onClose && onClose()}
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100%-72px)]">
          {/* Image preview + upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <div className="flex items-center gap-4">
              <div className="w-28 h-20 bg-gray-100 rounded-md overflow-hidden border">
                {form.imagePreview ? (
                  // if imagePreview is a URL string or object (URL)
                  <img
                    src={typeof form.imagePreview === "string" ? form.imagePreview : form.imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>
              <div className="flex-1">
                <input type="file" accept="image/*" onChange={handleFile} />
                <p className="text-xs text-gray-500 mt-2">Replace image (optional). Max size handled server-side.</p>
              </div>
            </div>
          </div>

          {/* Availability toggle */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">Availability</label>
              <p className="text-xs text-gray-500">Toggle whether this item is available to book</p>
            </div>
            <div>
              <button
                onClick={handleToggle}
                className={`px-3 py-1 rounded-full text-white font-semibold transition ${form.available ? "bg-green-600" : "bg-gray-400"}`}
              >
                {form.available ? "Available" : "Unavailable"}
              </button>
            </div>
          </div>

          {/* Basic fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-[#217964] focus:border-[#217964]"
                placeholder="Service or item title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows="4"
                className="w-full p-3 border rounded-lg focus:ring-[#217964] focus:border-[#217964]"
                placeholder="Short description for listing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                type="number"
                className="w-full p-3 border rounded-lg focus:ring-[#217964] focus:border-[#217964]"
                placeholder="Price per day or unit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-[#217964] focus:border-[#217964]"
              >
                <option value="">Select category</option>
                <option value="camping">Camping Gear</option>
                <option value="electronics">Electronics</option>
                <option value="luggage">Luggage</option>
                <option value="watersports">Water Sports</option>
                <option value="outdoor">Outdoor Apparel</option>
                <option value="vehicles">Vehicles</option>
                <option value="hotels">Hotels</option>
              </select>
            </div>
          </div>

          {/* Category-specific fields - example for vehicles & hotels */}
          {form.category === "vehicles" && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h4 className="text-sm font-semibold mb-3">Vehicle details</h4>
              <input
                placeholder="Vehicle number"
                className="w-full p-3 border rounded-lg mb-3"
                onChange={(e) => handleChange("vehicleNumber", e.target.value)}
                defaultValue={service?.vehicleNumber ?? ""}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Passengers"
                  className="w-full p-3 border rounded-lg"
                  type="number"
                  onChange={(e) => handleChange("passengers", e.target.value)}
                  defaultValue={service?.passengers ?? ""}
                />
                <input
                  placeholder="KM per day"
                  className="w-full p-3 border rounded-lg"
                  type="number"
                  onChange={(e) => handleChange("kmPerDay", e.target.value)}
                  defaultValue={service?.kmPerDay ?? ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <input
                  placeholder="Price / extra km"
                  className="w-full p-3 border rounded-lg"
                  type="number"
                  onChange={(e) => handleChange("priceExtraKm", e.target.value)}
                  defaultValue={service?.priceExtraKm ?? ""}
                />
                <input
                  placeholder="Waiting charge / night"
                  className="w-full p-3 border rounded-lg"
                  type="number"
                  onChange={(e) => handleChange("waitingCharge", e.target.value)}
                  defaultValue={service?.waitingCharge ?? ""}
                />
              </div>
            </div>
          )}

          {form.category === "hotels" && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h4 className="text-sm font-semibold mb-3">Hotel details</h4>
              <input
                placeholder="Address"
                className="w-full p-3 border rounded-lg mb-3"
                onChange={(e) => handleChange("address", e.target.value)}
                defaultValue={service?.address ?? ""}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Room number"
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) => handleChange("roomNumber", e.target.value)}
                  defaultValue={service?.roomNumber ?? ""}
                />
                <input
                  placeholder="Max guests"
                  type="number"
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) => handleChange("maxGuests", e.target.value)}
                  defaultValue={service?.maxGuests ?? ""}
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex items-center justify-end gap-3">
          <button
            onClick={() => onClose && onClose()}
            className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-[#217964] text-white hover:bg-[#1a5d4e] transition">
            Save Changes
          </button>
        </div>
      </aside>
    </>
  );
};

export default EditServicePanel;
