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
            },
            {
                hostname: "euc.li"
            }
        ],
    }
}

module.exports = nextConfig
