import {nop} from "@/modules/utils/function";

export default function XmarkSVG({color, onClick, isMedium, isSmall}: {color?: string, onClick?: any, isMedium?: boolean, isSmall?: boolean}) {

    let width;
    let height;
    if (isSmall) {
        width = 15;
        height = 15;
    } else if (isMedium) {
        width = 25;
        height = 25;
    } else {
        width = 31;
        height = 31;
    }

    const onClickFunction = onClick || nop;

    return <>
        <svg width={width} height={height} viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"
             className='xmark z-50'
             onClick={onClickFunction}
        >
            <path
                d="M 10.0234 43.0234 C 9.2266 43.8203 9.2031 45.1797 10.0234 45.9766 C 10.8438 46.7734 12.1797 46.7734 13.0000 45.9766 L 28.0000 30.9766 L 43.0000 45.9766 C 43.7969 46.7734 45.1563 46.7969 45.9766 45.9766 C 46.7734 45.1562 46.7734 43.8203 45.9766 43.0234 L 30.9531 28.0000 L 45.9766 13.0000 C 46.7734 12.2031 46.7969 10.8437 45.9766 10.0469 C 45.1328 9.2266 43.7969 9.2266 43.0000 10.0469 L 28.0000 25.0469 L 13.0000 10.0469 C 12.1797 9.2266 10.8203 9.2031 10.0234 10.0469 C 9.2266 10.8672 9.2266 12.2031 10.0234 13.0000 L 25.0234 28.0000 Z"/>
        </svg>
        <style jsx>{`
          .xmark {
            cursor: pointer;
            fill: ${color || "#fff"};
          }
        `}</style>
    </>
}
