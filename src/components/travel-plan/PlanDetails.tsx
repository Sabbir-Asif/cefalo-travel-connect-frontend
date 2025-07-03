import React from 'react';
import type { TravelPlan } from '../../types/TravelPlan';
import { FaLocationDot } from "react-icons/fa6";

const PlanDetails: React.FC<{ travelPlan: TravelPlan }> = ({ travelPlan }) => {
    const startingDate = new Date(travelPlan.starting_date).toLocaleDateString();
    const endingDate = new Date(travelPlan.ending_date).toLocaleDateString();

    return (
        <div className="font-nunito">
            <h2 className="text-xl font-bold">{travelPlan.title}</h2>
            <p className="font-semibold flex gap-1 items-center text-blue-500 mb-3">
                <FaLocationDot />
                {travelPlan.destination_name}
            </p>
            <p className="font-semibold">
                Starting Date: <span>{startingDate}</span>
            </p>
            <p className="font-semibold">
                Ending Date: <span>{endingDate}</span>
            </p>
            <p className="font-bold mt-2">
                Starting Point: <span>
                    {travelPlan.starting_point_name}
                </span>
            </p>
            <p className="font-semibold flex items-center gap-2">
                <span className="font-bold">
                    Budget:
                </span>
                <span>
                    {travelPlan.budget} taka
                </span>
            </p>
        </div>
    );
};

export default PlanDetails;