import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { type TravelPlan } from "../../types/TravelPlan";
import { getTravelPlanByIdAPI } from "../../utils/api/travel-plan";
import PlanDetails from "./PlanDetails";
import PlanMap from "./PlanMap";
import MemberList from "./member/MemberList";
import TransportList from "./transport/TransportList";
import AccomodationList from "./Accomodation/AccomodationList";
import GroupDiscussion from "./discussion/GroupDiscussion";
import SuggestedMemberList from "./suggestions/SuggestedMemberList";

type TabOption = "members" | "transports" | "accommodations" | "foods";

const TravelPlanPage: React.FC = () => {
    const { travelPlanId } = useParams();
    const [travelPlan, setTravelPlan] = useState<TravelPlan>({} as TravelPlan);
    const [isLoading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<TabOption>("members");
    const [suggestionsTab, setSuggestionsTab] = useState<TabOption>("members");

    useEffect(() => {
        if (!travelPlanId) return;
        const fetchTravelPlan = async () => {
            setLoading(true);
            const data = await getTravelPlanByIdAPI(travelPlanId);
            setTravelPlan(data);
            setLoading(false);
        };
        fetchTravelPlan();
    }, [travelPlanId]);

    if (isLoading) return <div>Loading...</div>;

    if (!travelPlan?.id) return <div>No travel plan found by this ID</div>;

    return (
        <div className="space-y-6 relative">
            <div className="fixed bottom-4 right-6 z-50">
                <GroupDiscussion />
            </div>

            <div className="grid grid-cols-3 gap-8">
                <div className="flex justify-start gap-8 col-span-2">
                    <PlanMap
                        key={travelPlan.id}
                        travelPlan={travelPlan}
                    />
                    <PlanDetails
                        key={travelPlan.id + new Date()}
                        travelPlan={travelPlan}
                    />
                </div>
                <div className="border-l pl-4">
                    <h2 className="text-xl fonr-nunito font-bold text-center">Suggestions</h2>
                    <div role="tablist" className="tabs tabs-boxed font-bold font-nunito">
                        <button
                            role="tab"
                            className={`tab ${suggestionsTab === "members" ? "tab-active" : ""}`}
                            onClick={() => setSuggestionsTab("members")}
                        >
                            Members
                        </button>
                        <button
                            role="tab"
                            className={`tab ${suggestionsTab === "transports" ? "tab-active" : ""}`}
                            onClick={() => setSuggestionsTab("transports")}
                        >
                            Transports
                        </button>
                        <button
                            role="tab"
                            className={`tab ${suggestionsTab === "accommodations" ? "tab-active" : ""}`}
                            onClick={() => setSuggestionsTab("accommodations")}
                        >
                            Accommodations
                        </button>
                    </div>

                    <div className="mt-4">
                        {suggestionsTab === "members" && <SuggestedMemberList />}
                        {suggestionsTab === "transports" && <TransportList />}
                        {suggestionsTab === "accommodations" && <AccomodationList />}
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <div role="tablist" className="tabs tabs-boxed font-bold font-nunito">
                    <button
                        role="tab"
                        className={`tab ${activeTab === "members" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("members")}
                    >
                        Members
                    </button>
                    <button
                        role="tab"
                        className={`tab ${activeTab === "transports" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("transports")}
                    >
                        Transports
                    </button>
                    <button
                        role="tab"
                        className={`tab ${activeTab === "accommodations" ? "tab-active" : ""}`}
                        onClick={() => setActiveTab("accommodations")}
                    >
                        Accommodations
                    </button>
                </div>

                <div className="mt-4">
                    {activeTab === "members" && <MemberList />}
                    {activeTab === "transports" && <TransportList />}
                    {activeTab === "accommodations" && <AccomodationList />}
                </div>
            </div>
        </div>
    );
};

export default TravelPlanPage;