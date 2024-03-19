import Link from "next/link";
import {URLS} from "@/modules/utils/urls";

export default function TwitterSVG({url}: { url: string }) {

    const title = url = URLS.Twitter ? "Amet Finance Twitter" : "";

    return (
        <Link href={url} target="_blank" rel="noreferrer" title={title}>
            <svg
                width="26" height="26"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className='cursor-pointer hover:fill-white'>
                <path
                    d="M16 0.0410156C12.8355 0.0410156 9.74207 0.979399 7.11088 2.7375C4.4797 4.4956 2.42894 6.99446 1.21793 9.91808C0.00693251 12.8417 -0.309921 16.0588 0.307443 19.1625C0.924806 22.2662 2.44866 25.1171 4.6863 27.3547C6.92394 29.5924 9.77487 31.1162 12.8786 31.7336C15.9823 32.3509 19.1993 32.0341 22.1229 30.8231C25.0466 29.6121 27.5454 27.5613 29.3035 24.9301C31.0616 22.299 32 19.2055 32 16.041C32 11.7976 30.3143 7.72789 27.3137 4.72731C24.3131 1.72673 20.2435 0.0410156 16 0.0410156ZM24.2358 11.8305C24.2358 12.0115 24.2505 12.1926 24.2505 12.38C24.2505 17.9947 19.9747 24.4726 12.1537 24.4726C9.8395 24.4818 7.57237 23.8192 5.62738 22.5652C5.96464 22.6074 6.30434 22.6271 6.64422 22.6242C8.55174 22.6243 10.4045 21.9863 11.9074 20.8115C11.0218 20.7854 10.1659 20.4859 9.4573 19.954C8.74867 19.4222 8.22198 18.6841 7.94948 17.841C8.21493 17.8936 8.48524 17.9176 8.7558 17.9126C9.13154 17.9159 9.50606 17.8691 9.86948 17.7736C8.90844 17.5748 8.04525 17.0508 7.42523 16.2901C6.80521 15.5293 6.4662 14.5782 6.46527 13.5968V13.5505C7.05393 13.8768 7.71248 14.0566 8.38527 14.0747C7.48389 13.4724 6.84657 12.5486 6.60357 11.492C6.36057 10.4355 6.53024 9.32609 7.0779 8.39049C8.14298 9.70646 9.47375 10.7829 10.9832 11.5494C12.4927 12.316 14.147 12.7554 15.8379 12.8389C15.7692 12.5208 15.736 12.196 15.739 11.8705C15.7382 11.0178 15.9941 10.1846 16.4733 9.47927C16.9526 8.77396 17.6329 8.22918 18.426 7.91578C19.219 7.60238 20.088 7.53488 20.9199 7.72204C21.7518 7.90921 22.5081 8.34238 23.0905 8.96523C24.0409 8.77833 24.9523 8.43014 25.7853 7.93575C25.4709 8.92147 24.8057 9.75751 23.9158 10.2852C24.76 10.1803 25.5846 9.95412 26.3642 9.61365C25.7961 10.4764 25.0747 11.2278 24.2358 11.8305Z"
                    fill="#7D7D7D"/>
            </svg>
        </Link>
    )
}
