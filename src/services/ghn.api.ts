export const ghnApi = {
  getProvince: async () => {
    const response = await fetch(
      "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
      {
        headers: {
          Token: "c2463b49-9094-11ef-8e53-0a00184fe694",
        },
      }
    );
    const data = await response.json();
    return data;
  },
  getDistrict: async (provinceId: number) => {
    const response = await fetch(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
      {
        headers: {
          Token: "c2463b49-9094-11ef-8e53-0a00184fe694",
        },
      }
    );
    const data = await response.json();
    return data;
  },
  getWard: async (districtId: number) => {
    const response = await fetch(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
      {
        headers: {
          Token: "c2463b49-9094-11ef-8e53-0a00184fe694",
        },
      }
    );
    const data = await response.json();
    return data;
  },
};
