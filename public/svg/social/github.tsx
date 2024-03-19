import Link from "next/link";
import {URLS} from "@/modules/utils/urls";

export default function GithubSVG({url}: { url: string }) {

    const title = url === URLS.Github ? "Amet Finance Github" : "";

    return (
        <Link href={url} target="_blank" rel="noreferrer" title={title}>
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"
                 className='cursor-pointer hover:fill-white'>
                <path
                    d="M16 0C7.16 0 0 7.34598 0 16.406C0 23.656 4.584 29.8041 10.94 31.9717C11.74 32.1261 12.0333 31.6183 12.0333 31.1828C12.0333 30.7933 12.02 29.761 12.0133 28.3933C7.56267 29.3825 6.624 26.1923 6.624 26.1923C5.896 24.2988 4.844 23.7923 4.844 23.7923C3.39467 22.7753 4.956 22.7962 4.956 22.7962C6.56267 22.9103 7.40667 24.4866 7.40667 24.4866C8.83333 26.9951 11.152 26.2702 12.0667 25.8514C12.2107 24.7899 12.6227 24.0678 13.08 23.6574C9.52667 23.247 5.792 21.8362 5.792 15.5504C5.792 13.7598 6.412 12.2962 7.43867 11.1484C7.25867 10.7338 6.71867 9.0656 7.57867 6.80616C7.57867 6.80616 8.91867 6.36651 11.9787 8.48822C13.2587 8.1237 14.6187 7.94284 15.9787 7.93449C17.3387 7.94284 18.6987 8.1237 19.9787 8.48822C23.0187 6.36651 24.3587 6.80616 24.3587 6.80616C25.2187 9.0656 24.6787 10.7338 24.5187 11.1484C25.5387 12.2962 26.1587 13.7598 26.1587 15.5504C26.1587 21.8529 22.4187 23.24 18.8587 23.6435C19.4187 24.136 19.9387 25.1419 19.9387 26.6793C19.9387 28.8747 19.9187 30.6388 19.9187 31.1717C19.9187 31.6016 20.1987 32.115 21.0187 31.9508C27.42 29.7971 32 23.6449 32 16.406C32 7.34598 24.836 0 16 0Z"
                    fill="#7D7D7D"/>
            </svg>
        </Link>
    )
}
