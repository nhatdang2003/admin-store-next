import React, { Suspense } from "react";
import PromotionList from "./promotion-list";

export default async function PromotionsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PromotionList />
        </Suspense>
    );
}
