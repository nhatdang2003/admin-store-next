import React, { Suspense } from "react";
import { userApi } from "@/services/user.api";
import UserList from "./user-list";
import { PAGE_SIZE } from "@/constants/page-size";

export const dynamic = "force-dynamic";

export default async function PromotionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page: number;
    size: number;
    search: string;
  }>;
}) {
  let users = [];
  const { page, search } = await searchParams;
  try {
    users = await userApi.getUsers(page, PAGE_SIZE.LIST_USER, search);
  } catch (error) {
    console.log(error);
    return <div>Đã có lỗi xảy ra, vui lòng thử lại sau</div>;
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserList initialData={users} />
    </Suspense>
  );
}
