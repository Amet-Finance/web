import Link from "next/link";
import {URLS} from "@/modules/utils/urls";

export default function RedditSVG({url}: {url: string}) {
    const color = "#7D7D7D"

    return <>
        <Link href={url} target="_blank" rel="noreferrer">
            <svg width="26" height="26" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg"
                 className='hover'>
                <path
                    d="M13.0715 19.1989C12.8026 19.2048 12.5381 19.1303 12.3118 18.985C12.0855 18.8398 11.9077 18.6303 11.8011 18.3834C11.6945 18.1365 11.664 17.8634 11.7135 17.5991C11.7629 17.3348 11.8901 17.0912 12.0788 16.8995C12.2674 16.7079 12.509 16.5769 12.7725 16.5232C13.036 16.4696 13.3095 16.4958 13.558 16.5985C13.8066 16.7012 14.0189 16.8756 14.1677 17.0996C14.3165 17.3236 14.3952 17.5869 14.3936 17.8558C14.3953 18.2089 14.2572 18.5483 14.0095 18.8C13.7618 19.0516 13.4245 19.195 13.0715 19.1989Z"
                    fill={color}/>
                <path
                    d="M18.9473 20.5819C18.9797 20.6119 19.0055 20.6482 19.0231 20.6886C19.0408 20.729 19.0499 20.7726 19.0499 20.8167C19.0499 20.8607 19.0408 20.9043 19.0231 20.9447C19.0055 20.9851 18.9797 21.0214 18.9473 21.0514C17.72 22.2956 14.2568 22.2956 13.0294 21.0514C12.975 20.9908 12.9453 20.912 12.9463 20.8305C12.9473 20.749 12.979 20.6709 13.035 20.6118C13.091 20.5526 13.1672 20.5166 13.2485 20.5111C13.3298 20.5056 13.4102 20.5309 13.4737 20.5819C14.4105 21.5567 17.52 21.5735 18.4989 20.5819C18.5588 20.5232 18.6393 20.4902 18.7231 20.4902C18.807 20.4902 18.8875 20.5232 18.9473 20.5819Z"
                    fill={color}/>
                <path
                    d="M20.2716 17.8559C20.2662 18.1175 20.1838 18.3717 20.0348 18.5867C19.8857 18.8017 19.6766 18.9679 19.4335 19.0647C19.1905 19.1615 18.9243 19.1844 18.6682 19.1307C18.4122 19.077 18.1776 18.949 17.994 18.7627C17.8103 18.5764 17.6856 18.3401 17.6355 18.0834C17.5854 17.8266 17.6121 17.5608 17.7122 17.3191C17.8124 17.0774 17.9816 16.8706 18.1987 16.7246C18.4158 16.5786 18.6711 16.4998 18.9327 16.498C19.1099 16.4986 19.2854 16.5342 19.4488 16.6029C19.6122 16.6716 19.7605 16.7719 19.8849 16.8981C20.0094 17.0244 20.1077 17.174 20.174 17.3384C20.2404 17.5028 20.2736 17.6787 20.2716 17.8559Z"
                    fill={color}/>
                <path
                    d="M16 0.0410156C12.8355 0.0410156 9.74207 0.979399 7.11088 2.7375C4.4797 4.4956 2.42894 6.99446 1.21793 9.91808C0.00693251 12.8417 -0.309921 16.0588 0.307443 19.1625C0.924806 22.2662 2.44866 25.1171 4.6863 27.3547C6.92394 29.5924 9.77486 31.1162 12.8786 31.7336C15.9823 32.3509 19.1993 32.0341 22.1229 30.8231C25.0466 29.6121 27.5454 27.5613 29.3035 24.9301C31.0616 22.2989 32 19.2055 32 16.041C32 11.7975 30.3143 7.72789 27.3137 4.72731C24.3131 1.72672 20.2435 0.0410156 16 0.0410156ZM23.0189 17.6579C23.0906 17.9384 23.1253 18.2272 23.1221 18.5168C23.1221 21.3842 19.9389 23.7063 16.0147 23.7063C12.0905 23.7063 8.92211 21.3905 8.92211 18.5168C8.92074 18.2337 8.95039 17.9513 9.01053 17.6747C7.29264 16.8031 7.90737 14.2494 9.78106 14.2494C10.0235 14.2494 10.2633 14.2989 10.486 14.3948C10.7086 14.4907 10.9093 14.6311 11.0758 14.8073C12.4379 13.8905 14.0324 13.3795 15.6737 13.3336L16.6989 8.63049C16.7167 8.54962 16.7654 8.47894 16.8347 8.43366C16.904 8.38838 16.9883 8.37212 17.0695 8.38838L20.3537 9.12733C20.4641 8.91701 20.6283 8.73978 20.8296 8.61376C21.031 8.48774 21.2622 8.41745 21.4996 8.41009C21.737 8.40272 21.9721 8.45854 22.1809 8.57185C22.3896 8.68515 22.5645 8.85186 22.6877 9.05493C22.8109 9.25801 22.878 9.49016 22.882 9.72765C22.8861 9.96514 22.827 10.1994 22.7108 10.4066C22.5945 10.6137 22.4254 10.7863 22.2206 10.9067C22.0159 11.027 21.7828 11.0908 21.5453 11.0915C21.192 11.0882 20.8545 10.945 20.6066 10.6932C20.3588 10.4414 20.2209 10.1017 20.2232 9.74838L17.2484 9.07259L16.3158 13.3421C17.967 13.3686 19.5753 13.8716 20.9474 14.7905C21.113 14.6187 21.3115 14.4819 21.531 14.3883C21.7505 14.2946 21.9866 14.246 22.2253 14.2452C24.0821 14.2473 24.7011 16.7821 23.0189 17.6579Z"
                    fill={color}/>
            </svg>
        </Link>
        <style jsx>{`
          .hover {
            cursor: pointer;
          }

          .hover:hover path {
            fill: #fff;
          }
        `}</style>
    </>
}
