import React, { useState, useEffect } from "react";
import { ShoppingBagIcon, TagIcon, EyeIcon } from "@heroicons/react/24/solid";
import api from "../api/config.js";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   async function fetchProducts() {
  //     try {
  //       const response = await api.get("/products");
  //       if (response.data.success) {
  //       }
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     }
  //   }
  //   fetchProducts();
  // }, []);
  const products = [
    {
      id: 1,
      title: "Essence Mascara Lash Princess",
      description:
        "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
      category: "beauty",
      price: 9.99,
      discountPercentage: 7.17,
      rating: 4.94,
      stock: 5,
      images: [
        "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png",
      ],
      thumbnail:
        "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
    },
    {
      id: 2,
      title: "Eyeshadow Palette with Mirror",
      description:
        "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.",
      category: "beauty",
      price: 19.99,
      discountPercentage: 5.5,
      rating: 3.28,
      stock: 44,
      images: [
        "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png",
      ],
      thumbnail:
        "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png",
    },
  ];

  return (
    <div className="p-4 sm:ml-64 mt-4">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold flex items-center">
            <ShoppingBagIcon className="h-8 w-8 text-blue-500 mr-3" />
            Products
          </h2>
          <button
            onClick={() => navigate("/addProduct")}
            className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center hover:bg-blue-600"
          >
            <PlusIcon className="h-5 w-5 mr-3 " />
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={product.images[0]}
                  alt={product.productName}
                  className="h-40 w-full object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {product.title}
                </h3>
                <p className="text-gray-600 mb-2 flex items-center">
                  <TagIcon className="h-5 w-5 text-gray-400 mr-2" />$
                  {product.price}
                </p>
                <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
                <button className="w-full bg-blue-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-blue-600">
                  <EyeIcon className="h-5 w-5 text-white mr-2" />
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center">
              No products available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
