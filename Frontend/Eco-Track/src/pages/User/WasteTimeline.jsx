import React, { useState, Fragment } from "react";
import CollectWasteTimeline from "./CollectWasteTimeline";
import ReportWasteTimeline from "./ReportWasteTimeline";
import { motion } from "framer-motion";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

const WasteTimeline = () => {
  const [selectedTimeline, setSelectedTimeline] = useState("collect");

  const timelineTitle =
    selectedTimeline === "collect" ? "Collect Waste Timeline" : "Report Waste Timeline";

  const dropdownOptions = [
    { label: "Collect Waste", value: "collect" },
    { label: "Report Waste", value: "report" },
  ];

  return (
    <div className="px-4 py-6">
      <div className="max-w-md mx-auto p-6 mt-10 bg-white">
        <motion.h2
          className="text-green-600 font-bold text-center text-3xl mb-6"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
        Waste Timeline
        </motion.h2>
      </div>

      {/* Subtitle + Dropdown */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between max-w-4xl mx-auto w-full gap-4 mb-6 px-2"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-green-600 text-center sm:text-left">
          {timelineTitle}
        </h2>

        <Listbox value={selectedTimeline} onChange={setSelectedTimeline}>
          <div className="relative w-full sm:w-60">
            <Listbox.Button className="relative w-full cursor-pointer rounded border border-gray-400 bg-white py-2 pl-3 pr-10 text-left text-black shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 sm:text-sm font-medium">
              <span className="block truncate">
                {selectedTimeline === "collect" ? "Collect Waste" : "Report Waste"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDown className="h-5 w-5 text-black" />
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {dropdownOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? "bg-green-600 text-white" : "text-black"
                      }`
                    }
                    value={option.value}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                          {option.label}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                            <Check className="h-5 w-5" />
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
      </motion.div>

      {/* Timeline Display */}
      <motion.div
        className="max-w-4xl mx-auto px-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {selectedTimeline === "collect" ? (
          <CollectWasteTimeline />
        ) : (
          <ReportWasteTimeline />
        )}
      </motion.div>
    </div>
  );
};

export default WasteTimeline;







