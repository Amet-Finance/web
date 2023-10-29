export default function ArrowSVG({onClick}: any) {
    return <>
        <svg width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
            <path d="M6 12H18M18 12L13 7M18 12L13 17"
                  stroke="#fff" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <style jsx>{`
          svg {
            cursor: pointer;
          }
        `}</style>
    </>
}
