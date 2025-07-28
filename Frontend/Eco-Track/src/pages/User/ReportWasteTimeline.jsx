import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

const ReportedWasteTimeline = () => {
  const [reportedWaste, setReportedWaste] = useState([]);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const navigate = useNavigate();

  // Load reported waste of the currently logged-in user
  useEffect(() => {
    const userEmail = localStorage.getItem("ecoTrackCurrentUserEmail");
    if (!userEmail) return;

    const userKey = `reportedWaste_${userEmail}`;
    const stored = JSON.parse(localStorage.getItem(userKey)) || [];
    setReportedWaste(stored.reverse());
  }, []);

  const handleEdit = (item) => {
    localStorage.setItem("editReportedWaste", JSON.stringify(item));
    navigate("/report-waste");
  };

  const handleDelete = (id) => {
    const userEmail = localStorage.getItem("ecoTrackCurrentUserEmail");
    if (!userEmail) return;

    const userKey = `reportedWaste_${userEmail}`;
    const updated = reportedWaste.filter((item) => item.id !== id);
    localStorage.setItem(userKey, JSON.stringify([...updated].reverse()));
    setReportedWaste(updated);
  };

  return (
    <div>
      {reportedWaste.length === 0 ? (
        <p className="text-center text-gray-500">No reported waste yet.</p>
      ) : (
        reportedWaste.map((item) => (
          <div key={item.id} className="border p-4 mb-4 rounded shadow relative">
            <div className="flex justify-between items-start font-medium">
              <div>
                <span>{item.wasteName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex flex-col items-end text-right">
                  <span>{item.dateReported}</span>
                </div>
                <div className="relative">
                  <button
                    onClick={() =>
                      setDropdownOpenId(dropdownOpenId === item.id ? null : item.id)
                    }
                    className="text-gray-600 hover:text-black"
                  >
                    <MoreHorizontal />
                  </button>
                  {dropdownOpenId === item.id && (
                    <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                      >
                        <Pencil size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm mt-1 text-gray-600">
              <span className="font-medium">{item.location}</span>
            </p>
            <p className="mt-2">{item.description}</p>

            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.wasteName}
                className="mt-3 w-full max-h-60 object-cover rounded"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReportedWasteTimeline;
