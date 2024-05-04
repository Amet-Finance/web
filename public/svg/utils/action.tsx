export default function ActionSVG({size = 16, color = "#fff"}) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <rect width="16" height="16" id="icon-bound" fill="none"/>
            <path d="M10,1L3,9h4.5L6,15l7-8H8.5L10,1z" fill={color}/>
        </svg>
    )
}
