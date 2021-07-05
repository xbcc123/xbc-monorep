export interface GetKeyFromfiledsProps {
    filedName: string;
    fileds: string;
    symbol: string;
}
export declare const getKeyFromfileds: ({ filedName, fileds, symbol }: GetKeyFromfiledsProps) => any[];
export interface ListFromFormProps {
    obj: any;
    symbol: string;
}
export declare const listFromForm: ({ obj, symbol }: ListFromFormProps) => any[];
export interface GetFormFieldsFromListProps {
    options: any[];
    filedsArray: any[];
    symbol: string;
}
export declare const getFormFieldsFromList: ({ options, filedsArray, symbol }: GetFormFieldsFromListProps) => object;
