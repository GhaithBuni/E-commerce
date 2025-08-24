import userModel from "../models/userModels";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterParams) => {
  const findUser = await userModel.findOne({ email });
  if (findUser) {
    return { data: "User already exists", statusCode: 400 };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  return { data: generateJWT({ firstName, lastName, email }), statusCode: 200 };
};

interface LoginParams {
  email: string;
  password: string;
}
export const login = async ({ email, password }: LoginParams) => {
  const findUser = await userModel.findOne({ email });
  if (!findUser) {
    return { data: "User not found", statusCode: 404 };
  }

  const isPasswordValid = await bcrypt.compare(password, findUser.password);

  if (isPasswordValid) {
    return {
      data: generateJWT({
        email,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
      }),
      statusCode: 200,
    };
  }

  return { data: "Incorrect email or password!", statusCode: 401 };
};

const generateJWT = (data: any) => {
  return jwt.sign(data, "1N4VblyzOVZjwmODJKjG1XDYMZAm7Y2r", {});
};
