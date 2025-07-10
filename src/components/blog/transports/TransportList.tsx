import { useEffect, useState } from "react";
import { useParams } from "react-router";
import TransportCard from "./TransportCard";
import CreateTransportModal from "./CreateTransportModal";
import { getTransportsForBlogAPI } from "../../../utils/api/blog";
import type { Transport } from "../../../types/Transport";

const TransportList: React.FC = () => {
  const { blogId } = useParams();
  const [transports, setTransports] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!blogId) return;

    const fetchData = async () => {
      setLoading(true);
      const data = await getTransportsForBlogAPI(blogId);
      setTransports(data);
      setLoading(false);
    };

    fetchData();
  }, [blogId]);

  const handleCreate = (newTransport: Transport) => {
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
              blogId={blogId!}
              transport={transport}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {modalOpen && blogId && (
        <CreateTransportModal
          blogId={blogId}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default TransportList;
