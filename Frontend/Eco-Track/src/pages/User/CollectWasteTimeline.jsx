import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

const CollectWasteTimeline = () => {
  const [collectedWaste, setCollectedWaste] = useState([]);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("collectedWaste")) || [];
    setCollectedWaste(storedData.reverse());
  }, []);

  const handleDelete = (id) => {
    const updated = collectedWaste.filter((item) => item.id !== id);
    localStorage.setItem("collectedWaste", JSON.stringify([...updated].reverse()));
    setCollectedWaste(updated);
  };

  const handleEdit = (item) => {
    localStorage.setItem("editWaste", JSON.stringify(item));
    navigate("/collect-waste");
  };

  return (
    <div>
      {collectedWaste.length === 0 ? (
        <p className="text-center text-gray-500">No waste collected yet.</p>
      ) : (
        collectedWaste.map((item) => (
          <div key={item.id} className="border p-4 mb-4 rounded shadow relative">
            <div className="flex justify-between items-start font-medium">
              <div>
                <span>{item.wasteName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {item.dateCollected}
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

export default CollectWasteTimeline;