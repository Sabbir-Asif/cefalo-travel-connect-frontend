import { useEffect, useState } from "react";
import type { Lodge, LodgeLocation } from "../../../types/Lodge";
import { toast } from "react-toastify";
import { getLodgeLocationsAPI, searchLodgeAPI } from "../../../utils/api/lodge";
import type { BlogLodge } from "../../../types/BlogLodge";
import { createBlogLodgeAPI } from "../../../utils/api/blog";

interface Props {
    blogId: string;
    onClose: () => void;
    onAdd: (lodge: Lodge) => void;
}

const CreateAccomodationModal: React.FC<Props> = ({ blogId, onClose, onAdd }) => {
    const [locationInput, setLocationInput] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [locationSuggestions, setLocationSuggestions] = useState<LodgeLocation[]>([]);
    const [searchResults, setSearchResults] = useState<Lodge[]>([]);
    const [selectedLodge, setSelectedLodge] = useState<Lodge | null>(null);

    useEffect(() => {
        getLodgeLocationsAPI().then(setLocationSuggestions);
    }, []);

    const handleSearch = async () => {
        const lodges = await searchLodgeAPI(nameInput, locationInput);
        setSearchResults(lodges);
    };

    const handleAddLodge = async () => {
        if (!selectedLodge) return;

        const data: BlogLodge = {
            blog_id: blogId,
            lodge_id: selectedLodge.id,
        };

        await createBlogLodgeAPI(data);
        toast.success("Lodge added to travel plan!");
        onAdd(selectedLodge);
        onClose();
    };

    return (
        <dialog className="modal modal-open">
            <div className="modal-box max-w-3xl">
                <h3 className="font-bold text-lg mb-4">Add Accommodation</h3>

                <div className="form-control mb-3">
                    <label className="label">Location</label>
                    <input
                        type="text"
                        className="input input-bordered"
                        list="location-list"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                    />
                    <datalist id="location-list">
                        {locationSuggestions.map((loc, idx) => (
                            <option key={idx} value={loc.name} />
                        ))}
                    </datalist>
                </div>

                <div className="form-control mb-3">
                    <label className="label">Lodge Name</label>
                    <input
                        type="text"
                        className="input input-bordered"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                    />
                </div>

                <button onClick={handleSearch} className="btn btn-info mb-4">
                    Search Lodge
                </button>

                {searchResults.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto mb-4">
                        {searchResults.map((lodge) => (
                            <div
                                key={lodge.id}
                                className={`p-3 border rounded cursor-pointer ${selectedLodge?.id === lodge.id
                                        ? "bg-primary text-white"
                                        : "hover:bg-gray-100"
                                    }`}
                                onClick={() => setSelectedLodge(lodge)}
                            >
                                <p className="font-bold">{lodge.name}</p>
                                <p className="text-sm">{lodge.location_name}</p>
                                <p className="text-xs">{lodge.price}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="modal-action">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        disabled={!selectedLodge}
                        onClick={handleAddLodge}
                    >
                        Add Lodge
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default CreateAccomodationModal;
