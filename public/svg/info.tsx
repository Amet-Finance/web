import Link from "next/link";
import {stopPropagation} from "@/modules/utils/events";

type InfoType = {
    info: {
        title: string,
        url: string
    }
}

export default function InfoSVG({info}: InfoType) {

    return <>
        <Link href={info.url} title={info.title} onClick={stopPropagation} target="_blank" >
            <div className='container-info'>
                <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M19.5 12C19.5 16.1421 16.1421 19.5 12 19.5C7.85786 19.5 4.5 16.1421 4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C16.1421 4.5 19.5 7.85786 19.5 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM11.25 13.5V8.25H12.75V13.5H11.25ZM11.25 15.75V14.25H12.75V15.75H11.25Z"
                          fill="#fff "/>
                </svg>
                {Boolean(info.title) && <p className='text'>{info.title}</p>}
            </div>
        </Link>
        <style jsx>{`
          .container-info {
            position: relative;
            cursor: pointer;
          }

          .container-info:hover .text {
            display: flex;
          }

          .text {
            display: none;
            position: absolute;
            top: -250%;
            left: -20%;
            background-color: #151515;
            color: #8F9190;
            min-width: 350px;
            z-index: 50;
            padding: 0.5rem;
            border-radius: 0.5rem;
            font-size: 0.75rem;
          }
        `}</style>
    </>
}