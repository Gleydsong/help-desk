import { randomBytes } from "crypto";

export const generateTempPassword = () => {
  const token = randomBytes(3).toString("hex");
  return `Temp@${token}`;
};
