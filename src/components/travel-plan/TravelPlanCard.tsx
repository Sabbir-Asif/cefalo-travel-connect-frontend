import { useState } from "react";
import { useNavigate } from "react-router";
import { AiFillDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import type { TravelPlan } from "../../types/TravelPlan";
import { useAuth } from "../../context/useAuth";
import { deleteTravelPlan } from "../../utils/api/travel-plan";

const TravelPlanCard = ({ travelPlan }: { travelPlan: TravelPlan }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const onViewDetails = () => {
    navigate(`/dashboard/${user?.id}/travel-plans/${travelPlan.id}`);
  };

  const onDelete = async () => {
    setDeleting(true);
    try {
      const status = await deleteTravelPlan(travelPlan.id);
      if (status === 204) {
        toast.success("Travel plan deleted successfully");
        setShowDeleteModal(false);
      } else {
        toast.error("Failed to delete travel plan");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="card bg-base-100 shadow-md relative">
        <div className="card-body">
          {user?.id === travelPlan.planner_id && (
            <button
              className="absolute top-2 right-2 text-error hover:text-red-600"
              onClick={() => setShowDeleteModal(true)}
              title="Delete"
            >
              <AiFillDelete size={20} />
            </button>
          )}
          <h2 className="card-title">{travelPlan.title}</h2>
          <p>
            {travelPlan.starting_point_name} <span className="font-bold"> - to - </span> {travelPlan.destination_name}
          </p>
          <p className="text-sm text-gray-500">
            {travelPlan.description.slice(0, 100)}...
          </p>
          <div className="card-actions justify-end">
            <button className="btn btn-secondary btn-sm" onClick={onViewDetails}>
              View Details
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <dialog id="delete_travel_plan_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete this travel plan: <strong>{travelPlan.title}</strong>?
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={onDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowDeleteModal(false)}>Close</button>
          </form>
        </dialog>
      )}
    </>
  );
};

export default TravelPlanCard;
