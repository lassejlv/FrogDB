import type { FrogSchema } from "../types";
import { Hono } from "hono";
import { env } from "../util/env";
import fs from "fs";

const router = new Hono();

router.get("/", (c) => {
  return c.json({ message: "Hello, World! from schema path" });
});

router.post("/", async (c) => {
  try {
    const schema = (await c.req.json()) as FrogSchema;

    const schemaPath = `${env.DATA_PATH}/${schema.name}`;

    if (!schema.name || !schema.fields || !schema.fields.length) {
      c.status(400);
      return c.json({ ok: false, error: "Schema must have a name and fields" });
    }

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

    // Create the schema file
    if (!fs.existsSync(schemaPath)) {
      fs.mkdirSync(schemaPath);
    }

    c.status(201);
    return c.json({ ok: true });
  } catch (error: any) {
    c.status(400);
    return c.json({ ok: false, error: error.message });
  }
});

router.delete("/:name", async (c) => {
  const schemaName = c.req.param("name");
  const schemaPath = `${env.DATA_PATH}/${schemaName}`;

  if (!fs.existsSync(schemaPath)) {
    c.status(404);
    return c.json({ ok: false, error: "Schema was not found" });
  } else {
    fs.unlinkSync(schemaPath);
    c.status(200);
    return c.json({ ok: true });
  }
});

// CRUD operations
router.get("/:name/find", async (c) => {
  try {
    const schemaName = c.req.param("name");
    const schemaPath = `${env.DATA_PATH}/${schemaName}`;
    const query = await c.req.json();

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
  } catch (error: any) {
    c.status(400);
    return c.json({ ok: false, error: error.message });
  }
});

export default router;
