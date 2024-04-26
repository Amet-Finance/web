type StringKeyedObject<T> = { [key: string]: T };

type InfoData = {
    text: string;
    link?: string;
    isBlank?: boolean;
}

export type {
    StringKeyedObject,
    InfoData
}
