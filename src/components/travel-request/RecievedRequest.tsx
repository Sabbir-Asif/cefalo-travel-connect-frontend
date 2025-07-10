import React, { useEffect, useState } from 'react';
import type { TravelRequestWithUsers } from '../../types/TravelRequest';
import { useAuth } from '../../context/useAuth';
import { getRecievedRequestByUserAPI } from '../../utils/api/travel-request';
import RequestCard from './RequestCard';

const RecievedRequest: React.FC = () => {
    const [requests, setRequests] = useState<TravelRequestWithUsers[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) return;

        const fetchRequests = async () => {
            setLoading(true);
            const data = await getRecievedRequestByUserAPI(user.id);
            setRequests(data);
            setLoading(false);
        }

        fetchRequests();

    }, [user?.id])

    if (loading) {
        return <div>
            Loading ...
        </div>
    }

    if (requests.length === 0) {
        return <div>
            No request found
        </div>
    }

    return (
        <div className="mt-6 max-w-4xl">
            <h2 className="font-nunito font-bold mb-2">Recieved Requests</h2>
            {
                requests.map(request => (
                    <RequestCard
                        key={request.id}
                        request={request}
                        type="recieved"
                    />
                ))
            }
        </div>
    );
};

export default RecievedRequest;