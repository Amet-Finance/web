/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [{
            hostname: 'storage.amet.finance'
        }, {
            hostname: "static.coinstats.app"
        },
            {
                hostname: "miro.medium.com"
            }],
    }
}

module.exports = nextConfig
