import { PrismaClient, Product, ProductDetails } from "@prisma/client";
import { Request, Response } from "express";

interface ProductData extends Product {
  details: ProductDetails;
  categories: { id: number }[];
}

export const create = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const product: ProductData = req.body;

  try {
    await prisma.product.create({
      data: {
        details: {
          create: {
            ...product.details,
          },
        },
        vendorId: product.vendorId,
        categories: {
          connect: product.categories,
        },
      },
    });

    res.status(200).json({ message: "Product Created." });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2003") {
      res.status(400).json({ message: "Make sure the vendor id is correct." });
    } else {
      res.status(400).json({ error });
    }
  }
};

export const getAll = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const products = await prisma.product.findMany({
    include: {
      details: true,
      vendor: true,
      reviews: true,
      categories: true,
    },
  });
  prisma.$disconnect();
  return res.status(200).json({ products });
};

export const getById = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const params = req.params;

  const product = await prisma.product.findUnique({
    where: {
      id: +params.id,
    },
    include: {
      details: true,
      vendor: true,
      reviews: true,
      categories: true,
    },
  });

  if (product === null) {
    return res.status(400).json({
      message:
        "Product with that id wasn't found. Please recheck the product id and make sure it is correct.",
    });
  }

  return res.status(200).json({ product });
};
