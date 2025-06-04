"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STATUS_ORDER } from "@/constants/order";
import { useRouter, useSearchParams } from "next/navigation";
import router from "next/router";

export default function OrderStatusTabs() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value === "all") {
            params.delete("status");
        } else {
            params.set("status", value);
        }
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="w-full mb-6">
            <div className="overflow-x-auto">
                <Tabs
                    defaultValue="all"
                    className="w-full text-center"
                    onValueChange={handleTabChange}
                >
                    <TabsList className="w-max">
                        <TabsTrigger
                            value="all"
                            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
                        >
                            Tất cả
                        </TabsTrigger>
                        {STATUS_ORDER.map((status) => (
                            <TabsTrigger
                                key={status.value}
                                value={status.value}
                                className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
                            >
                                {status.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>
        </div>
    );
}
