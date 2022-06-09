import { v4 as uuid } from "uuid";

interface IName {
  firstName: string;
  middleName: string;
  otherName: string;
  lastName: string;
}

export function generateFullName(input: IName) {
  const name = `${input.firstName} ${input?.middleName}${
    input.otherName ? ` ${input.otherName}` : ""
  } ${input.lastName}`;

  return name;
}

export function generateID() {
  let id = uuid();
  id = id?.split("-")?.join("");
  return id;
}
