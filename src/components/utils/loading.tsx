export default function Loading({percent}: { percent?: number }) {
    percent = percent || 0;
    let witdthMain = 62 - ((62 * percent) / 100)
    let width = 52 - ((52 * percent) / 100)
    let border = 6 - ((6 * percent) / 100)

    return <>
        <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <style jsx>{`
          .lds-ring {
            display: inline-block;
            position: relative;
            width: ${witdthMain}px;
            height: ${witdthMain}px;
          }

          .lds-ring div {
            box-sizing: border-box;
            display: block;
            position: absolute;
            width: ${width}px;
            height: ${width}px;
            margin: ${border}px;
            border: ${border}px solid #fff;
            border-radius: 50%;
            animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            border-color: #fff transparent transparent transparent;
          }

          .lds-ring div:nth-child(1) {
            animation-delay: -0.45s;
          }

          .lds-ring div:nth-child(2) {
            animation-delay: -0.3s;
          }

          .lds-ring div:nth-child(3) {
            animation-delay: -0.15s;
          }

          @keyframes lds-ring {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

        `}</style>
    </>
}
