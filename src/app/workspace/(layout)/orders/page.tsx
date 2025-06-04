import React, { Suspense } from "react";
import OrderList from "./order-list";

export default async function OrdersPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrderList />
        </Suspense>
    );
}
