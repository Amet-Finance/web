import React, {useState} from "react";

function GeneralContainer({children, isPadding = false, className = ''}: Readonly<{
    children: React.ReactNode,
    isPadding?: boolean,
    className?: string
}>) {

    const positionClass = isPadding ?
        "3xl:px-96 2xl:px-60 xl-2xl:px-56 xl:px-48 lg-xl:px-40 lg:px-32 md-lg:px-24 md:px-20 sm:px-8 px-4" :
        "3xl:mx-96 2xl:mx-60 xl-2xl:mx-56 xl:mx-48 lg-xl:mx-40 lg:mx-32 md-lg:mx-24 md:mx-20 sm:mx-8 mx-4"
    return (
        <div className={`${className} ${positionClass}`}>
            {children}
        </div>

    )
}

function ToggleBetweenChildren({children, isOpen}: { children: [React.ReactNode, React.ReactNode], isOpen: boolean }) {
    return isOpen ? children[0] : children[1];
}

function ConditionalRenderer({isOpen, children}: Readonly<{ isOpen: boolean, children: React.ReactNode }>) {
    return isOpen ? children : null
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
    ToggleBetweenChildren,
    ConditionalRenderer,
    useShow
}
