export interface FrogSchema {
  name: string;
  fields: FrogField[];
  find?(query: any): Promise<any[]>;
}

export interface FrogField {
  name: string;
  type: FrogFieldType;
  required?: boolean;
}

export interface FrogDbOptions {
  server?: {
    host: string;
    port: number;
    auth: {
      user: string;
      password: string;
    };
  };
}

export enum FrogFieldType {
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Date = "date",
  Object = "object",
  Array = "array",
}
