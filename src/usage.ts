import { FrogDB } from ".";
import { UserSchema } from "./schemas/User.ts";
import { User } from "../db/types/User.ts";

const user = await UserSchema.deleteAll<User>({ name: "John" });



FrogDB().generate([UserSchema]);
