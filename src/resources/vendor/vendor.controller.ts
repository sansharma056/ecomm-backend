import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export const create = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const vendor: { name: string } = req.body;

  try {
    await prisma.vendor.create({
      data: {
        name: vendor.name,
      },
    });

    res.status(200).json({ message: "Vendor created." });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  } finally {
    prisma.$disconnect();
  }
};

export const getAll = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();

  const vendors = await prisma.vendor.findMany({
    include: {
      products: true,
    },
  });

  prisma.$disconnect();
  return res.status(200).json({ vendors });
};

export const getById = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const params = req.params;

  const vendor = await prisma.vendor.findUnique({
    where: {
      id: +params.id,
    },
    include: {
      products: {
        select: {
          details: true,
        },
      },
    },
  });

  prisma.$disconnect();

  if (vendor === null) {
    return res.status(400).json({
      message:
        "Vendor with that id wasn't found. Please recheck the vendor id and make sure it is correct",
    });
  }

  return res.status(200).json({ vendor });
};
