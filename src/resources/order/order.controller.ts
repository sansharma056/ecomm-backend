import { Cart, CartItem, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getAll = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
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
        address: true,
      },
      orderBy: {
        purchasedAt: "desc",
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
  try {
    const order = prisma.order.create({
      data: {
        orderStatus: "PENDING",
        purchasedAt: new Date(),
        address: {
          create: req.body.address,
        },
        orderLines: {
          createMany: {
            data: req.body.cart.map((item: CartItem) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
        user: {
          connect: {
            id: req.user?.id,
          },
        },
      },
    });

    const cartItems = prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId: req.user?.id,
        },
      },
    });

    await prisma.$transaction([order, cartItems]);
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};
