/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
            hostname: 'storage.amet.finance'
            },
            {
                hostname: "miro.medium.com"
            }
        ],
    }
}

module.exports = nextConfig
