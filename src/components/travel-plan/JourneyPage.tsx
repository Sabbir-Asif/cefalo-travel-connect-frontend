import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getTravelPlanByIdAPI } from "../../utils/api/travel-plan";
import type { TravelPlan } from "../../types/TravelPlan";
import { useNavigate } from "react-router";
import LiveJourneyMap from "./LiveJourneyMap";

const JourneyPage: React.FC = () => {
  const { travelPlanId } = useParams();
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Notification toggles
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!travelPlanId) return;
      const data = await getTravelPlanByIdAPI(travelPlanId);
      setPlan(data);
      setLoading(false);
    };
    fetchPlan();
  }, [travelPlanId]);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600 text-sm">Loading journey...</div>
    );
  if (!plan)
    return (
      <div className="text-center py-20 text-red-600 font-medium">Travel plan not found</div>
    );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Live Journey to <span className="text-primary">{plan.destination_name}</span>
        </h2>
        <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm">
          Back
        </button>
      </div>

      {/* Notification toggles */}
      <div className="flex items-center space-x-4 mb-4">
        <label className="flex items-center space-x-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={() => setSoundEnabled(!soundEnabled)}
            className="checkbox checkbox-primary"
          />
          <span>Sound Alerts</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={vibrationEnabled}
            onChange={() => setVibrationEnabled(!vibrationEnabled)}
            className="checkbox checkbox-primary"
          />
          <span>Vibration Alerts</span>
        </label>
      </div>

      <LiveJourneyMap
        destination={plan.destination_location}
        soundEnabled={soundEnabled}
        vibrationEnabled={vibrationEnabled}
      />
    </div>
  );
};

export default JourneyPage;
