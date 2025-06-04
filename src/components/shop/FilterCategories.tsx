import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function FilterCategories({ categories, className = "" }: any) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Lấy categories từ URL khi component mount
    const categoriesFromUrl = searchParams.get("categories")?.split(",") || [];
    console.log(categoriesFromUrl);
    setSelectedCategories(categoriesFromUrl);
  }, [searchParams]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newSelectedCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId);

    setSelectedCategories(newSelectedCategories);

    // Cập nhật URL
    const params = new URLSearchParams(searchParams);
    if (newSelectedCategories.length > 0) {
      params.set("categories", newSelectedCategories.join(","));
    } else {
      params.delete("categories");
    }

    // Reset về trang 1 khi filter thay đổi
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={className}>
      <h3 className="font-semibold mb-2">Danh mục</h3>
      <ul className="space-y-2">
        {categories.map((category: any) => (
          <li key={category.id} className="flex items-center">
            <Checkbox
              id={category.id}
              checked={selectedCategories.includes(category.id.toString())}
              onCheckedChange={(checked) =>
                handleCategoryChange(category.id.toString(), checked as boolean)
              }
            />
            <Label htmlFor={category.id} className="ml-2">
              {category.name}
            </Label>
          </li>
        ))}
      </ul>
    </div>
  );
}
