import { Failure, SendJSON } from "probun";
import { schema } from "../schema";


export async function GET(req: Request): Promise<Response> {
  const users = await schema.find({})
  return SendJSON(users)
}

export async function POST(req: Request): Promise<Response> {
    const letters = "abcdefghijklmnopqrstuvwxyz"

    const newUser = await schema.insert({
        name: `${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}`,
        age: Math.floor(Math.random() * 100)
    })

    return SendJSON(newUser)
}