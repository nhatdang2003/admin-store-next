import { STATUS_CODE } from "@/constants/response";
import { redirect } from "next/navigation";
import Cookies from "js-cookie";
import * as jose from "jose";

const publicApi = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/activate",
];

const request = async (
    url: string,
    base_url?: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any,
    options: any = {}
) => {
    let baseURL;
    if (base_url === undefined) {
        baseURL = process.env.NEXT_PUBLIC_API_BACKEND;
    } else if (base_url === "") {
        baseURL = process.env.NEXT_PUBLIC_API_LOCAL;
    } else {
        baseURL = base_url;
    }

    const defaultHeaders: {
        "Content-Type"?: string;
        Authorization?: string;
    } = {
    };

    let token;
    if (typeof window !== "undefined") {
        token = Cookies.get("access_token");
    } else if (!publicApi.map((api) => url.includes(api)).includes(true)) {
        // Server-side
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        token = cookieStore.get("access_token")?.value;
    }
    if (token && !publicApi.map((api) => url.includes(api)).includes(true)) {
        defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const isFormData = options.body instanceof FormData;

    const headers = isFormData
        ? { ...defaultHeaders, ...options.headers }
        : {
            "Content-Type": "application/json",
            ...defaultHeaders,
            ...options.headers,
        };

    const fetchOptions = {
        method,
        headers,
        ...options,
    };

    if (body && !isFormData) {
        fetchOptions.body = JSON.stringify(body);
    } else if (body && isFormData) {
        fetchOptions.body = body; // Thêm body khi là FormData
    }

    try {
        const response = await fetch(`${baseURL}${url}`, {
            ...fetchOptions,
            cache: "no-store",
            credentials: 'include'
        });
        // Handle HTTP errors
        if (!response.ok) {
            if (response.status === STATUS_CODE.UNAUTHORIZED) {
                const refreshResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_LOCAL}/api/auth/refresh-token`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (refreshResponse.ok) {
                    return request(url, base_url, method, body, options);
                } else {
                    const decodedToken = jose.decodeJwt(token || "");
                    if (typeof window !== "undefined") {
                        window.location.href = "/login";
                    } else {
                        redirect("/login");
                    }
                }
            }
            const errorData = await response.json();
            console.log(errorData);
            throw new Error(errorData.message || "Something went wrong!");
        }
        if (response.status === STATUS_CODE.NO_CONTENT) {
            return null;
        }
        return await response.json();
    } catch (error: any) {
        console.error("API Error:", error.message);
        throw error; // Rethrow to handle in calling code
    }
};

const http = {
    get: (params: {
        url: string;
        base_url?: string;
        // token?: string;
        options?: any;
    }) =>
        request(
            params.url,
            params.base_url,
            //   params.token,
            "GET",
            null,
            params.options
        ),

    post: (params: {
        url: string;
        base_url?: string;
        // token?: string;
        body?: any;
        options?: any;
    }) =>
        request(
            params.url,
            params.base_url,
            //   params.token,
            "POST",
            params.body,
            params.options
        ),

    put: (params: {
        url: string;
        base_url?: string;
        // token?: string;
        body?: any;
        options?: any;
    }) =>
        request(
            params.url,
            params.base_url,
            //   params.token,
            "PUT",
            params.body,
            params.options
        ),

    delete: (params: {
        url: string;
        base_url?: string;
        // token?: string;
        options?: any;
    }) =>
        request(
            params.url,
            params.base_url,
            //   params.token,
            "DELETE",
            null,
            params.options
        ),
};

export default http;
