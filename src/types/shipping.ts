import { shippingProfileSchema } from "@/schemas/shipping.schema";
import * as z from "zod";

export type ShippingProfile = z.infer<typeof shippingProfileSchema>;

export interface ShippingProfileCardProps {
  profile: ShippingProfile;
  onEdit: (profile: ShippingProfile) => void;
  onDelete: (id: number) => void;
}
