import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config/constants.config";

const bcryptPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export { bcryptPassword };
