import Link from "next/link";

export default function NotFound() {
    return <>
        <div className='flex items-center min-h-screen lg:px-32 px-14'>
            <div className='flex flex-col justify-center gap-4 '>
                <svg viewBox="0 0 795 286" fill="none" xmlns="http://www.w3.org/2000/svg"
                     className='lg:w-96 lg:h-40 w-52 h-24'>
                    <path
                        d="M0.199389 223.151H-1.80061V225.151H0.199389V223.151ZM0.199389 180.257L-1.4058 179.064L-1.80061 179.595V180.257H0.199389ZM130.064 5.5299V3.5299H129.058L128.459 4.33685L130.064 5.5299ZM196.964 5.5299L198.581 6.70646L200.892 3.5299H196.964V5.5299ZM69.854 180.257L69.2949 182.177L70.6444 182.57L71.4713 181.433L69.854 180.257ZM38.7652 171.205V169.205L38.2061 173.126L38.7652 171.205ZM255.6 171.205H257.6V169.205H255.6V171.205ZM255.6 223.151V225.151H257.6V223.151H255.6ZM148.56 281H146.56V283H148.56V281ZM148.56 223.151L146.561 223.076L146.56 223.113V223.151H148.56ZM150.527 171.205L152.526 171.281L152.527 171.243V171.205H150.527ZM150.527 119.653V117.653H148.527V119.653H150.527ZM210.737 119.653H212.737V117.653H210.737V119.653ZM210.737 281V283H212.737V281H210.737ZM2.19939 223.151V180.257H-1.80061V223.151H2.19939ZM1.80458 181.45L131.669 6.72295L128.459 4.33685L-1.4058 179.064L1.80458 181.45ZM130.064 7.5299H196.964V3.5299H130.064V7.5299ZM195.346 4.35334L68.2367 179.08L71.4713 181.433L198.581 6.70646L195.346 4.35334ZM70.413 178.336L39.3243 169.285L38.2061 173.126L69.2949 182.177L70.413 178.336ZM38.7652 173.205H255.6V169.205H38.7652V173.205ZM253.6 171.205V223.151H257.6V171.205H253.6ZM255.6 221.151H0.199389V225.151H255.6V221.151ZM150.56 281V223.151H146.56V281H150.56ZM150.558 223.227L152.526 171.281L148.529 171.13L146.561 223.076L150.558 223.227ZM152.527 171.205V119.653H148.527V171.205H152.527ZM150.527 121.653H210.737V117.653H150.527V121.653ZM208.737 119.653V281H212.737V119.653H208.737ZM210.737 279H148.56V283H210.737V279ZM332.122 269.194L331.053 270.885L331.062 270.89L331.071 270.896L332.122 269.194ZM290.015 220.397L288.213 221.264L290.015 220.397ZM290.015 66.1333L291.817 67.001V67.001L290.015 66.1333ZM332.122 17.7293L333.173 19.4309L333.182 19.4253L333.191 19.4197L332.122 17.7293ZM453.329 17.7293L452.249 19.4125L452.264 19.4218L452.278 19.4309L453.329 17.7293ZM495.437 66.1333L493.635 67.001V67.001L495.437 66.1333ZM495.437 220.397L493.635 219.529L495.437 220.397ZM453.329 269.194L454.392 270.889L454.398 270.885L453.329 269.194ZM420.666 222.758L419.475 221.152L419.462 221.161L419.449 221.171L420.666 222.758ZM439.556 194.03L437.674 193.353L437.668 193.369L437.662 193.386L439.556 194.03ZM439.556 92.4997L437.662 93.1436L437.668 93.1604L437.674 93.1772L439.556 92.4997ZM420.666 63.7721L419.449 65.3594L419.462 65.3689L419.475 65.3783L420.666 63.7721ZM364.785 63.7721L363.594 62.166L363.581 62.1753L363.568 62.1849L364.785 63.7721ZM345.896 92.4997L344.014 91.8223L344.008 91.8391L344.002 91.8559L345.896 92.4997ZM345.896 194.03L344.002 194.674L344.008 194.691L344.014 194.708L345.896 194.03ZM364.785 222.758L363.568 224.345L363.581 224.355L363.594 224.364L364.785 222.758ZM392.726 283.722C370.505 283.722 350.673 278.301 333.173 267.493L331.071 270.896C349.251 282.124 369.822 287.722 392.726 287.722V283.722ZM333.191 267.504C315.704 256.446 301.906 240.483 291.817 219.529L288.213 221.264C298.587 242.811 312.861 259.38 331.053 270.885L333.191 267.504ZM291.817 219.529C281.747 198.614 276.667 173.216 276.667 143.265H272.667C272.667 173.655 277.82 199.678 288.213 221.264L291.817 219.529ZM276.667 143.265C276.667 113.314 281.747 87.9162 291.817 67.001L288.213 65.2657C277.82 86.8516 272.667 112.875 272.667 143.265H276.667ZM291.817 67.001C301.904 46.0501 315.698 30.2248 333.173 19.4309L331.071 16.0277C312.867 27.2714 298.589 43.7154 288.213 65.2657L291.817 67.001ZM333.191 19.4197C350.689 8.35486 370.515 2.80757 392.726 2.80757V-1.19243C369.812 -1.19243 349.236 4.54143 331.053 16.0389L333.191 19.4197ZM392.726 2.80757C415.204 2.80757 435.023 8.35727 452.249 19.4125L454.409 16.0461C436.48 4.53902 415.897 -1.19243 392.726 -1.19243V2.80757ZM452.278 19.4309C469.754 30.2248 483.547 46.0501 493.635 67.001L497.239 65.2657C486.863 43.7154 472.584 27.2714 454.38 16.0277L452.278 19.4309ZM493.635 67.001C503.705 87.9162 508.784 113.314 508.784 143.265H512.784C512.784 112.875 507.632 86.8516 497.239 65.2657L493.635 67.001ZM508.784 143.265C508.784 173.216 503.705 198.614 493.635 219.529L497.239 221.264C507.632 199.678 512.784 173.655 512.784 143.265H508.784ZM493.635 219.529C483.546 240.483 469.747 256.446 452.26 267.504L454.398 270.885C472.591 259.38 486.864 242.811 497.239 221.264L493.635 219.529ZM452.267 267.5C435.039 278.299 415.214 283.722 392.726 283.722V287.722C415.887 287.722 436.464 282.127 454.392 270.889L452.267 267.5ZM392.726 233.809C403.883 233.809 413.633 230.67 421.883 224.345L419.449 221.171C411.958 226.914 403.082 229.809 392.726 229.809V233.809ZM421.858 224.364C430.417 218.013 436.905 208.038 441.449 194.674L437.662 193.386C433.286 206.257 427.181 215.434 419.475 221.152L421.858 224.364ZM441.438 194.708C446.266 181.294 448.639 164.12 448.639 143.265H444.639C444.639 163.861 442.29 180.531 437.674 193.353L441.438 194.708ZM448.639 143.265C448.639 122.41 446.266 105.236 441.438 91.8223L437.674 93.1772C442.29 105.999 444.639 122.669 444.639 143.265H448.639ZM441.449 91.8559C436.905 78.4917 430.417 68.5165 421.858 62.166L419.475 65.3783C427.181 71.096 433.286 80.2725 437.662 93.1436L441.449 91.8559ZM421.883 62.1849C413.633 55.86 403.883 52.721 392.726 52.721V56.721C403.082 56.721 411.958 59.6161 419.449 65.3594L421.883 62.1849ZM392.726 52.721C381.819 52.721 372.084 55.8664 363.594 62.166L365.977 65.3783C373.752 59.6097 382.644 56.721 392.726 56.721V52.721ZM363.568 62.1849C355.294 68.5289 348.816 78.4842 344.014 91.8223L347.778 93.1772C352.421 80.28 358.536 71.0836 366.002 65.3594L363.568 62.1849ZM344.002 91.8559C339.446 105.257 337.206 122.418 337.206 143.265H341.206C341.206 122.661 343.426 105.978 347.789 93.1436L344.002 91.8559ZM337.206 143.265C337.206 164.112 339.446 181.273 344.002 194.674L347.789 193.386C343.426 180.552 341.206 163.869 341.206 143.265H337.206ZM344.014 194.708C348.816 208.046 355.294 218.001 363.568 224.345L366.002 221.171C358.536 215.446 352.421 206.25 347.778 193.353L344.014 194.708ZM363.594 224.364C372.084 230.664 381.819 233.809 392.726 233.809V229.809C382.644 229.809 373.752 226.92 365.977 221.152L363.594 224.364ZM538.611 223.151H536.611V225.151H538.611V223.151ZM538.611 180.257L537.006 179.064L536.611 179.595V180.257H538.611ZM668.476 5.5299V3.5299H667.47L666.87 4.33685L668.476 5.5299ZM735.376 5.5299L736.993 6.70646L739.304 3.5299H735.376V5.5299ZM608.266 180.257L607.707 182.177L609.056 182.57L609.883 181.433L608.266 180.257ZM577.177 171.205V169.205L576.618 173.126L577.177 171.205ZM794.011 171.205H796.011V169.205H794.011V171.205ZM794.011 223.151V225.151H796.011V223.151H794.011ZM686.971 281H684.971V283H686.971V281ZM686.971 223.151L684.973 223.076L684.971 223.113V223.151H686.971ZM688.939 171.205L690.938 171.281L690.939 171.243V171.205H688.939ZM688.939 119.653V117.653H686.939V119.653H688.939ZM749.149 119.653H751.149V117.653H749.149V119.653ZM749.149 281V283H751.149V281H749.149ZM540.611 223.151V180.257H536.611V223.151H540.611ZM540.216 181.45L670.081 6.72295L666.87 4.33685L537.006 179.064L540.216 181.45ZM668.476 7.5299H735.376V3.5299H668.476V7.5299ZM733.758 4.35334L606.648 179.08L609.883 181.433L736.993 6.70646L733.758 4.35334ZM608.825 178.336L577.736 169.285L576.618 173.126L607.707 182.177L608.825 178.336ZM577.177 173.205H794.011V169.205H577.177V173.205ZM792.011 171.205V223.151H796.011V171.205H792.011ZM794.011 221.151H538.611V225.151H794.011V221.151ZM688.971 281V223.151H684.971V281H688.971ZM688.97 223.227L690.938 171.281L686.941 171.13L684.973 223.076L688.97 223.227ZM690.939 171.205V119.653H686.939V171.205H690.939ZM688.939 121.653H749.149V117.653H688.939V121.653ZM747.149 119.653V281H751.149V119.653H747.149ZM749.149 279H686.971V283H749.149V279Z"
                        fill="white" fillOpacity="0.5"/>
                </svg>
                <div className='flex flex-col gap-3'>
                    <span className='text-7xl font-bold'>Ooops!</span>
                    <span className='text-xl font-medium text-g'>We can not show the page you requested.</span>
                </div>
                <Link href='/'>
                    <button className='border border-solid border-w1 rounded py-3 hover:border-w5 w-full'>Back to Home!
                    </button>
                </Link>
            </div>
        </div>
    </>
}
