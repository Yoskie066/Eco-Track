import React, { Fragment, useRef, useState, useMemo } from "react";
import {
  Image as ImageIcon,
  ChevronDown,
  Check,
  CalendarDays,
} from "lucide-react";
import { Listbox, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import debounce from "lodash.debounce";
import { fetchLocationSuggestions } from "../../api/Location";
import Modal from "react-modal";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Set root for accessibility
Modal.setAppElement("#root");

// Category and subcategory data
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
  const fileInputRef = useRef(null);
  const datePickerRef = useRef(null);

  // Form states
  const [wasteName, setWasteName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Modal states
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState(null); // 'success' | 'error'

  // Debounce location fetch
  const debouncedLocationFetch = useMemo(() =>
    debounce(async (query) => {
      const results = await fetchLocationSuggestions(query);
      setLocationResults(results);
    }, 300), []);

  // Handlers
  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
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
      selectedDate &&
      description &&
      imagePreview;

    if (isValid) {
      setModalStatus("success");
      // Reset form
      setWasteName("");
      setSelectedCategory("");
      setSubCategory("");
      setColorInput("");
      setLocationQuery("");
      setLocationResults([]);
      setSelectedDate(new Date());
      setDescription("");
      setImagePreview(null);
    } else {
      setModalStatus("error");
    }

    setModalIsOpen(true);
    setTimeout(() => {
      setModalIsOpen(false);
      setModalStatus(null);
    }, 3000);
  };

  // Styles
  const inputStyle =
    "w-full border border-gray-400 rounded px-3 py-2 text-sm text-black focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:font-medium outline-none placeholder-black";

  const dropdownStyle =
    "relative w-full cursor-pointer rounded border border-gray-400 bg-white py-2 pl-3 pr-10 text-left text-sm text-black shadow-none focus:outline-none";

  // Dropdown component
  const renderDropdown = (options, selected, setSelected, placeholder) => (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative">
        <Listbox.Button className={`${dropdownStyle} focus:ring-1 focus:ring-green-600 focus:border-green-600 focus:font-medium`}>
          <span className="truncate">{selected || placeholder}</span>
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
                    <span className={`block truncate ${selected ? "font-medium text-black" : ""}`}>
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
            className={inputStyle}
            placeholder="Enter waste name"
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
              className={inputStyle + " pr-10 w-full"}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
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
            Report
          </button>
        </div>
      </motion.form>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Submission Modal"
        className="bg-white w-80 max-w-md mx-auto p-6 rounded-lg shadow-lg outline-none flex flex-col items-center text-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
      >
        <div className="text-5xl mb-4">
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
            ? "Waste reported successfully!"
            : "Please fill in all required fields."}
        </h2>
      </Modal>
    </div>
  );
};

export default ReportWaste;
