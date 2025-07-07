import { useEffect, useState } from "react";
import type { TravelPlan } from "../../../types/TravelPlan";
import type { Transport } from "../../../types/Transport";
import { searchTransportAPI } from "../../../utils/api/transport";
import SuggestedTransportCard from "./SuggestedTransportCard";

const SuggestedTransportList: React.FC<{ travelPlan: TravelPlan }> = ({ travelPlan }) => {
    const [transports, setTransports] = useState<Transport[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!travelPlan) return;
        const fetchTransports = async () => {
            setLoading(true);
            const data = await searchTransportAPI(travelPlan.starting_point_name, travelPlan.destination_name, '');
            setTransports(data);
            setLoading(false);
        }
        fetchTransports();
    }, [travelPlan])

    if (loading) {
        return <div>
            Loading...
        </div>
    }

    if (transports.length === 0) {
        return <div className="font-nunito font-semibold">
            No suggestions Found
        </div>
    }

    return (
        <div className="grid grid-cols-2 gap-2">
            {transports.map((transport) => (
                <SuggestedTransportCard
                    key={transport.id}
                    transport={transport}
                />
            ))}
        </div>
    );
};

export default SuggestedTransportList;