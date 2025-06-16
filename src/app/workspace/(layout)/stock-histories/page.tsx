import StockHistoriesList from "./stock-histories-list";
import { Suspense } from "react";

export default function StockPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StockHistoriesList />
        </Suspense>
    );
}
