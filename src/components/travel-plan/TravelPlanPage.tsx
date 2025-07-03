import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { type TravelPlan } from "../../types/TravelPlan";
import { getTravelPlanByIdAPI } from "../../utils/api/travel-plan";
import PlanDetails from "./PlanDetails";
import PlanMap from "./PlanMap";

const TravelPlanPage: React.FC = () => {
    const { travelPlanId } = useParams();
    const [travelPlan, setTravelPlan] = useState<TravelPlan>({} as TravelPlan)
    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
        if (!travelPlanId) return;
        const fetchTravelPlan = async () => {
            setLoading(true);
            const data = await getTravelPlanByIdAPI(travelPlanId);
            setLoading(false)
            setTravelPlan(data);
        }

        fetchTravelPlan();
    }, [travelPlanId])

    if (!travelPlan) {
        return <div>
            No travel Plan found by this id
        </div>
    }

    if (isLoading) {
        return <div>
            Loading...
        </div>
    }

    console.log(travelPlan)
    return (
        <div className="flex justify-between">
            <PlanDetails
                key={travelPlan.id}
                travelPlan={travelPlan}
            />
            <PlanMap
                key={travelPlan.id}
                travelPlan={travelPlan}
            />
        </div>
    );
};

export default TravelPlanPage;