import crypto from "crypto";

export function CreateDocumentId() {
  return crypto.randomBytes(16).toString("hex");
}
