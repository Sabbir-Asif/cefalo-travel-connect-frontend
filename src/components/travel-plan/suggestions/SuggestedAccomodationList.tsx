import React, { useEffect, useState } from 'react';
import type { TravelPlan } from '../../../types/TravelPlan';
import type { Lodge } from '../../../types/Lodge';
import { searchLodgeAPI } from '../../../utils/api/lodge';
import SuggestedAccomodationsCard from './SuggestedAccomodationsCard';

const SuggestedAccomodationList: React.FC<{ travelPlan: TravelPlan }> = ({ travelPlan }) => {
    const [accomodations, setAccomodations] = useState<Lodge[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!travelPlan) return;
        const fetchTransports = async () => {
            setLoading(true);
            const data = await searchLodgeAPI(travelPlan.destination_name, '');
            setAccomodations(data);
            setLoading(false);
        }
        fetchTransports();
    }, [travelPlan])

    if (loading) {
        return <div>
            Loading...
        </div>
    }

    if (accomodations.length === 0) {
        return <div className="font-nunito font-semibold">
            No suggestions Found
        </div>
    }


    return (
        <div className="grid grid-cols-2 gap-2">
            {accomodations.map((accomodation) => (
                <SuggestedAccomodationsCard
                    key={accomodation.id}
                    accomodation={accomodation}
                />
            ))}
        </div>
    );
};

export default SuggestedAccomodationList;