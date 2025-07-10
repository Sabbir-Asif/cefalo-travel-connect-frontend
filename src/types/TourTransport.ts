import { type Transport } from "./Transport";

export interface TourTransport {
  id: string;
  travelplan_id: string;
  transport_id: string;
  departure_time: Date;
  contact_number: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTourTransport {
  travelplan_id: string;
  transport_id: string;
  departure_time: Date;
  contact_number: string;
}

export interface UpdateTourTransport {
  departure_time?: Date;
  contact_number?: string;
}

export interface TourTransportWithTransport extends TourTransport {
  transport: Transport;
}
