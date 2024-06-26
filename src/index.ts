import {
  type FrogSchema,
  type FrogField,
  FrogFieldType,
  type FrogDbOptions,
} from "./types";
import { formatType } from "./helpers/format";
import { CreateDocumentId } from "./helpers/createId";
import fs from "fs";
import fetcher from "./helpers/basicAuth";

export async function Schema(data: FrogSchema) {
  const find = async <T>(query: any): Promise<T> => {
    // Your implementation here...
    const schemaPath = `./db/${data.name}`;
    const files = fs
      .readdirSync(schemaPath)
      .filter((file) => file.endsWith(".json"));

    const results = [];

    for (const file of files) {
      const content = fs.readFileSync(`${schemaPath}/${file}`, "utf-8");
      const obj = JSON.parse(content);

      let found = true;
      for (const key in query) {
        if (obj[key] !== query[key]) {
          found = false;
          break;
        }
      }

      if (found) {
        results.push(obj);
      }
    }

    // Return the results
    return results as any;
  };

  const insert = async <T>(document: any): Promise<T> => {
    const id = CreateDocumentId();
    const schemaPath = `./db/${data.name}`;

    const constructedDocument = {
      id,
      ...document,
    };

    // Check if there are fields that are not in the schema or if a field is missing
    for (const key in constructedDocument) {
      if (key === "id") continue;

      if (!data.fields.find((field) => field.name === key)) {
        throw new Error(`Field ${key} is not in the schema`);
      }

      if (
        data.fields.find((field) => field.name === key && field.required) &&
        !constructedDocument[key]
      ) {
        throw new Error(`Field ${key} is required`);
      }
    }

    // Loop through fieldsnt
    for (const field of data.fields) {
      const isADateType = field.type === FrogFieldType.Date;
      const isAObjectType = field.type === FrogFieldType.Object;
      const isAArrayType = field.type === FrogFieldType.Array;

      if (isADateType) {
        if (!(constructedDocument[field.name] instanceof Date)) {
          throw new Error(`Field ${field.name} must be of type ${field.type}`);
        }
      } else if (isAObjectType) {
        if (typeof constructedDocument[field.name] !== "object") {
          throw new Error(`Field ${field.name} must be of type ${field.type}`);
        }
      } else if (isAArrayType) {
        if (!Array.isArray(constructedDocument[field.name])) {
          throw new Error(`Field ${field.name} must be of type ${field.type}`);
        }
      } else {
        if (typeof constructedDocument[field.name] !== field.type) {
          throw new Error(`Field ${field.name} must be of type ${field.type}`);
        }
      }
    }

    // Write to file
    fs.writeFileSync(
      `${schemaPath}/${id}.json`,
      JSON.stringify(constructedDocument, null, 2)
    );

    // Return the document
    return constructedDocument;
  };

  const findOne = async <T>(query: any): Promise<T> => {
    const results = await find(query);
    // @ts-ignore
    return results[0] as T;
  };

  const deleteOne = async (id: string) => {
    const exist = await findOne({ id });

    if (!exist) {
      throw new Error("Document not found");
    }

    const schemaPath = `./db/${data.name}`;

    fs.unlinkSync(`${schemaPath}/${id}.json`);

    return exist;
  };

  const deleteAll = async <T>(query: any): Promise<T[]> => {
    const results = await find(query);

    for (const result of results as any[]) {
      await deleteOne(result.id);
    }

    return results as T[];
  };

  const update = async <T>(id: string, document: any): Promise<T> => {
    const exist = await findOne({ id });
    if (!exist) {
      throw new Error("Document not found");
    }

    const schemaPath = `./db/${data.name}`;

    const constructedDocument = {
      id,
      ...document,
    };

    // Check if there are fields that are not in the schema
    for (const key in constructedDocument) {
      if (key === "id") continue;

      if (!data.fields.find((field) => field.name === key)) {
        throw new Error(`Field ${key} is not in the schema`);
      }
    }

    // Loop through fields
    for (const field of data.fields) {
      // Check types
      if (typeof constructedDocument[field.name] !== field.type) {
        throw new Error(`Field ${field.name} must be of type ${field.type}`);
      }
    }

    // Write to file
    fs.writeFileSync(
      `${schemaPath}/${id}.json`,
      JSON.stringify(constructedDocument, null, 2)
    );

    // Return the document
    return constructedDocument;
  };

  return {
    ...data,
    find,
    insert,
    findOne,
    deleteOne,
    deleteAll,
    update,
  };
}

export function FrogDB(options?: FrogDbOptions) {
  let path = "./db";
  return {
    async generate(schemas: FrogSchema[]) {
      const isSererMode = options?.server;

      const db: any = {};

      // Check if the path exists, if not create it
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }

      if (!isSererMode) {
        for (const schema of schemas) {
          // Create a folder for each schema
          const schemaPath = `${path}/${schema.name}`;

          // Check if schema has an id field
          if (schema.fields.find((field) => field.name === "id")) {
            throw new Error("Schema cannot have a field named 'id'");
          }

          // Check if there are duplicate fields
          const fieldNames = schema.fields.map((field) => field.name);
          const uniqueFieldNames = new Set(fieldNames);

          // Check if fields are unique
          if (fieldNames.length !== uniqueFieldNames.size) {
            throw new Error("Fields must be unique");
          }

          // Create types for the schema
          const types: string[] = [];

          // Push the fields to the types array
          for (const field of schema.fields) {
            types.push(`${field.name}: ${formatType(field)};`);
          }

          // Check if the types folder exists, if not create it
          if (!fs.existsSync(`${path}/types`)) {
            fs.mkdirSync(`${path}/types`);
          }

          // Create the types file
          const typesPath = `${path}/types/${schema.name}.ts`;
          fs.writeFileSync(
            typesPath,
            `export type ${schema.name} = { id: string; ${types.join(" ")} };`
          );

          console.log(schema);

          // Create the schema file
          if (!fs.existsSync(schemaPath)) {
            fs.mkdirSync(schemaPath);
          }
        }
        return db;
      } else {
        const res = await fetcher(
          `${options.server?.host}:${options.server?.port}/ping`,
          options.server?.auth.user as string,
          options.server?.auth.password as string
        );

        if (!res.ok) {
          throw new Error(`${res.status} - ${res.statusText}`);
        }

        for (const schema of schemas) {
          const created = await fetcher(
            `${options.server?.host}:${options.server?.port}/schema`,
            options.server?.auth.user as string,
            options.server?.auth.password as string,
            {
              method: "POST",
              body: JSON.stringify(schema),
            }
          );

          if (!created.ok) {
            throw new Error(`${created.status} - ${created.statusText}`);
          }
        }

        return db;
      }
    },
  };
}

export { FrogFieldType, formatType };
export type { FrogSchema, FrogField };
