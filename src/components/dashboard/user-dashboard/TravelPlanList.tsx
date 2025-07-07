import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import { getInvitedTravelPlansAPI, getTravelPlansByPlannerId } from '../../../utils/api/travel-plan';
import type { TravelPlan } from '../../../types/TravelPlan';
import TravelPlanCard from '../../travel-plan/TravelPlanCard';
import { useNavigate } from 'react-router';

const TravelPlanList: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [plans, setPlans] = useState<TravelPlan[]>([]);
    const [invitedPlans, setInvitedPlans] = useState<TravelPlan[]>([]);
    const [activeTab, setActiveTab] = useState<'your' | 'invited'>('your');

    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            const planData = await getTravelPlansByPlannerId(user.id);
            const invitedPlansData = await getInvitedTravelPlansAPI(user.id);
            setPlans(planData);
            setInvitedPlans(invitedPlansData);
        };

        fetchData();
    }, [user?.id]);

    const renderPlans = (list: TravelPlan[]) => {
        if (list.length === 0) {
            return (
                <div className="text-sm text-base-content/60 py-12 text-center">
                    No travel plans found.
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {list.map((plan) => (
                    <TravelPlanCard key={plan.id} travelPlan={plan} />
                ))}
            </div>
        );
    };

    return (
        <div className="px-4 py-6 font-nunito">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight">My Travel Plans</h2>
                <button
                    className="btn btn-md btn-primary"
                    onClick={() => navigate('/create-travel-plan')}
                >
                    + New Plan
                </button>
            </div>

            <div role="tablist" className="tabs tabs-lg">
                <button
                    role="tab"
                    className={`tab tab-sm transition-all ${activeTab === 'your' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('your')}
                >
                    Your Plans
                </button>
                <button
                    role="tab"
                    className={`tab tab-sm transition-all ${activeTab === 'invited' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('invited')}
                >
                    Invited Plans
                </button>
            </div>

            {activeTab === 'your' && renderPlans(plans)}
            {activeTab === 'invited' && renderPlans(invitedPlans)}
        </div>
    );
};

export default TravelPlanList;
