import Head from "next/head";
import {MetaConstants} from "@/components/headers/constants";

export default function Headers({id, meta}: {
    id: string,
    meta?: { title: string, description: string, ogImage: string }
}) {

    const defaultMeta = MetaConstants[id] || MetaConstants["default"];
    const {title, description, ogImage} = {
        ...defaultMeta,
        ...(meta || {})
    }

    const ogImg = ogImage || MetaConstants["default"].ogImage

    return <>
        <Head>
            <title>{title}</title>
            <link rel="shortcut icon" href="/favicon.ico?version=5"/>

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
    </>
}
