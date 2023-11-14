/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [{
            hostname: 'storage.amet.finance'
        }]
    }
}

module.exports = nextConfig
