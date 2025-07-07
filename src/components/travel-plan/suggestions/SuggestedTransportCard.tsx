import type { Transport } from "../../../types/Transport";

const SuggestedTransportCard: React.FC<{ transport: Transport }> = ({ transport }) => {
    return (
        <div className="font-nunito">
            <h2 className="text-lg font-bold">{transport.name}</h2>
            <p>{transport.starting_location} - to - {transport.destination}</p>
            <p className="font-semibold">fare: {transport.fare}</p>
        </div>
    );
};

export default SuggestedTransportCard;