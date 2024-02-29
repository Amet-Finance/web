export default function ArrowBasicSVG({sPercentage, classname, onClick}: { sPercentage?: number, classname?: string, onClick?: any }) {

    const defaultWidth = 15
    const defaultHeight = 9

    let width = defaultWidth + ((defaultWidth * (sPercentage || 0)) / 100)
    let height = defaultHeight + ((defaultHeight * (sPercentage || 0)) / 100)

    return <>
        <svg width={width} height={height}
             viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg"
             onClick={onClick}
             className={classname}>
            <path d="M1 1L7.5 7.5L14 1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </>
}
