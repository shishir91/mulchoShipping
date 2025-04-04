import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
import Loading from "../components/Loading.jsx";
import { HandCoins } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const EditOrder = () => {
  const [formData, setFormData] = useState({});
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const { authState } = useAuth();
  const { userInfo: user, token } = authState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await api.get(`/order/getOrderDetail/${orderId}`, {
          headers: { token },
        });
        if (response.data.success) {
          console.log(response);

          setFormData(response.data.order);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (formData.product) {
      setFormData((prevData) => ({
        ...prevData,
        price: formData.product.price,
        commission: (
          ((parseFloat(formData.product.commissionRate) +
            parseFloat(formData.orderFrom.commissionRate)) /
            100) *
          parseFloat(formData.product.price)
        ).toFixed(2),
        commissionRate:
          parseFloat(formData.product.commissionRate) +
          parseFloat(formData.orderFrom.commissionRate),
      }));
    }
  }, [formData.product]);

  useEffect(() => {
    if (formData.product) {
      let pPrice = parseFloat(formData.product.price);
      let oPrice = parseFloat(formData.price);
      let x = oPrice - pPrice;
      console.log(pPrice);
      console.log(oPrice);
      console.log(x);
      setFormData((prevData) => ({
        ...prevData,
        commission: (
          ((parseFloat(formData.product.commissionRate) +
            parseFloat(formData.orderFrom.commissionRate)) /
            100) *
            parseFloat(formData.product.price) +
          x
        ).toFixed(2),
      }));
    }
  }, [formData.price]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(formData);
    setLoading(true);
    try {
      const response = await api.put(`/order/editOrder/${orderId}`, formData, {
        headers: { token },
      });
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 1000,
          onAutoClose: () => {
            setIsSubmitting(false);
            navigate("/orders");
          },
        });
      } else {
        setIsSubmitting(false);
        toast.error("Failed to update order");
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error updating order:", error);
      toast.error("An error occurred while updating the order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-4 sm:ml-64 mt-4">
      {loading && <Loading />}
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <PlusIcon className="h-6 w-6 text-blue-500 mr-2" />
          Edit Order
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">
              Product Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
              {console.log(formData)}

              <input
                type="text"
                name="productName"
                value={formData.product.productName || ""}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter product name"
                disabled
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">
              Quantity
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <ShoppingCartIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="qty"
                value={formData.qty || ""}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter quantity"
              />
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">Price</label>
            {formData?.product && (
              <p className="block text-gray-700 text-xs">
                Actual Price: {formData?.product?.price}
              </p>
            )}
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="price"
                value={formData.price || ""}
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
                    value={formData?.product?.commissionRate}
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
                  <input
                    type="number"
                    value={formData?.orderFrom?.commissionRate}
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
            {formData?.product && (
              <p className="block text-gray-700 text-xs">
                Actual Commission:{" "}
                {parseFloat(formData?.product?.commission).toFixed(2)}
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
            <label className="block font-semibold text-gray-700">
              Customer Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="customerName"
                value={formData.customerName || ""}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter customer name"
              />
            </div>
          </div>

          {/* Customer Phone */}
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">
              Customer Phone Number
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="customerPhone"
                value={formData.customerPhone || ""}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter customer phone number"
              />
            </div>
          </div>

          {/* Customer Location */}
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">
              Customer Location
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="customerLocation"
                value={formData.customerLocation || ""}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter customer location"
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">
              Remarks (Optional)
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <ClipboardDocumentCheckIcon className="h-5 w-5 text-gray-400 mr-2" />
              <textarea
                name="remarks"
                value={formData.remarks || ""}
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
            className="w-full bg-blue-500 cursor-pointer text-white p-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
          >
            <PlusIcon className="h-5 w-5 text-white mr-2" />
            Edit Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditOrder;
