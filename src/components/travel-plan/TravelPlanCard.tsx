import { useNavigate } from "react-router";
import type { TravelPlan } from "../../types/TravelPlan";
import { useAuth } from "../../context/useAuth";

const TravelPlanCard = ({ travelPlan }: { travelPlan: TravelPlan }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const onViewDetails = () => {
    navigate(`/dashboard/${user?.id}/travel-plans/${travelPlan.id}`)
  }
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title">{travelPlan.title}</h2>
        <p>{travelPlan.starting_point_name} → {travelPlan.destination_name}</p>
        <p className="text-sm text-gray-500">{travelPlan.description.slice(0, 100)}...</p>
        <div className="card-actions justify-end">
          <button className="btn btn-secondary btn-sm" onClick={onViewDetails}>View Details</button>
        </div>
      </div>
    </div>
  );
};
export default TravelPlanCard;
