import {ReactElement, useState} from "react";

function GeneralContainer({children, isPadding, className}: {
    children: ReactElement<any, any>[] | ReactElement<any, any>,
    isPadding?: boolean,
    className?: string
}) {

    const positionClass = isPadding ?
        "3xl:px-96 2xl:px-60 xl-2xl:px-56 xl:px-48 lg-xl:px-40 lg:px-32 md-lg:px-24 md:px-20 sm:px-8 px-6" :
        "3xl:mx-96 2xl:mx-60 xl-2xl:mx-56 xl:mx-48 lg-xl:mx-40 lg:mx-32 md-lg:mx-24 md:mx-20 sm:mx-8 mx-6"
    return (
        <div className={`${className} ${positionClass}`}>
            {children}
        </div>
    )
}

function ToggleDisplayComponent({children, isOpen}: { children: Array<ReactElement<any, any>>, isOpen: boolean }) {
    if (isOpen) {
        return children[0]
    } else {
        return children[1]
    }
}

function ShowContainer({isOpen, children}: Readonly<{ isOpen: boolean, children: ReactElement<any, any> }>) {

    if (!isOpen) return null

    return <>
        {children}
    </>
}

function useShow(defaultState?: boolean) {
    const [isOpen, setIsOpen] = useState(Boolean(defaultState))
    const openOrClose = () => setIsOpen(!isOpen);

    return {
        isOpen,
        setIsOpen,
        openOrClose
    }
}

export {
    GeneralContainer,
    ToggleDisplayComponent,
    ShowContainer,
    useShow
}
