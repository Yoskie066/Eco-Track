import React, { Fragment, useRef, useState } from "react";
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

const unitOptions = ["kg", "g", "ton", "bags", "pcs", "L", "m³"];

const CollectWaste = () => {
  const fileInputRef = useRef(null);
  const datePickerRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleImageClick = () => fileInputRef.current?.click();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
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
        Collect Waste
      </motion.h2>

      <motion.form
        className="space-y-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div>
          <label className="block text-sm mb-1">Waste Name:</label>
          <input
            type="text"
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
          <label className="block text-sm mb-1">Quantity:</label>
          <input
            type="number"
            placeholder="Enter quantity"
            className={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Unit:</label>
          {renderDropdown(
            unitOptions,
            selectedUnit,
            setSelectedUnit,
            "Select Unit"
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Date Collected:</label>
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
            Collect
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default CollectWaste;