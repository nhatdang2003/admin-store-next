import React, { Suspense } from "react";
import CategoryList from "./category-list";

export default async function CategoriesPage() {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CategoryList />
        </Suspense>
    );
}
