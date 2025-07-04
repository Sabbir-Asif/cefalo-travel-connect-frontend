import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { gettransportsForTravelPlanAPI } from "../../../utils/api/transport";
import TransportCard from "./TransportCard";
import type { TourTransportWithTransport } from "../../../types/TourTransport";

const TransportList: React.FC = () => {
    const { travelPlanId } = useParams();
    const [transports, setTransports] = useState<TourTransportWithTransport[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!travelPlanId) return;

        const fetchData = async () => {
            setLoading(true);
            const data = await gettransportsForTravelPlanAPI(travelPlanId);
            setTransports(data);
            setLoading(false);
        };

        fetchData();
    }, [travelPlanId])

    if (loading) return <div>Loading...</div>;

    if (!loading && transports.length === 0) {
        return <div>No Transport found!</div>;
    }

    return (
        <div>
            <div className="grid grid-cols-2 gap-2">
                {
                    transports.map(transport => (
                        <TransportCard 
                        key={transport.id}
                        transport={transport}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default TransportList;