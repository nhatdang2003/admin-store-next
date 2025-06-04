import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import type { ShippingProfileCardProps } from "@/types/shipping";

export function ShippingProfileCard({
  profile,
  onEdit,
  onDelete,
}: ShippingProfileCardProps) {
  return (
    <Card className="shadow-lg flex-1">
      <CardContent className="p-6">
        <div className="flex justify-between items-start lg:flex-row flex-col gap-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">
                {profile.lastName} {profile.firstName}
              </h3>
              {profile.default && <Badge variant="secondary">Mặc định</Badge>}
            </div>
            <p className="text-gray-600">{profile.phoneNumber}</p>
            <p className="text-gray-600">
              {profile.address}, {profile.ward}, {profile.district},{" "}
              {profile.province}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(profile)}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
            {!profile.default && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(profile.id ?? 0)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
