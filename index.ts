import { PostSchema } from "./schemas/Post";
import { UserSchema } from "./schemas/User";
import type { FrogSchema } from "./types";
import crypto from "crypto";
import fs from "fs";

const schemaPath = "./db";

function CreateDocumentId() {
  return crypto.randomUUID();
}

export async function Schema(data: FrogSchema) {

  const find = async (query: any): Promise<any[]> => {
    // Your implementation here...
    const schemaPath = `./db/${data.name}`;
    const files = fs.readdirSync(schemaPath).filter(file => file.endsWith(".json"));

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

    return results;
  };

  const insert = async (document: any) => {
    const id = CreateDocumentId();
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

    // Loop through fieldsnt
    for (const field of data.fields) {
      // Check types
      if (typeof constructedDocument[field.name] !== field.type) {
        throw new Error(`Field ${field.name} must be of type ${field.type}`);
      }
    }

    // Write to file
    fs.writeFileSync(`${schemaPath}/${id}.json`, JSON.stringify(constructedDocument, null, 2));

    // Return the document
    return constructedDocument;
  }

  const findOne = async (query: any) => {
    const results = await find(query);
    return results[0];
  }

  const deleteOne = async (id: string) => {
    const exist = await findOne({ id });

    if (!exist) {
      throw new Error("Document not found");
    }

    const schemaPath = `./db/${data.name}`;
   
    fs.unlinkSync(`${schemaPath}/${id}.json`);

    return exist;
  }

  const deleteAll = async (query: any) => {
    const results = await find(query);

    for (const result of results) {
      await deleteOne(result.id);
    }

    return results;
  }

  const update = async (id: string, document: any) => {
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
    fs.writeFileSync(`${schemaPath}/${id}.json`, JSON.stringify(constructedDocument, null, 2));

    // Return the document
    return constructedDocument;
  }

  return {
    ...data,
    find,
    insert,
    findOne,
    deleteOne,
    deleteAll,
    update,
  }
}

function FrogDB() {
  let path = "./db";
  return {
    async generate(schemas: FrogSchema[]) {
      const db: any = {};

      // Check if the path exists, if not create it
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }

      for (const schema of schemas) {
        // Create a folder for each schema
        const schemaPath = `${path}/${schema.name}`;

        // Check if schema has an id field
        if (schema.fields.find((field) => field.name === "id")) {
          throw new Error("Schema cannot have a field named 'id'");
        }

        if (!fs.existsSync(schemaPath)) {
          fs.mkdirSync(schemaPath);
        } 
      }
      return db;
    }
  };
}

const db = FrogDB().generate([UserSchema, PostSchema]);

const user = await UserSchema.deleteOne("a36ecbfb-5b7f-41f8-b30b-677eb0566ba7");

console.log(user);
