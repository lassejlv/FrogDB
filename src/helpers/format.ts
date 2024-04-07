import { FrogFieldType, type FrogField } from "../types";

const formatType = (field: FrogField) => {
    if (field.type === FrogFieldType.String) {
      return "string";
    } else if (field.type === FrogFieldType.Number) {
      return "number";
    } else if (field.type === FrogFieldType.Boolean) {
      return "boolean";
    } else {
      return "any";
    }
}

export { formatType };