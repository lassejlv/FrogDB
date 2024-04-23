import { type FrogField } from "../types";
declare const formatType: (field: FrogField) => "string" | "number" | "boolean" | "object" | "Date" | "any[]" | "any";
export { formatType };
