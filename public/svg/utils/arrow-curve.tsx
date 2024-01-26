export default function ArrowCurveSVG({angle, color}: { angle?: number, color?: string }) {
    return <>
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="18" viewBox="0 0 21 18" fill="none">
            <path
                d="M1.00488 16.5L19.5049 1.5M19.5049 1.5C17.0049 3.5 10.9049 6.3 6.50488 1.5M19.5049 1.5C17.0049 3.83333 13.2049 9.8 18.0049 15"
                stroke={color || "black"} strokeWidth="2"/>
        </svg>
        <style jsx>{`
          svg {
            transform: rotate(${angle || 0}deg);
          }
        `}</style>
    </>
}
