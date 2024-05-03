import Head from "next/head";
import {MetaConstants} from "@/components/headers/constants";
import {MetaInfo} from "@/components/headers/types";

export default function Headers({id, meta}: Readonly<{ id: string, meta?: MetaInfo }>) {

    const defaultMeta = MetaConstants[id] || MetaConstants["default"];
    const {title, description, ogImage} = {
        ...defaultMeta,
        ...(meta || {})
    }

    const ogImg = ogImage ?? MetaConstants["default"].ogImage

    return (
        <Head>
            <title>{title}</title>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/site.webmanifest"/>

            <meta charSet="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta name="description" content={description}/>
            <meta name="keywords" content="Amet Finance, DeFi, decentralized finance, bonds, blockchain"/>
            <meta name="author" content="Amet Finance"/>

            <meta property="og:title" content={title}/>
            <meta property="og:description" content={description}/>
            <meta property="og:image" content={ogImg}/>
            <meta property="og:url" content="https://amet.finance"/>

            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={title}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content={ogImg}/>
        </Head>
    )
}
