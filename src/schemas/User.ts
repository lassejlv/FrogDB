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
        name: "isStudent",
        type: FrogFieldType.Boolean,
      },
    ],
})