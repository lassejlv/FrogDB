import type { FrogSchema } from "../types";
import { Hono } from "hono";
import { env } from "../util/env";
import fs from "fs";

const router = new Hono();

router.get("/", (c) => {
  return c.json({ message: "Hello, World! from schema path" });
});

router.post("/", async (c) => {
  const { schema } = (await c.req.json()) as { schema: FrogSchema };

  try {
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

  return c.text("POST request received");
});

export default router;
