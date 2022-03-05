import { config } from "./config";
import { Address, PrismaClient, User, UserDetails } from "@prisma/client";
import { NextFunction, Request, response, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface UserDetailsData extends UserDetails {
  address: Address;
}

interface UserData extends Omit<User, "passwordHash"> {
  password: string;
  details: UserDetailsData;
}

interface Credentials {
  name: string;
  password: string;
}

export const newToken = (id: Number) => {
  return jwt.sign({ id }, config.secrets.jwt);
};

export const verifyToken = (token: string) => {
  return new Promise<{ id: number } | null>((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload as { id: number } | null);
    });
  });
};

export const signup = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();

  const userData: UserData = req.body;
  const hash = await hashPassword(userData.password);

  try {
    await prisma.user.create({
      data: {
        name: userData.name,
        passwordHash: hash,
        details: {
          create: {
            ...userData.details,
            address: {
              create: {
                ...userData.details.address,
              },
            },
          },
        },
        cart: {
          create: {},
        },
      },
    });

    res.status(200).json({ message: "User created." });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  } finally {
    prisma.$disconnect();
  }
};

export const signin = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();

  const userCredentials: Credentials = req.body;
  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: userCredentials.name,
      },
    },
  });
  prisma.$disconnect();

  let isSigninSuccessful = false;
  try {
    if (user !== null) {
      isSigninSuccessful = await bcrypt.compare(
        userCredentials.password,
        user.passwordHash
      );
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Incorrect payload." });
  }

  if (user === null || !isSigninSuccessful) {
    return res
      .status(400)
      .json({ message: "Incorrect credentials. Please try again." });
  }

  try {
    const token = newToken(user.id);
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Could not generate token. Please try again." });
  }
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(400).json({ message: "No valid token passed." });
  }

  const token: string = bearer.split("Bearer ")[1];

  let payload: { id: number } | null = null;

  try {
    payload = await verifyToken(token);
  } catch (e) {
    console.error(e);
    return response.status(403).json({ message: "Invalid token." });
  }

  if (payload === null) {
    return response.status(400).json({ message: "Invalid token." });
  }

  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
  });
  prisma.$disconnect();

  if (user === null) {
    return response.status(403).json({ message: "Invalid token." });
  }

  req.user = user;

  next();
};

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}
