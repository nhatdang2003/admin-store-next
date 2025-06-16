import { Suspense } from "react";
import ReviewList from "./review-list";

export default function ReviewsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReviewList />
        </Suspense>
    );
}