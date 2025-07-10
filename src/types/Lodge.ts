
export interface Lodge {
    id: string;
    name: string;
    location_name: string;
    location_point: {
        lat: number;
        long: number;
    };
    price: number;
    description?: string;
    cover_image?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateLodge {
    name: string;
    location_name: string;
    location_point: {
        lat: number;
        long: number;
    };
    price: number;
    description?: string;
    cover_image?: string;
}


export interface LodgeLocation {
    name: string,
    location_point: {
        lat: number;
        long: number;
    };
}