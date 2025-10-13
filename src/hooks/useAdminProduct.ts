import { useEffect, useState } from "react";

export const useAdminProduct = () => {
  const products = [
    {
      id: "42f7070e-08f4-415c-ac50-fc4aadcbff01",
      name: "Áo thun nam",
      description: "Chất liệu cao cấp",
      status: "published",
      hasVariant: true,
      productVariants: [
        {
          id: "1282cd37-99d6-4282-bcd7-74624f7bd2d1",
          price: 1000,
          sku: "AO-THUN-004",
          stock: 50,
          variantValues: [{ variant: "Size", value: "M" }],
        },
      ],
      productImages: ["https://example.com"],
      categories: ["Áo thun"],
      createdAt: "2025-10-06T06:45:53.355Z",
      updatedAt: "2025-10-06T06:45:53.355Z",
    },
    {
      id: "42f7070e-08f4-415c-ac50-fc4aadcbff02",
      name: "Áo thun nam",
      description: "Chất liệu cao cấp",
      status: "unpublished",
      hasVariant: true,
      productVariants: [
        {
          id: "1282cd37-99d6-4282-bcd7-74624f7bd2d2",
          price: 1000,
          sku: "AO-THUN-004",
          stock: 50,
          variantValues: [{ variant: "Size", value: "M" }],
        },
      ],
      productImages: ["https://example.com"],
      categories: ["Áo thun", "Áo thun", "Áo thun", "Áo thun"],
      createdAt: "2025-10-06T06:45:53.355Z",
      updatedAt: "2025-10-06T06:45:53.355Z",
    },
    {
      id: "42f7070e-08f4-415c-ac50-fc4aadcbff03",
      name: "Áo thun nam",
      description: "Chất liệu cao cấp",
      status: "published",
      hasVariant: true,
      productVariants: [
        {
          id: "1282cd37-99d6-4282-bcd7-74624f7bd2d3",
          price: 1000,
          sku: "AO-THUN-004",
          stock: 50,
          variantValues: [{ variant: "Size", value: "M" }],
        },
      ],
      productImages: ["https://example.com"],
      categories: ["Áo thun"],
      createdAt: "2025-10-06T06:45:53.355Z",
      updatedAt: "2025-10-06T06:45:53.355Z",
    },
    {
      id: "42f7070e-08f4-415c-ac50-fc4aadcbff04",
      name: "Áo thun nam",
      description: "Chất liệu cao cấp",
      status: "published",
      hasVariant: true,
      productVariants: [
        {
          id: "1282cd37-99d6-4282-bcd7-74624f7bd2d4",
          price: 1000,
          sku: "AO-THUN-004",
          stock: 50,
          variantValues: [{ variant: "Size", value: "M" }],
        },
      ],
      productImages: ["https://example.com"],
      categories: ["Áo thun"],
      createdAt: "2025-10-06T06:45:53.355Z",
      updatedAt: "2025-10-06T06:45:53.355Z",
    },
    {
      id: "42f7070e-08f4-415c-ac50-fc4aadcbff05",
      name: "Áo thun nam",
      description: "Chất liệu cao cấp",
      status: "unpublished",
      hasVariant: true,
      productVariants: [
        {
          id: "1282cd37-99d6-4282-bcd7-74624f7bd2d5",
          price: 1000,
          sku: "AO-THUN-004",
          stock: 50,
          variantValues: [{ variant: "Size", value: "M" }],
        },
      ],
      productImages: ["https://example.com"],
      categories: ["Áo thun"],
      createdAt: "2025-10-06T06:45:53.355Z",
      updatedAt: "2025-10-06T06:45:53.355Z",
    },
    {
      id: "42f7070e-08f4-415c-ac50-fc4aadcbff06",
      name: "Áo thun nam",
      description: "Chất liệu cao cấp",
      status: "published",
      hasVariant: true,
      productVariants: [
        {
          id: "1282cd37-99d6-4282-bcd7-74624f7bd2d6",
          price: 1000,
          sku: "AO-THUN-004",
          stock: 50,
          variantValues: [{ variant: "Size", value: "M" }],
        },
      ],
      productImages: ["https://example.com"],
      categories: ["Áo thun"],
      createdAt: "2025-10-06T06:45:53.355Z",
      updatedAt: "2025-10-06T06:45:53.355Z",
    },
    {
      id: "42f7070e-08f4-415c-ac50-fc4aadcbff07",
      name: "Áo thun nam",
      description: "Chất liệu cao cấp",
      status: "unpublished",
      hasVariant: true,
      productVariants: [
        {
          id: "1282cd37-99d6-4282-bcd7-74624f7bd2d7",
          price: 1000,
          sku: "AO-THUN-004",
          stock: 50,
          variantValues: [{ variant: "Size", value: "M" }],
        },
      ],
      productImages: ["https://example.com"],
      categories: ["Áo thun"],
      createdAt: "2025-10-06T06:45:53.355Z",
      updatedAt: "2025-10-06T06:45:53.355Z",
    },
    {
      id: "42f7070e-08f4-415c-ac50-fc4aadcbff08",
      name: "Áo thun nam",
      description: "Chất liệu cao cấp",
      status: "published",
      hasVariant: true,
      productVariants: [
        {
          id: "1282cd37-99d6-4282-bcd7-74624f7bd2d8",
          price: 1000,
          sku: "AO-THUN-004",
          stock: 50,
          variantValues: [{ variant: "Size", value: "M" }],
        },
      ],
      productImages: ["https://example.com"],
      categories: ["Áo thun"],
      createdAt: "2025-10-06T06:45:53.355Z",
      updatedAt: "2025-10-06T06:45:53.355Z",
    },
    {
      id: "42f7070e-08f4-415c-ac50-fc4aadcbff09",
      name: "Áo thun nam",
      description: "Chất liệu cao cấp",
      status: "published",
      hasVariant: true,
      productVariants: [
        {
          id: "1282cd37-99d6-4282-bcd7-74624f7bd2d9",
          price: 1000,
          sku: "AO-THUN-004",
          stock: 50,
          variantValues: [{ variant: "Size", value: "M" }],
        },
      ],
      productImages: ["https://example.com"],
      categories: ["Áo thun"],
      createdAt: "2025-10-06T06:45:53.355Z",
      updatedAt: "2025-10-06T06:45:53.355Z",
    },
    {
      id: "42f7070e-08f4-415c-ac50-fc4aadcbff10",
      name: "Áo thun nam",
      description: "Chất liệu cao cấp",
      status: "published",
      hasVariant: true,
      productVariants: [
        {
          id: "1282cd37-99d6-4282-bcd7-74624f7bd2d10",
          price: 1000,
          sku: "AO-THUN-004",
          stock: 50,
          variantValues: [{ variant: "Size", value: "M" }],
        },
      ],
      productImages: ["https://example.com"],
      categories: ["Áo thun"],
      createdAt: "2025-10-06T06:45:53.355Z",
      updatedAt: "2025-10-06T06:45:53.355Z",
    },
  ];

  const pageSize = 10;
  const page = 1;
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isSelectedAllProduct, setIsSelectedAllProduct] =
    useState<boolean>(false);

  // useEffect(() => {
  //   if (selectedProducts && selectedProducts.length === pageSize) {
  //     setIsSelectedAllProduct(true);
  //   }
  // }, [selectedProducts]);

  // useEffect(() => {
  //   setSelectedProducts(products.map((product) => product.id));
  // }, [isSelectedAllProduct]);
  return {
    products,
    isSelectedAllProduct,
    setSelectedProducts,
    setIsSelectedAllProduct,
    selectedProducts,
    pageSize,
    page,
  };
};
