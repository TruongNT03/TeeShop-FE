// src/hooks/useHome.ts
export const useHome = () => {
  const newArrivalProducts = [
    {
      name: "Linen Overshirt",
      image: "https://picsum.photos/seed/linen/750/750",
      price: "$79",
    },
    {
      name: "Denim Jacket",
      image: "https://picsum.photos/seed/denim/750/750",
      price: "$129",
    },
    {
      name: "Cotton Polo Shirt",
      image: "https://picsum.photos/seed/polo/750/750",
      price: "$49",
    },
    {
      name: "Relaxed Fit Trousers",
      image: "https://picsum.photos/seed/trousers/750/750",
      price: "$99",
    },
    {
      name: "Textured Knit Sweater",
      image: "https://picsum.photos/seed/sweater/750/750",
      price: "$89",
    },
    {
      name: "Slim Fit Jeans",
      image: "https://picsum.photos/seed/jeans/750/750",
      price: "$109",
    },
    {
      name: "Wool Blend Coat",
      image: "https://picsum.photos/seed/coat/750/750",
      price: "$139",
    },
    {
      name: "Minimal Leather Sneakers",
      image: "https://picsum.photos/seed/sneakers/750/750",
      price: "$99",
    },
    {
      name: "Oversized Hoodie",
      image: "https://picsum.photos/seed/hoodie/750/750",
      price: "$69",
    },
    {
      name: "Printed Cotton T-shirt",
      image: "https://picsum.photos/seed/tshirt/750/750",
      price: "$39",
    },
    {
      name: "Cargo Pants",
      image: "https://picsum.photos/seed/cargo/750/750",
      price: "$119",
    },
    {
      name: "Basic Knit Beanie",
      image: "https://picsum.photos/seed/beanie/750/750",
      price: "$35",
    },
  ];

  const topSellerProducts = [
    {
      name: "Oversized Blazer",
      image: "https://picsum.photos/seed/blazer/750/750",
      price: "$149",
    },
    {
      name: "Chunky Sneakers",
      image: "https://picsum.photos/seed/chunky/750/750",
      price: "$109",
    },
    {
      name: "Tailored Suit Pants",
      image: "https://picsum.photos/seed/pants/750/750",
      price: "$99",
    },
    {
      name: "Wool Scarf",
      image: "https://picsum.photos/seed/scarf/750/750",
      price: "$45",
    },
    {
      name: "Cropped Denim Jacket",
      image: "https://picsum.photos/seed/cropped-denim/750/750",
      price: "$89",
    },
    {
      name: "High-Top Sneakers",
      image: "https://picsum.photos/seed/hightop/750/750",
      price: "$119",
    },
    {
      name: "Wool Turtleneck",
      image: "https://picsum.photos/seed/turtleneck/750/750",
      price: "$69",
    },
    {
      name: "Slim Leather Belt",
      image: "https://picsum.photos/seed/belt/750/750",
      price: "$49",
    },
  ];

  return { newArrivalProducts, topSellerProducts };
};
