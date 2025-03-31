import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { HandCoins } from "lucide-react";
import {
  ShoppingCartIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  ClipboardDocumentCheckIcon,
  TagIcon,
  CurrencyDollarIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

import api from "../api/config.js";
import { useAuth } from "../context/AuthContext.jsx";

const AddOrder = () => {
  const navigate = useNavigate();

  const { authState } = useAuth();
  const { userInfo: user, token } = authState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myProducts, setMyProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [formData, setFormData] = useState({
    product: "",
    qty: "",
    price: "",
    commission: "",
    commissionRate: "",
    customerName: "",
    customerPhone: "",
    customerLocation: "",
    remarks: "",
  });

  //get my products
  useEffect(() => {
    const getMyProducts = async () => {
      try {
        const response = await api.get("/product/getMyProduct", {
          headers: { token },
        });
        if (response.data.success) {
          console.log(response);

          setMyProducts(response.data.myProducts);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message, {
          autoClose: 2000,
          theme: "colored",
        });
      }
    };
    getMyProducts();
  }, []);

  useEffect(() => {
    // Find the product based on formData.product
    const product = myProducts.find(
      (product) => product._id === formData.product
    );

    if (product) {
      // If the product is found, update the state with its properties
      setSelectedProduct(product);
      console.log(product);
      setFormData((prevData) => ({
        ...prevData,
        price: product.price,
        commission: parseFloat(product.commission).toFixed(2),
        commissionRate: parseFloat(product.commissionRate) + parseFloat(user.commissionRate)
      }));
      // setCommission(product.commission);
    } else {
      // Optionally handle the case when the product is not found
      console.log("Product not found.");
    }
  }, [formData.product, myProducts]);

  useEffect(() => {
    if (formData.product) {
      let pPrice = parseFloat(selectedProduct.price);
      let oPrice = parseFloat(formData.price);
      let x = oPrice - pPrice;
      console.log(pPrice);
      console.log(oPrice);
      console.log(x);
      setFormData((prevData) => ({
        ...prevData,
        commission: (parseFloat(selectedProduct.commission) + x).toFixed(2),
      }));
    }
  }, [formData.price]);

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Display form data in the console
    setIsSubmitting(true);
    console.log(token);

    console.log("Form Submitted", formData);

    try {
      const response = await api.post(`/order/addOrder`, formData, {
        headers: { token },
      });

      if (response.data.success) {
        console.log(response);
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
          onClose: () => {
            setIsSubmitting(false);
            navigate("/orders");
          },
        });
      } else {
        setIsSubmitting(false);
        console.log(response);
        toast.error(response.data.message, {
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (e) {
      setIsSubmitting(false);
      console.log(e);
      toast.error(e, {
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="p-4 sm:ml-64 mt-4">
      <ToastContainer />
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <PlusIcon className="h-6 w-6 text-blue-500 mr-2" />
          Add New Order
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Product Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
              <select
                name="product"
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
              >
                <option selected disabled>
                  ---Select Product---
                </option>
                {myProducts.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Quantity
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <ShoppingCartIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter quantity"
              />
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Price</label>
            {selectedProduct && (
              <p className="block text-gray-700 text-xs">
                Actual Price: {selectedProduct.price}
              </p>
            )}
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

          {/* Commission Rate*/}
          <div className="mb-4">
            <div className="flex gap-4">
              <div>
                <label className="block text-gray-700 font-semibold">
                  Commission Rate (%)
                </label>
                <div className="flex items-center border border-gray-300 rounded-md p-2">
                  <HandCoins className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="number"
                    value={selectedProduct?.commissionRate}
                    placeholder="Commission"
                    className="w-full p-1 outline-none cursor-not-allowed text-gray-600"
                    disabled
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Bonus Commission (%)
                </label>
                <div className="flex items-center border border-gray-300 rounded-md p-2">
                  <HandCoins className="h-5 w-5 text-gray-400 mr-2" />
                  {console.log(user)}
                  <input
                    type="number"
                    value={user?.commissionRate}
                    placeholder="Commission"
                    className="w-full p-1 outline-none cursor-not-allowed text-gray-600"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Commission */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Commission
            </label>
            {selectedProduct && (
              <p className="block text-gray-700 text-xs">
                Actual Commission:{" "}
                {parseFloat(selectedProduct.commission).toFixed(2)}
              </p>
            )}
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <HandCoins className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="number"
                value={formData.commission}
                placeholder="Commission"
                className="w-full p-1 outline-none cursor-not-allowed text-gray-600"
                disabled
              />
            </div>
          </div>

          {/* Customer Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Customer Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter customer name"
              />
            </div>
          </div>

          {/* Customer Phone */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Customer Phone Number
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter customer phone number"
              />
            </div>
          </div>

          {/* Customer Location */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Customer Location
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="customerLocation"
                value={formData.customerLocation}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter customer location"
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Remarks (Optional)
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <ClipboardDocumentCheckIcon className="h-5 w-5 text-gray-400 mr-2" />
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="w-full p-1 outline-none"
                placeholder="Enter remarks (optional)"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
          >
            <PlusIcon className="h-5 w-5 text-white mr-2" />
            Add Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOrder;
