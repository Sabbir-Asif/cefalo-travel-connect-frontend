import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getAccomodationsForTravelPlanAPI } from '../../../utils/api/travel-plan';
import type { Lodge } from '../../../types/Lodge';
import AccomodationCard from './AccomodationCard';

const AccomodationList: React.FC = () => {
    const { travelPlanId } = useParams();
    const [accomodations, setAccomodations] = useState<Lodge[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!travelPlanId) return;

        const fetchData = async () => {
            setLoading(true);
            const data = await getAccomodationsForTravelPlanAPI(travelPlanId);
            setAccomodations(data);
            setLoading(false);
        };

        fetchData();
    }, [travelPlanId]);

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if (accomodations.length === 0) {
        return (
            <div>
                No Accomodation for this plan.
            </div>
        )
    }

    return (
        <div>
            <div className="space-y-2 grid grid-cols-2 gap-2">
                {accomodations.map(accomodation => (
                    <AccomodationCard
                        key={accomodation.id}
                        accomodation={accomodation} />
                ))}
            </div>
        </div>
    );
};

export default AccomodationList;