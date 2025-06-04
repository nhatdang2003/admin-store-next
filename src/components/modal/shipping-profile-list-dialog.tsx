"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { ShippingProfileDialog } from "./shipping-profile-dialog";
import { ShippingProfileCard } from "../shipping/shipping-profile-card";
import {
  useShippingProfiles,
  useDeleteShippingProfile,
  useUpdateShippingProfile,
} from "@/hooks/use-shipping-query";

interface ShippingProfile {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  wardId: number;
  ward: string;
  districtId: number;
  district: string;
  provinceId: number;
  province: string;
  default: boolean;
}

interface ShippingProfileListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profiles: ShippingProfile[];
  selectedProfileId?: number;
  onSelect: (profile: ShippingProfile) => void;
}

export function ShippingProfileListDialog({
  open,
  onOpenChange,
  profiles,
  selectedProfileId,
  onSelect,
}: ShippingProfileListDialogProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedProfile, setSelectedProfile] =
    useState<ShippingProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShippingProfile | null>(
    profiles[0]
  );

  const deleteProfile = useDeleteShippingProfile();

  const handleEdit = (profile: ShippingProfile) => {
    setSelectedProfile(profile);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteProfile.mutate(id);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chọn địa chỉ giao hàng</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh] pt-6">
            <RadioGroup
              defaultValue={selectedProfileId?.toString()}
              onValueChange={(value) => {
                const profile = profiles.find((p) => p.id.toString() === value);
                if (profile) setSelectedItem(profile);
              }}
              className="space-y-4"
            >
              {profiles.map((profile) => (
                <div key={profile.id} className="flex items-center gap-2">
                  <RadioGroupItem value={profile.id.toString()} />
                  <ShippingProfileCard
                    key={profile.id}
                    profile={profile}
                    onEdit={() => handleEdit(profile)}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </RadioGroup>
          </ScrollArea>

          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={() => setShowAddDialog(true)}>
              Thêm địa chỉ mới
            </Button>
            <Button
              onClick={() => {
                console.log(selectedItem);
                if (selectedItem) {
                  onSelect(selectedItem);
                  onOpenChange(false);
                }
              }}
            >
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ShippingProfileDialog
        profile={selectedProfile}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      <ShippingProfileDialog
        profile={null}
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </>
  );
}
