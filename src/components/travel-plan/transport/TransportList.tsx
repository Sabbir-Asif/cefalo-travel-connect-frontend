import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { gettransportsForTravelPlanAPI } from "../../../utils/api/transport";
import TransportCard from "./TransportCard";
import CreateTransportModal from "./CreateTransportModal";
import type { TourTransportWithTransport } from "../../../types/TourTransport";

const TransportList: React.FC = () => {
  const { travelPlanId } = useParams();
  const [transports, setTransports] = useState<TourTransportWithTransport[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!travelPlanId) return;

    const fetchData = async () => {
      setLoading(true);
      const data = await gettransportsForTravelPlanAPI(travelPlanId);
      setTransports(data);
      setLoading(false);
    };

    fetchData();
  }, [travelPlanId]);

  const handleCreate = (newTransport: TourTransportWithTransport) => {
    setTransports((prev) => [...prev, newTransport]);
  };

  const handleDelete = (deletedId: string) => {
    setTransports((prev) => prev.filter((t) => t.id !== deletedId));
  };

  return (
    <div>
      <div className="flex justify-start mb-4">
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          + Add Transport
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : transports.length === 0 ? (
        <div>No Transport found!</div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {transports.map((transport) => (
            <TransportCard
              key={transport.id}
              transport={transport}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {modalOpen && travelPlanId && (
        <CreateTransportModal
          travelPlanId={travelPlanId}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default TransportList;
