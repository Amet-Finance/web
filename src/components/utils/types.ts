type StringKeyedObject<T> = { [key: string]: T };

type InfoData = {
    text: string;
    link?: string;
    isBlank?: boolean;
}

type InfoBoxData = {
    info: InfoData,
    children?: any,
    isRight?: boolean,
    className?: string,
    parentClassName?: string,
}

export type {
    StringKeyedObject,
    InfoData,
    InfoBoxData
}
