import { Schema } from "..";
import { FrogFieldType } from "../types";


export const PostSchema = await Schema({
    name: "Post",
    fields: [
      {
        name: "title",
        type: FrogFieldType.String,
      },
      {
        name: "content",
        type: FrogFieldType.String,
      },
      {
        name: "author",
        type: FrogFieldType.String,
      },
    ],
})