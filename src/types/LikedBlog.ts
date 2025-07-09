export interface LikedBlog {
    blog_id: string;
    user_id: string;
    reaction_name: string;
}

export interface LikedBlogResponse {
    blog_id: string;
    user_id: string;
    reaction_name: string;
    created_at: Date;
}
