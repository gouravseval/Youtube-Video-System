import bcrypt from "bcryptjs";

const salts = 10

export const hashPassword = async (hashPassword) => {
  try {
    const salt = await bcrypt.genSaltSync(salts);
    const hash = await bcrypt.hashSync(hashPassword, salt);
    return hash
  } catch (err) {
    throw new Error(err);
  }
};

export const comparePassword = async (password, hashPassword) => {
    try {
        return await bcrypt.compareSync(password, hashPassword);
    } catch (error) {
        throw new Error(error)
    }
}
