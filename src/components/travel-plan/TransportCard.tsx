import { type TourTransportWithTransport } from "../../types/TourTransport";

interface TransportCardProps {
  transport: TourTransportWithTransport;
}

const TransportCard: React.FC<TransportCardProps> = ({ transport }) => {

  const formatDateTime = (dateValue: string | Date | null) => {
    if (!dateValue) {
      return { date: "", time: "" };
    }
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    if (isNaN(date.getTime())) {
      return { date: "Invalid date", time: "" };
    }
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const departure = formatDateTime(transport.departure_time);
  const arrival = formatDateTime(transport.transport.arrival_time);

  console.log(transport)

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-start mb-4">
          <h2 className="card-title text-xl font-bold">{transport.transport?.name}</h2>
          <div className="badge badge-primary badge-outline">{transport.transport.type}</div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="font-semibold text-lg">{transport.transport.starting_location}</div>
              <div className="text-sm text-base-content/70">{departure.date}</div>
              <div className="text-sm font-medium">{departure.time}</div>
            </div>
            
            <div className="flex-1 mx-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <div className="flex-1 h-0.5 bg-base-300 mx-2"></div>
                <div className="w-3 h-3 bg-primary rounded-full"></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="font-semibold text-lg">{transport.transport.destination}</div>
              <div className="text-sm text-base-content/70">{arrival.date}</div>
              <div className="text-sm font-medium">{arrival.time}</div>
            </div>
          </div>

          <div className="divider"></div>
          <div className="flex justify-between items-center">
            <span className="text-base-content/70">Fare</span>
            <span className="text-xl font-bold text-primary">৳{transport.transport.fare}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportCard;