import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    className = "",
}: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    return (
        <>
            {totalPages > 1 && (
                <div
                    className={`flex justify-center items-center space-x-2 ${className}`}
                >
                    {currentPage !== 1 ? (
                        <Link href={createPageURL(currentPage - 1)} passHref>
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                    ) : (
                        <Button variant="outline" size="icon" disabled>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    )}

                    <span>
                        Trang {currentPage} / {totalPages}
                    </span>

                    {currentPage !== totalPages ? (
                        <Link href={createPageURL(currentPage + 1)} passHref>
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    ) : (
                        <Button variant="outline" size="icon" disabled>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            )}
        </>
    );
}
