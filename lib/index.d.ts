import { type FrogSchema, type FrogField, FrogFieldType } from "./types";
import { formatType } from "./helpers/format";
export declare function Schema(data: FrogSchema): Promise<{
    find: <T>(query: any) => Promise<T>;
    insert: <T_1>(document: any) => Promise<T_1>;
    findOne: <T_2>(query: any) => Promise<T_2>;
    deleteOne: (id: string) => Promise<{}>;
    deleteAll: <T_3>(query: any) => Promise<T_3[]>;
    update: <T_4>(id: string, document: any) => Promise<T_4>;
    name: string;
    fields: FrogField[];
}>;
export declare function FrogDB(): {
    generate(schemas: FrogSchema[]): Promise<any>;
};
export { FrogFieldType, formatType };
export type { FrogSchema, FrogField };
