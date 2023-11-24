import Script from "next/script";

export default function GoogleAnalytics() {
    return (
        <>
            <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=G-JG562EL5SM`}/>

            <Script strategy="lazyOnload" id=''>
                {`
                    window.dataLayer = window.dataLayer || [];
                    function 
                    gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-JG562EL5SM', {
                    page_path: window.location.pathname,
                    });
                `}
            </Script>
        </>
    );
}
