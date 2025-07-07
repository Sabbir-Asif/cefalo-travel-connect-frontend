import { useState } from "react";
import { useNavigate } from "react-router";
import { createTravelPlanAPI } from "../../utils/api/travel-plan";
import { MapLocationPicker } from "../location/MapLocationPicker";
import { LocationSearch } from "../location/LocationSearch";
import type { CreateTravelPlan } from "../../types/TravelPlan";
import { toast } from "react-toastify";

const CreateTravelPlanComponent: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<CreateTravelPlan>({
        title: "",
        starting_point_name: "",
        starting_point_location: { lat: 0, long: 0 },
        destination_name: "",
        destination_location: { lat: 0, long: 0 },
        starting_date: "",
        ending_date: "",
        budget: 0,
        description: "",
    });

    const [mapTarget, setMapTarget] = useState<"start" | "end" | null>(null);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    const handleLocationSelect = (
        location: { name: string; lat: number; long: number },
        target: "start" | "end"
    ) => {
        if (target === "start") {
            setFormData(prev => ({
                ...prev,
                starting_point_name: location.name,
                starting_point_location: { lat: location.lat, long: location.long },
            }));
        } else if (target === "end") {
            setFormData(prev => ({
                ...prev,
                destination_name: location.name,
                destination_location: { lat: location.lat, long: location.long },
            }));
        }
        setIsMapOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setError("");

        if (!formData.starting_point_name.trim()) {
            setError("Please select a starting location");
            setCreating(false);
            return;
        }

        if (!formData.destination_name.trim()) {
            setError("Please select a destination location");
            setCreating(false);
            return;
        }

        try {
            await createTravelPlanAPI(formData);
            toast.success("Travel Plan created successfully!");
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            setError("Failed to create travel plan");
            toast.error("Error creating travel plan");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="flex justify-center px-4">
            <div className="max-w-2xl w-full p-6 rounded-xl shadow">
                <button className="btn btn-ghost mb-4" onClick={() => navigate(-1)}>
                     Back
                </button>

                <h3 className="font-bold text-2xl mb-4 text-center">Create Travel Plan</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        className="input input-bordered w-full"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <div>
                        <label className="label-text font-medium mb-1 block">Starting Location</label>
                        <LocationSearch
                            value={formData.starting_point_name}
                            onLocationSelect={loc => handleLocationSelect(loc, "start")}
                        />
                        {formData.starting_point_location.lat !== 0 && (
                            <div className="text-sm mt-1 text-base-content/60">
                                Coordinates: {formData.starting_point_location.lat.toFixed(4)}, {formData.starting_point_location.long.toFixed(4)}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                setMapTarget("start");
                                setIsMapOpen(true);
                            }}
                            className="btn btn-xs btn-secondary mt-2"
                        >
                            Pick from Map
                        </button>
                    </div>
                    <div>
                        <label className="label-text font-medium mb-1 block">Destination</label>
                        <LocationSearch
                            value={formData.destination_name}
                            onLocationSelect={loc => handleLocationSelect(loc, "end")}
                        />
                        {formData.destination_location.lat !== 0 && (
                            <div className="text-sm mt-1 text-base-content/60">
                                Coordinates: {formData.destination_location.lat.toFixed(4)}, {formData.destination_location.long.toFixed(4)}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                setMapTarget("end");
                                setIsMapOpen(true);
                            }}
                            className="btn btn-xs btn-secondary mt-2"
                        >
                            Pick from Map
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="date"
                            className="input input-bordered w-full"
                            value={typeof formData.starting_date === "string" ? formData.starting_date : formData.starting_date.toISOString().slice(0, 10)}
                            onChange={e => setFormData({ ...formData, starting_date: e.target.value })}
                            required
                        />
                        <input
                            type="date"
                            className="input input-bordered w-full"
                            value={typeof formData.ending_date === "string" ? formData.ending_date : formData.ending_date.toISOString().slice(0, 10)}
                            onChange={e => setFormData({ ...formData, ending_date: e.target.value })}
                            required
                        />
                    </div>
                    <input
                        type="number"
                        placeholder="Budget (BDT)"
                        className="input input-bordered w-full"
                        value={formData.budget}
                        onChange={e => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
                        required
                    />
                    <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Short trip summary..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                    {error && <div className="text-error text-sm">{error}</div>}

                    <div className="flex justify-end gap-2">
                        <button type="submit" className="btn btn-primary" disabled={creating}>
                            {creating ? "Creating..." : "Create"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
            <MapLocationPicker
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onLocationSelect={location => {
                    if (mapTarget) {
                        handleLocationSelect(location, mapTarget);
                    }
                }}
            />
        </div>
    );
};

export default CreateTravelPlanComponent;
