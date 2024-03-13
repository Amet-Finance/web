import {ReactElement, useState} from "react";

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
    ShowContainer,
    useShow
}
