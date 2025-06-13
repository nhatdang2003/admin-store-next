import React, { Suspense } from "react";
import ReturnRequestList from "./return-request-list";

export default async function ReturnRequestsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReturnRequestList />
        </Suspense>
    );
}
