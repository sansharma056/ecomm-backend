import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export const getAll = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();

  try {
    const orders = prisma.order.findMany({
      where: {
        userId: req.user?.id,
      },
      include: {
        orderLines: {
          include: {
            product: {
              include: {
                details: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const createOne = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
};
