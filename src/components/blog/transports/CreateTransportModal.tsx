
import { useEffect, useState } from "react";
import {
    getAllStartingPointsAPI,
    getAllDesticationPointsAPI,
    searchTransportAPI,
} from "../../../utils/api/transport";
import type { Transport, TransportLocation, TransportType } from "../../../types/Transport";
import { toast } from "react-toastify";
import type { BlogTransport } from "../../../types/BlogTransport";
import { createBlogTransportAPI } from "../../../utils/api/blog";

interface Props {
    blogId: string;
    onClose: () => void;
    onCreate?: (newTransport: Transport) => void;
}

const CreateTransportModal: React.FC<Props> = ({ blogId, onClose, }) => {
    const [startOptions, setStartOptions] = useState<TransportLocation[]>([]);
    const [destOptions, setDestOptions] = useState<TransportLocation[]>([]);
    const [start, setStart] = useState("");
    const [dest, setDest] = useState("");
    const [type, setType] = useState<TransportType>("BUS");
    const [searchResults, setSearchResults] = useState<Transport[]>([]);
    const [selectedTransport, setSelectedTransport] = useState<Transport | null>(null);

    useEffect(() => {
        getAllStartingPointsAPI().then(setStartOptions);
        getAllDesticationPointsAPI().then(setDestOptions);
    }, []);

    const handleSearch = async () => {
        const results = await searchTransportAPI(start, dest, type);
        setSearchResults(results);
    };

    const handleAddTransport = async () => {
        if (!selectedTransport || !blogId) return;

        const data: BlogTransport = {
            transport_id: selectedTransport.id,
            blog_id: blogId
        };

        await createBlogTransportAPI(data);
        toast.success("Transport added to travel plan");
        onClose();
    };

    return (
        <dialog className="modal modal-open">
            <div className="modal-box max-w-3xl">
                <h3 className="font-bold text-lg mb-4">Add Transport</h3>

                <div className="form-control mb-2">
                    <label className="label">Starting Location</label>
                    <input
                        className="input input-bordered"
                        list="start-list"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                    />
                    <datalist id="start-list">
                        {startOptions.map((opt, i) => (
                            <option key={i} value={opt.name} />
                        ))}
                    </datalist>
                </div>

                <div className="form-control mb-2">
                    <label className="label">Destination</label>
                    <input
                        className="input input-bordered"
                        list="dest-list"
                        value={dest}
                        onChange={(e) => setDest(e.target.value)}
                    />
                    <datalist id="dest-list">
                        {destOptions.map((opt, i) => (
                            <option key={i} value={opt.name} />
                        ))}
                    </datalist>
                </div>

                <div className="form-control mb-4">
                    <label className="label">Transport Type</label>
                    <select
                        className="select select-bordered"
                        value={type}
                        onChange={(e) => setType(e.target.value as TransportType)}
                    >
                        <option value="BUS">BUS</option>
                        <option value="TRAIN">TRAIN</option>
                        <option value="FLIGHT">FLIGHT</option>
                        <option value="BOAT">BOAT</option>
                        <option value="OTHER">OTHER</option>
                    </select>
                </div>

                <button className="btn btn-outline btn-info mb-4" onClick={handleSearch}>
                    Search Transport
                </button>

                {searchResults.length > 0 && (
                    <div className="mb-4">
                        <p className="mb-2 font-semibold">Select a Transport</p>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                            {searchResults.map((t) => (
                                <div
                                    key={t.id}
                                    className={`p-2 border rounded cursor-pointer ${selectedTransport?.id === t.id ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                                    onClick={() => setSelectedTransport(t)}
                                >
                                    <p className="font-bold">{t.name}</p>
                                    <p className="text-sm">
                                        {t.starting_location} - to - {t.destination}
                                    </p>
                                    <p className="text-xs">Fare: {t.fare}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="modal-action">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        disabled={!selectedTransport}
                        onClick={handleAddTransport}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default CreateTransportModal;
