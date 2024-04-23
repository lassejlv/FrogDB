import { FrogFieldType, type FrogField } from "../types";

const formatType = (field: FrogField) => {
  if (field.type === FrogFieldType.String) {
    return "string";
  } else if (field.type === FrogFieldType.Number) {
    return "number";
  } else if (field.type === FrogFieldType.Boolean) {
    return "boolean";
  } else if (field.type === FrogFieldType.Date) {
    return "Date";
  } else if (field.type === FrogFieldType.Object) {
    return "object";
  } else if (field.type === FrogFieldType.Array) {
    return "any[]";
  } else {
    return "any";
  }
};

export { formatType };
