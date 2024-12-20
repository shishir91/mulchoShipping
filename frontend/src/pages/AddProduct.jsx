import React, { useState } from "react";
import {
  TagIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PlusIcon,
  PhotoIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    price: "",
    description: "",
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleImageRemove = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    console.log("Selected images:", images);
  };

  return (
    <div className="p-4 sm:ml-64 mt-4">
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <PlusIcon className="h-6 w-6 text-blue-500 mr-2" />
          Add Product
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="mb-4">
            <label className="block text-gray-700">Product Name</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter product name"
              />
            </div>
          </div>

          {/* Stock */}
          <div className="mb-4">
            <label className="block text-gray-700">Stock</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <ShoppingCartIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter stock"
              />
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter price"
              />
            </div>
          </div>

          {/* Commission */}
          <div className="mb-4">
            <label className="block text-gray-700">Commission</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="number"
                name="commission"
                value={formData.commission}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter commission"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-1 outline-none"
                placeholder="Enter product description"
                rows={1}
              />
            </div>
          </div>

          {/* Product Images */}
          <div className="mb-4">
            <label className="block text-gray-700">Product Images</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <PhotoIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-1 outline-none"
                required
              />
            </div>
          </div>

          {/* Display Selected Images */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <XCircleIcon
                    onClick={() => handleImageRemove(index)}
                    className="h-6 w-6 text-red-500 absolute top-1 right-1 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
          >
            <PlusIcon className="h-5 w-5 text-white mr-2" />
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
