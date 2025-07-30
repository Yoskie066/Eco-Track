import React, { Fragment, useRef, useState, useEffect, useMemo } from "react";
import {
  Image as ImageIcon,
  ChevronDown,
  Check,
  CalendarDays,
} from "lucide-react";
import { Listbox, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import debounce from "lodash.debounce";
import { fetchLocationSuggestions } from "../../api/Location";
import "react-datepicker/dist/react-datepicker.css";

Modal.setAppElement("#root");

const categoryData = {
  Biodegradable: [
    "Food Waste",
    "Garden Waste",
    "Paper Products",
    "Wood & Natural Fibers",
    "Biodegradable Packaging",
    "Other Organic Waste",
  ],
  "Non Biodegradable": [
    "Plastic",
    "Metals",
    "Glass",
    "E-Waste",
    "Synthetic Fibers",
    "Rubber",
    "Chemical",
    "Construction Waste",
  ],
  Recycle: [
    "Paper & Cardboard",
    "Metals",
    "Textiles",
    "Electronics",
    "Batteries",
  ],
};

const ReportWaste = () => {
  useEffect(() => {
    const editItem = JSON.parse(localStorage.getItem("editReportedWaste"));
    const currentUser = JSON.parse(localStorage.getItem("ecoTrackCurrentUser"));
    if (editItem && currentUser) {
      setWasteName(editItem.wasteName);
      setSelectedCategory(editItem.selectedCategory);
      setSubCategory(editItem.subCategory);
      setColorInput(editItem.colorInput);
      setLocationQuery(editItem.locationQuery);
      setSelectedDate(new Date(editItem.dateReported));
      setDescription(editItem.description);
      setImagePreview(editItem.imageUrl);
      setEditId(editItem.id);
      localStorage.removeItem("editReportedWaste");
    }
  }, []);

  const fileInputRef = useRef(null);
  const datePickerRef = useRef(null);

  const [wasteName, setWasteName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Added this state

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(null);

  const [editId, setEditId] = useState(null);

  const debouncedLocationFetch = useMemo(() =>
    debounce(async (query) => {
      const results = await fetchLocationSuggestions(query);
      setLocationResults(results);
    }, 300), []);

  const handleImageClick = () => fileInputRef.current?.click();

   const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
         `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // First show local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(file);
      if (cloudinaryUrl) {
        setImagePreview(cloudinaryUrl);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLocationChange = async (e) => {
    const query = e.target.value;
    setLocationQuery(query);
    if (query.length > 2) {
      debouncedLocationFetch(query);
    } else {
      setLocationResults([]);
    }
  };

  const handleLocationSelect = (place) => {
    setLocationQuery(place.display_name);
    setLocationResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid =
      wasteName &&
      selectedCategory &&
      subCategory &&
      colorInput &&
      locationQuery &&
      description &&
      imagePreview &&
      selectedDate;

    if (!isValid) {
      setModalStatus("error");
    } else {
      const currentUser = JSON.parse(localStorage.getItem("ecoTrackCurrentUser"));
      const userEmail = currentUser?.email;
      
      const newEntry = {
        id: editId || Date.now(),
        userEmail,
        wasteName,
        selectedCategory,
        subCategory,
        colorInput,
        locationQuery,
        dateReported: selectedDate.toISOString().split("T")[0],
        description,
        imageUrl: imagePreview,
      };

      const userKey = `reportedWaste_${userEmail}`;
      let existingData = JSON.parse(localStorage.getItem(userKey)) || [];

      if (editId) {
        existingData = existingData.map((item) =>
          item.id === editId ? newEntry : item
        );
      } else {
        existingData.push(newEntry);
      }

      localStorage.setItem(userKey, JSON.stringify(existingData));
      setModalStatus("success");

      // Reset form
      setWasteName("");
      setSelectedCategory("");
      setSubCategory("");
      setColorInput("");
      setLocationQuery("");
      setSelectedDate(new Date());
      setDescription("");
      setImagePreview(null);
      setEditId(null);
    }

    setModalIsOpen(true);
    setTimeout(() => {
      setModalIsOpen(false);
      setModalStatus(null);
      if (modalStatus === "success") {
        window.location.href = "/waste-timeline";
      }
    }, 3000);
  };

  const inputStyle =
    "w-full border border-gray-400 rounded px-3 py-2 text-sm text-black placeholder:text-black focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:font-medium outline-none";

  const dropdownStyle =
    "relative w-full cursor-pointer rounded border border-gray-400 bg-white py-2 pl-3 pr-10 text-left text-sm text-black shadow-none focus:outline-none";

  const renderDropdown = (options, selected, setSelected, placeholder) => (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative">
        <Listbox.Button
          className={
            dropdownStyle +
            " focus:ring-1 focus:ring-green-600 focus:border-green-600 focus:font-medium"
          }
        >
          <span className="truncate text-black">
            {selected || <span className="text-black">{placeholder}</span>}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow ring-1 ring-black/10">
            {options.map((item, idx) => (
              <Listbox.Option
                key={idx}
                value={item}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-green-600 text-white" : "text-black"
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium text-black" : ""
                      }`}
                    >
                      {item}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white">
      <motion.h2
        className="text-green-600 font-bold text-center text-3xl mb-6"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Report Waste
      </motion.h2>

      <motion.form
        className="space-y-4"
        onSubmit={handleSubmit}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div>
          <label className="block text-sm mb-1">Waste Name:</label>
          <input
            type="text"
            value={wasteName}
            onChange={(e) => setWasteName(e.target.value)}
            placeholder="Enter waste name"
            className={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Category Type:</label>
          {renderDropdown(
            Object.keys(categoryData),
            selectedCategory,
            setSelectedCategory,
            "Select Category"
          )}
        </div>

        {selectedCategory && (
          <div>
            <label className="block text-sm mb-1">Sub Category:</label>
            {renderDropdown(
              categoryData[selectedCategory],
              subCategory,
              setSubCategory,
              "Select Sub-Category"
            )}
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">Color:</label>
          <input
            type="text"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            placeholder="Enter color"
            className={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Location:</label>
          <input
            type="text"
            value={locationQuery}
            onChange={handleLocationChange}
            placeholder="Enter location"
            className={inputStyle}
            autoComplete="off"
          />
          {locationResults.length > 0 && (
            <ul className="bg-white border mt-1 max-h-40 overflow-y-auto rounded shadow text-sm">
              {locationResults.map((place, index) => (
                <li
                  key={index}
                  onClick={() => handleLocationSelect(place)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Date Reported:</label>
          <div className="relative w-full">
            <DatePicker
              ref={datePickerRef}
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className={`${inputStyle} pr-10 w-full`}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
              dayClassName={(date) =>
                date.toDateString() === selectedDate?.toDateString()
                  ? "bg-green-600 text-white rounded-full"
                  : undefined
              }
            />
            <CalendarDays
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600 cursor-pointer"
              onClick={() => datePickerRef.current.setFocus()}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Description:</label>
          <textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Photo:</label>
          <div className="flex justify-center">
            <div
              className="w-full h-40 flex items-center justify-center border border-gray-400 rounded cursor-pointer"
              onClick={handleImageClick}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <ImageIcon className="w-20 h-20 text-green-600" />
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-yellow-400 hover:text-black transition-colors duration-300"
          >
            {editId ? "Update Report" : "Report Waste"}
          </button>
        </div>
      </motion.form>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Waste Report Status"
        className="bg-white w-80 max-w-md mx-auto p-6 rounded-lg shadow-lg outline-none flex flex-col items-center text-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      >
        <div className="text-6xl mb-4">
          {modalStatus === "success" ? (
            <FaCheckCircle className="text-green-600" />
          ) : (
            <FaTimesCircle className="text-red-600" />
          )}
        </div>
        <h2
          className={`text-lg font-semibold ${
            modalStatus === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {modalStatus === "success"
            ? editId
              ? "Report updated successfully!"
              : "Waste reported successfully!"
            : "Please fill in all required fields."}
        </h2>
      </Modal>
    </div>
  );
};

export default ReportWaste;