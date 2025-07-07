import type { Transport } from "../../../types/Transport";

const SuggestedTransportCard: React.FC<{ transport: Transport }> = ({ transport }) => {
    return (
        <div>
            <h2>{transport.name}</h2>
            <p>{transport.starting_location} - to - {transport.destination}</p>
            <p>fare: {transport.fare}</p>
        </div>
    );
};

export default SuggestedTransportCard;