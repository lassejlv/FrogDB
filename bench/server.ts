import { ProBun } from "probun"
import { schema } from "./schema"
import { FrogDB } from "../lib"


// Setup database
FrogDB().generate([schema])

const app = new ProBun({
    port: 3000,
    routes: "routes",
    logger: true
})


app.start()