import { Category, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export const getAll = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
  prisma.$disconnect;

  res.status(200).json({ categories });
};

export const getById = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const params = req.params;

  const category = await prisma.category.findUnique({
    where: {
      id: +params.id,
    },
  });
  prisma.$disconnect();

  if (category === null) {
    return res.status(400).json({
      message:
        "Category with that id wasn't found. Please recheck the category id and make sure it is correct",
    });
  }

  return res.status(200).json({ category });
};

export const create = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const categoryData: Category = req.body;

  try {
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        description: categoryData.description,
        imgURL: categoryData.imgURL,
        slug: categoryData.slug,
      },
    });

    res.status(200).json(category);
  } catch (e: any) {
    res.status(400).json({ message: e.meta.cause });
  } finally {
    prisma.$disconnect();
  }
};
