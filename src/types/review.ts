export interface UserReviewDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    totalReview: number;
    totalSpend: number;
}

export interface productVariantDTO {
    id: number;
    productName: string;
    color: string;
    size: string;
    price: number;
    imageUrl: string;
}

export interface Review {
    reviewId: number;
    orderCode: string;
    rating: number;
    description: string;
    createdAt: string;
    userReviewDTO: UserReviewDTO;
    productVariantDTO: productVariantDTO;
    videoUrl: string;
    imageUrls: string[];
    published: boolean;
}

export interface ReviewListResponse {
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    data: Review[];
} 