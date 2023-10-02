import Head from "next/head";

export default function Headers() {
    return <>
        <Head>
            <title>Amet Finance - Empowering Your Financial Future in DeFi</title>
            <link rel="shortcut icon" href="/favicon.ico?version=3"/>

            <meta charSet="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta name="description" content="Amet Finance - Empowering Your Financial Future in DeFi"/>
            <meta name="keywords" content="Amet Finance, DeFi, decentralized finance, bonds, blockchain"/>
            <meta name="author" content="Amet Finance"/>

            <meta property="og:title" content="Amet Finance - Empowering Your Financial Future in DeFi"/>
            <meta property="og:description"
                  content="Amet Finance offers on-chain bonds and investment opportunities in decentralized finance (DeFi)."/>
            <meta property="og:image" content="https://example.com/your-image.jpg"/>
            <meta property="og:url" content="https://amet.finance"/>

            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content="Amet Finance - Empowering Your Financial Future in DeFi"/>
            <meta name="twitter:description"
                  content="Amet Finance offers on-chain bonds and investment opportunities in decentralized finance (DeFi)."/>
            <meta name="twitter:image" content="https://example.com/your-image.jpg"/>
        </Head>
    </>
}