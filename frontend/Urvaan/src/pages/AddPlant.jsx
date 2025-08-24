import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  Plus,
  AlertCircle,
  CheckCircle,
  Loader2,
  DollarSign,
  Tag,
  FileText,
  Image,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { plantApi } from "../api/plantApi";

const CATEGORIES = [
  "Indoor",
  "Outdoor",
  "Succulent",
  "Air Purifying",
  "Home Decor",
  "Flowering",
  "Medicinal",
];

const AddPlant = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categories: [],
    inStock: true,
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user, token, isAdmin } = useAuth();
  const navigate = useNavigate();

  // redirect non-admins
  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleCategoryChange = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
    if (error) setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) throw new Error("Plant name is required");
    if (!formData.price || formData.price <= 0)
      throw new Error("Please enter a valid price");
    if (formData.categories.length === 0)
      throw new Error("Please select at least one category");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      validateForm();

      // build FormData for multer
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("price", formData.price);
      formDataObj.append("inStock", formData.inStock);
      formDataObj.append("description", formData.description);
      formData.categories.forEach((cat) =>
        formDataObj.append("categories", cat)
      );
      if (formData.image) {
        formDataObj.append("image", formData.image);
      }

      await plantApi.createPlant(formDataObj, token);

      setSuccess("Plant added successfully!");

      setFormData({
        name: "",
        price: "",
        categories: [],
        inStock: true,
        description: "",
        image: null,
      });
      setImagePreview(null);

      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message || "Failed to add plant");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Add New Plant</h1>
          <p className="text-gray-600 mt-1">
            Fill in the details below to add a new plant to the catalog
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Plant Name */}
            <div>
              <label className="flex items-center text-gray-700 font-medium">
                <Tag className="h-4 w-4 mr-2" /> Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            {/* Price */}
            <div>
              <label className="flex items-center text-gray-700 font-medium">
                <DollarSign className="h-4 w-4 mr-2" /> Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            {/* Categories */}
            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <Plus className="h-4 w-4 mr-2" /> Categories
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center space-x-2 border rounded px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span>Available in stock</span>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center text-gray-700 font-medium">
                <FileText className="h-4 w-4 mr-2" /> Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="flex items-center text-gray-700 font-medium mb-2">
                <Image className="h-4 w-4 mr-2" /> Plant Image
              </label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-40 cursor-pointer">
                  <Upload className="h-6 w-6 text-gray-500 mb-2" />
                  <span className="text-gray-500">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : null}
                {loading ? "Adding..." : "Add Plant"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPlant;
