import { PrismaClient, User } from ".prisma/client";
import { Request, Response } from "express";

export const getAll = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      passwordHash: false,
    },
  });

  prisma.$disconnect();

  return res.status(200).json({ users });
};

export const getById = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const params = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: +params.id,
    },
    include: {
      details: true,
      cart: true,
    },
  });

  prisma.$disconnect();

  if (user === null) {
    return res.status(400).json({
      message:
        "User with that id wasn't found. Please recheck the user id and make sure it is correct",
    });
  }

  return res
    .status(200)
    .json({ id: user.id, name: user.name, details: user.details });
};
