import productModel from "../models/productModel";

export const getAllProducts = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
  const products = [
    {
      title: "RTX 5090",
      image:
        "https://cdn.inet.se/img/800x10000/cms/55413314-e5f2-4420-bac7-8cc4b619330e.webp",
      price: 2999,
      stock: 10,
    },
    // { title: "Product 2", image: "image2.jpg", price: 100, stock: 20 },
    // { title: "Product 3", image: "image3.jpg", price: 20, stock: 10 },
    // { title: "Product 4", image: "image4.jpg", price: 30, stock: 300 },
    // { title: "Product 5", image: "image5.jpg", price: 120, stock: 400 },
    // { title: "Product 6", image: "image6.jpg", price: 435, stock: 6 },
    // { title: "Product 7", image: "image7.jpg", price: 299, stock: 4 },
    // { title: "Product 8", image: "image8.jpg", price: 399, stock: 23 },
  ];
  const Allproducts = await getAllProducts();

  if (Allproducts.length === 0) {
    await productModel.insertMany(products);
  }
};
