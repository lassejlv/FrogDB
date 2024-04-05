# FrogDB: 🐸 Lightweight, adaptable JSON database

FrogDB is a lightweight, file-based JSON database system designed for local development and small-scale applications. It allows for quick setup and easy data manipulation with the flexibility of JSON. Inspired by the adaptability of frogs, FrogDB supports dynamic schemas to fit various data structures, making it a versatile choice for developers.

## Features

- **Dynamic Schemas**: Define your data structure on the fly with flexible schemas.
- **CRUD Operations**: Full support for create, read, update, and delete operations.
- **Local Storage**: All data is stored locally in JSON files, making it easy to inspect and manage.
- **Type Checking**: Ensures data integrity with basic type checking for string, number, and boolean fields.

## Installation

Currently, FrogDB is intended to be integrated directly into your project. Clone the repository into your project directory to get started.

## Quick Start

1. **Define Your Schemas**: Create schemas for your data models. Each schema should have a name and an array of fields.

```typescript
import { FrogSchema, FrogFieldType } from "./types";

const UserSchema: FrogSchema = {
  name: "User",
  fields: [
    { name: "username", type: FrogFieldType.String, required: true },
    { name: "age", type: FrogFieldType.Number, required: false },
    { name: "isActive", type: FrogFieldType.Boolean, required: true }
  ],
};
```

2. **Initialize FrogDB**: Set up FrogDB with your schemas.

```typescript
import FrogDB from "./FrogDB";
import { UserSchema } from "./schemas/User";
import { PostSchema } from "./schemas/Post";

const db = FrogDB().generate([UserSchema, PostSchema]);
```

3. **Perform Operations**: Use the provided async functions to interact with your database.

```typescript
async function createUser() {
  const newUser = await db.User.insert({
    username: "froggy123",
    age: 25,
    isActive: true,
  });

  console.log(newUser);
}
```

## Schema Definition

Each schema requires a `name` and an array of `fields`. Fields must specify a `name`, `type`, and an optional `required` flag.

## API Reference

- **insert(document: any)**: Inserts a new document into the database. Returns the inserted document with a unique `id`.
- **find(query: any)**: Finds documents matching the query. Returns an array of documents.
- **findOne(query: any)**: Finds the first document matching the query. Returns a single document.
- **deleteOne(id: string)**: Deletes the document with the specified `id`. Returns the deleted document.
- **deleteAll(query: any)**: Deletes all documents matching the query. Returns an array of deleted documents.
- **update(id: string, document: any)**: Updates the document with the specified `id`. Returns the updated document.

## Contributing

Contributions are welcome! Whether it's adding new features, fixing bugs, or improving documentation, your help is appreciated.

## License

FrogDB is open source and released under the MIT License.
