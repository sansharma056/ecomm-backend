import { PrismaClient, Review, User } from "@prisma/client";
import { Request, Response } from "express";

export const get = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();

  const reviews = await prisma.review.findMany();
  prisma.$disconnect();

  return res.status(200).send({ reviews });
};

export const getById = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const params = req.params;

  const review = await prisma.review.findUnique({
    where: {
      id: +params.id,
    },
  });
  prisma.$disconnect();

  if (review === null) {
    return res.status(400).json({
      message:
        "A review with that id wasn't found. Please recheck the review id and make sure it is correct.",
    });
  }

  return res.status(200).json({ review });
};

export const create = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const review: Review = req.body;

  try {
    await prisma.review.create({
      data: {
        ...review,
        authorId: (req.user as User).id,
      },
    });
    res.status(200).json({ message: "Review created." });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2003") {
      res.status(400).json({ message: "Make sure the product id is correct." });
    } else {
      res.status(400).json(error);
    }
  } finally {
    prisma.$disconnect();
  }
};
