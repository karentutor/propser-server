import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { User, IUser } from "../models/User";

type AuthUserPayload = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type AuthResult = {
  user: AuthUserPayload;
  access_token: string;
};

type RegisterUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

function signToken(user: IUser): string {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const expiresIn: SignOptions["expiresIn"] = "7d";

  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
    },
    jwtSecret,
    { expiresIn }
  );
}

function buildAuthResponse(user: IUser): AuthResult {
  const access_token = signToken(user);

  return {
    user: {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    access_token,
  };
}

export async function registerUser(
  input: RegisterUserInput
): Promise<AuthResult> {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("An account with that email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    isActive: true,
  });

  return buildAuthResponse(user);
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("Account is inactive");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  return buildAuthResponse(user);
}

export async function getCurrentUser(userId: string) {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}