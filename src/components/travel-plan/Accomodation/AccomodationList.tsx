import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getAccomodationsForTravelPlanAPI } from '../../../utils/api/travel-plan';
import type { Lodge } from '../../../types/Lodge';
import AccomodationCard from './AccomodationCard';
import CreateAccomodationModal from './CreateAccomodationModal';

const AccomodationList: React.FC = () => {
    const { travelPlanId } = useParams();
    const [accomodations, setAccomodations] = useState<Lodge[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

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

    const handleAddLodge = (newLodge: Lodge) => {
        setAccomodations(prev => [...prev, newLodge]);
    };

    const handleDelete = (deletedId: string) => {
        setAccomodations(prev => prev.filter(a => a.id !== deletedId));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-start mb-4">
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    + Add Accommodation
                </button>
            </div>

            {accomodations.length === 0 ? (
                <div>
                    No Accommodation for this plan.
                </div>
            ) : (
                <div className="space-y-2 grid grid-cols-2 gap-2">
                    {accomodations.map((accomodation) => (
                        <AccomodationCard 
                            key={accomodation.id}
                            travelPlanId={travelPlanId!}
                            accomodation={accomodation}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {showModal && travelPlanId && (
                <CreateAccomodationModal
                    travelPlanId={travelPlanId}
                    onClose={() => setShowModal(false)}
                    onAdd={handleAddLodge}
                />
            )}
        </div>
    );
};

export default AccomodationList;
