export interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

export interface CategoryListResponse {
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  data: Category[];
}
