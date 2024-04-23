import { Schema } from "..";
import { FrogFieldType } from "../types";

export const UserSchema = await Schema({
  name: "User",
  fields: [
    {
      name: "name",
      type: FrogFieldType.String,
    },
    {
      name: "age",
      type: FrogFieldType.Number,
    },
    {
      name: "settings",
      type: FrogFieldType.Object,
    },
    {
      name: "payments",
      type: FrogFieldType.Array,
    },
    {
      name: "createdAt",
      type: FrogFieldType.Date,
    },
  ],
});
