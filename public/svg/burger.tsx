export default function BurgerSVG({onClick}: any) {
    return <>
        <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M5.16667 10.3333C4.45625 10.3333 3.875 9.75208 3.875 9.04167C3.875 8.33125 4.45625 7.75 5.16667 7.75H25.8333C26.5437 7.75 27.125 8.33125 27.125 9.04167C27.125 9.75208 26.5437 10.3333 25.8333 10.3333H5.16667ZM5.16667 16.7913H25.8333C26.5437 16.7913 27.125 16.2101 27.125 15.4996C27.125 14.7892 26.5437 14.208 25.8333 14.208H5.16667C4.45625 14.208 3.875 14.7892 3.875 15.4996C3.875 16.2101 4.45625 16.7913 5.16667 16.7913ZM5.16667 23.2504H25.8333C26.5437 23.2504 27.125 22.6691 27.125 21.9587C27.125 21.2483 26.5437 20.667 25.8333 20.667H5.16667C4.45625 20.667 3.875 21.2483 3.875 21.9587C3.875 22.6691 4.45625 23.2504 5.16667 23.2504Z"
                  fill="white"/>
        </svg>
    </>
}