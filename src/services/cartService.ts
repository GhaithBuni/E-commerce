import { cartmodel } from "../models/cartModel";
import productModel from "../models/productModel";

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

interface AddItemToCart {
  userId: string;
  productId: any;
  quantity: number;
}

export const addItemToCart = async ({
  userId,
  productId,
  quantity,
}: AddItemToCart) => {
  const cart = await getActiveCartUser({ userId });

  const exsistInCart = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (exsistInCart) {
    return { data: "Product already in cart", statusCode: 400 };
  }

  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product not found", statusCode: 404 };
  }

  if (product.stock < quantity) {
    return { data: "Product stock not sufficient", statusCode: 400 };
  }

  cart.items.push({ product: productId, unitPrice: product.price, quantity });

  // update total price

  cart.totalPrice += product.price * quantity;
  const updatedCart = await cart.save();

  return { data: updatedCart, statusCode: 200 };
};

interface UpdateItemInCart {
  userId: string;
  productId: any;
  quantity: number;
}
export const updateItemInCart = async ({
  userId,
  productId,
  quantity,
}: UpdateItemInCart) => {
  const cart = await getActiveCartUser({ userId });

  const exsistInCart = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!exsistInCart) {
    return { data: "Product not found in cart", statusCode: 404 };
  }

  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product not found", statusCode: 404 };
  }

  if (product.stock < quantity) {
    return { data: "Product stock not sufficient", statusCode: 400 };
  }

  const otherItems = cart.items.filter(
    (p) => p.product.toString() !== productId
  );

  let total = otherItems.reduce((sum, product) => {
    sum = product.unitPrice * product.quantity;
    return sum;
  }, 0);
  exsistInCart.quantity = quantity;
  total += exsistInCart.unitPrice * exsistInCart.quantity;
  cart.totalPrice = total;
  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
};
