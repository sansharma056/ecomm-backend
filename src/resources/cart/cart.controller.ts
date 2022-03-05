import { CartItem, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export const get = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();

  const cart = await prisma.cart.findUnique({
    where: {
      userId: req.user?.id,
    },
    include: {
      items: true,
    },
  });

  prisma.$disconnect();

  if (cart === null) {
    return res.status(400).json({
      message:
        "User with that id wasn't found. Please recheck the user id and make sure it is correct",
    });
  }

  return res.status(200).json(cart);
};

export const createCartItem = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const cartItemData: CartItem = req.body;

  try {
    const cartItem = await prisma.cartItem.create({
      data: {
        quantity: cartItemData.quantity,
        cart: {
          connect: {
            userId: req.user?.id,
          },
        },
        product: {
          connect: {
            id: cartItemData.productId,
          },
        },
      },
    });

    return res.status(200).json(cartItem);
  } catch (e: any) {
    if (e.code === "P2002") {
      return res
        .status(400)
        .json({ message: "This product is already in your cart." });
    }

    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  const cartItemData: CartItem = req.body;

  try {
    const deletedCartItem = await prisma.cartItem.delete({
      where: {
        productId: cartItemData.productId,
      },
    });

    return res.status(200).json(deletedCartItem);
  } catch (e: any) {
    if (e.code === "P2025") {
      return res
        .status(400)
        .json({ message: "This product is not in your cart." });
    }
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};
