/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                pathname: '/ecommerce-fashion/**',
            },
            {
                protocol: 'https',
                hostname: "res.cloudinary.com",
                pathname: "/db9vcatme/**",
            },
            {
                protocol: 'https',
                hostname: "product.hstatic.net",
                pathname: "/**",
            },
            {
                protocol: 'https',
                hostname: "lh3.googleusercontent.com",
                pathname: "/**",
            },
        ],
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    }
};

export default nextConfig;
