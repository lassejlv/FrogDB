import { FrogDB } from ".";
import { UserSchema } from "./schemas/User.ts";
import { User } from "../db/types/User.ts";

const user = await UserSchema.insert<User>({
  name: "John Doe",
  age: 20,
  createdAt: new Date(),
  settings: {
    darkMode: true,
  },
  payments: [
    {
      amount: 20,
      date: new Date(),
    },
  ],
});

const db = FrogDB({
  server: {
    host: "http://localhost",
    port: 8000,
    auth: {
      user: "admin",
      password: "123456",
    },
  },
});

db.generate([UserSchema]);
