import { FrogFieldType, Schema } from "../lib"

export const schema = await Schema({
    name: "user",
    fields: [
        { name: "name", type: FrogFieldType.String },
        { name: "age", type: FrogFieldType.Number },
    ]
})


