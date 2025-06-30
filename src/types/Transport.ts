export type TransportType = "BUS" | "TRAIN" | "FLIGHT" | "BOAT" | "OTHER"

export interface Transport {
    id: string;
    type: TransportType;
    name: string;
    starting_location: string;
    starting_point: {
        lat: number;
        long: number;
    };
    destination: string;
    destination_point: {
        lat: number;
        long: number;
    };
    departure_time: Date | null;
    arrival_time: Date | null;
    fare: string;
    created_at: Date;
    updated_at: Date;
}
