import { type FrogSchema, type FrogField, FrogFieldType } from "./types";
export declare function Schema(data: FrogSchema): Promise<{
    find: (query: any) => Promise<any[]>;
    insert: (document: any) => Promise<any>;
    findOne: (query: any) => Promise<any>;
    deleteOne: (id: string) => Promise<any>;
    deleteAll: (query: any) => Promise<any[]>;
    update: (id: string, document: any) => Promise<any>;
    name: string;
    fields: FrogField[];
}>;
export declare function FrogDB(): {
    generate(schemas: FrogSchema[]): Promise<any>;
};
export { FrogFieldType };
export type { FrogSchema, FrogField };
