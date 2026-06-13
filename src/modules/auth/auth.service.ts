import { ILoginUser, IUser } from "./auth.interface";
import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt";
const createUser = async (payload: IUser) => {
  // check email exists

  const existingUser = await pool.query("SELECT * FROM users WHERE email=$1", [
    payload.email,
  ]);

  if (existingUser.rows.length > 0) {
    throw new Error("Email already exists");
  }

  // hash password

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // insert user

  const query = `
    INSERT INTO users(name,email,password,role)
    VALUES($1,$2,$3,$4)
    RETURNING id,name,email,role,created_at,updated_at
  `;

  const values = [payload.name, payload.email, hashedPassword, payload.role];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const loginUser = async (payload: ILoginUser) => {
  const userResult = await pool.query("SELECT * FROM users WHERE email=$1", [
    payload.email,
  ]);

  const user = userResult.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    id: user.id,
    name: user.name,
    role: user.role,
  });

  const { password, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
};

export const AuthService = {
  createUser,
  loginUser,
};
