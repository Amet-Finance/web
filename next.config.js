/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                hostname: 'storage.amet.finance'
            },
            {
                hostname: "miro.medium.com"
            },
            {
                hostname: "euc.li"
            }
        ],
    },
    swcMinify: true
}

module.exports = nextConfig
