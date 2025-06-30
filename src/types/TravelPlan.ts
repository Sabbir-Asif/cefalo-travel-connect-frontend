export type TravelPlanStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface TravelPlan {
    id: string;
    planner_id: string;
    title: string;
    starting_point_name: string;
    starting_point_location: {
        lat: number;
        long: number;
    };
    destination_name: string;
    destination_location: {
        lat: number;
        long: number;
    }
    starting_date: Date;
    ending_date: Date;
    budget: number;
    description: string;
    status: TravelPlanStatus;
    created_at: Date;
    updated_at: Date;
}