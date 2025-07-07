import type { Lodge } from "../../../types/Lodge";

const SuggestedAccomodationsCard: React.FC<{ accomodation: Lodge }> = ({ accomodation }) => {
    return (
        <div className="font-nunito">
            <h2 className="text-lg font-bold">{accomodation.name}</h2>
            <p>{accomodation.location_name}</p>
            <p className="font-semibold">fare: {accomodation.price}</p>
        </div>
    );
};

export default SuggestedAccomodationsCard;