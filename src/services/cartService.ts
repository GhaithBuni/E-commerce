import { cartmodel } from "../models/cartModel";

interface createCartUser {
  userId: string;
}

const createCartUser = async ({ userId }: createCartUser) => {
  const cart = await cartmodel.create({ userId, totalPrice: 0 });
  await cart.save();
  return cart;
};

interface getActiveCartUser {
  userId: string;
}

export const getActiveCartUser = async ({ userId }: getActiveCartUser) => {
  let cart = await cartmodel.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await createCartUser({ userId });
  }

  return cart;
};
