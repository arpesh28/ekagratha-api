import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config/constants.config";

const bcryptPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const comparePasswords = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    bcrypt.compare(password, hash).then((compare) => {
      resolve(compare);
    });
  });
};

export { bcryptPassword, comparePasswords };
