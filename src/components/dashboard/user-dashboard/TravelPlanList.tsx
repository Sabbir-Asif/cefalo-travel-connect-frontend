import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getTravelPlansByPlannerId } from '../../../utils/api/travel-plan';
import type { TravelPlan } from '../../../types/TravelPlan';
import TravelPlanCard from '../../travel-plan/TravelPlanCard';
import { useNavigate } from 'react-router';

const TravelPlanList: React.FC = () => {
    const { user } = useAuth();
    const [plans, setPlans] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            const planData = await getTravelPlansByPlannerId(user.id);
            setPlans(planData);
        };

        fetchData();
    }, [user?.id]);

    if (plans.length === 0) {
        return <div>
            No Plan Found
        </div>
    }

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Travel Plans</h3>
            <div className="">
                <button
                    className="btn btn-primary"
                    onClick={() => {
                       navigate('/create-travel-plan')
                    }}
                >
                    + Create Travel Plan
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan: TravelPlan) => (
                    <TravelPlanCard
                        key={plan.id}
                        travelPlan={plan}
                    />
                ))}
            </div>
        </div>
    );
};

export default TravelPlanList;