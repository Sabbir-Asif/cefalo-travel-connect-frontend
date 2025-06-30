import type { BlogInsight } from "./BlogInsight";
import type { Food } from "./Food";
import type { Lodge } from "./Lodge";
import type { Transport } from "./Transport";

export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Blog {
    id: string;
    title: string;
    userId: string;
    locationName: string;
    location_points: {
        lat: number;
        long: number;
    };
    description: string;
    cover_image: string | null;
    status: BlogStatus;
    tags: string[];
    images: string[];
    videos: string[];
    updated_at: Date;
}

export interface CreateBlog {
    title: string;
    locationName: string;
    location_points: {
        lat: number;
        long: number;
    };
    description: string;
    tags?: string[];
    images?: string[];
    videos?: string[];
}

export interface BlogDetailsResponse {
    blog: Blog;
    transports: Transport[];
    lodges: Lodge[];
    food: Food[];
    insights: BlogInsight[];
}
