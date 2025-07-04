
import StockList from "./stock-list";
import { Suspense } from "react";

export default function StockPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StockList />
        </Suspense>
    );
}
