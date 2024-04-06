import { FrogDB, FrogFieldType, Schema } from "./lib"

const UserSchema = await Schema({
    name: "user",
    fields: [
        {
            name: "username",
            type: FrogFieldType.String,
        },
        {
            name: "password",
            type: FrogFieldType.String,
        },
        {
            name: "isAdmin",
            type: FrogFieldType.Boolean,
        },
    ]
})

const db = FrogDB().generate([UserSchema])

const newUser = await UserSchema.findOne({
    username: "lasdse"
})

console.log(newUser ? newUser : "Does not exist");

