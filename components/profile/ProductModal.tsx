/*"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Plus, Trash, X } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: any) => void;
}

interface Attribute {
  name: string;
  type: "select" | "text" | "number";
  options?: string[];
  dependsOn?: string;
  nestedAttributes?: Record<string, Attribute>;
}

interface CategoryConfig {
  label: string;
  attributes: Record<string, Attribute>;
}

interface ProductFormData {
  name: string;
  designer: string;
  mainCategory: string;
  subCategory: string;
  brand: string;
  price: string;
  stock: string;
  images: File[];
  attributes: Record<string, any>;
}

const productHierarchy: Record<string, {
  subCategories: Record<string, {
    brands: string[];
    attributes: Record<string, Attribute>;
  }>;
}> = {
  "Lab & Chemicals": {
    subCategories: {
      "Basic Chemicals": {
        brands: ["Sigma-Aldrich", "Fisher Scientific", "Merck", "Carolina Biological"],
        attributes: {
          ChemicalType: {
            name: "Chemical Type",
            type: "select",
            options: ["Acid", "Base", "Salt", "Solvent", "Indicator", "Metal"],
          },
          Grade: {
            name: "Grade",
            type: "select",
            options: ["Analytical", "Laboratory", "Reagent", "Technical"],
          },
          State: {
            name: "State",
            type: "select",
            options: ["Solid", "Liquid", "Powder", "Granule"],
          },
          Packaging: {
            name: "Packaging",
            type: "select",
            options: ["100ml", "250ml", "500ml", "1L", "5L"],
          },
        },
      },
      "Lab Equipment": {
        brands: ["Eisco", "United Scientific", "LabTech", "Thermo Fisher"],
        attributes: {
          EquipmentType: {
            name: "Equipment Type",
            type: "select",
            options: [
              "Beaker",
              "Conical Flask",
              "Test Tube",
              "Measuring Cylinder",
              "Bunsen Burner",
              "Balance",
              "Stirring Rod",
              "Dropper",
              "Rack"
            ],
          },
          Material: {
            name: "Material",
            type: "select",
            options: ["Glass", "Plastic", "Metal", "Ceramic"],
          },
          Capacity: {
            name: "Capacity",
            type: "select",
            options: ["10ml", "50ml", "100ml", "250ml", "500ml", "1L"],
          },
          SafetyCompliance: {
            name: "Safety Compliance",
            type: "select",
            options: ["ISO Certified", "CE Marked", "ASTM", "None"],
          },
        },
      },
    },
  },
};

export const ProductModal = ({ isOpen, onClose, onAddProduct }: ProductModalProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    designer: "",
    mainCategory: "",
    subCategory: "",
    brand: "",
    price: "",
    stock: "",
    images: [],
    attributes: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("attr-")) {
      const attrPath = name.replace("attr-", "");
      setFormData(prev => {
        // Create a new attributes object
        const newAttributes = { ...prev.attributes };
        
        // Set the current attribute value
        newAttributes[attrPath] = value;
        
        // Clear any nested attributes that depend on this one
        Object.keys(newAttributes).forEach(key => {
          if (key.startsWith(`${attrPath}-`)) {
            delete newAttributes[key];
          }
        });
        
        return {
          ...prev,
          attributes: newAttributes,
        };
      });
    } else {
      // Reset dependent fields when higher-level selections change
      if (name === "mainCategory") {
        setFormData(prev => ({
          ...prev,
          mainCategory: value,
          subCategory: "",
          brand: "",
          attributes: {},
        }));
      } else if (name === "subCategory") {
        setFormData(prev => ({
          ...prev,
          subCategory: value,
          brand: "",
          attributes: {},
        }));
      } else if (name === "brand") {
        setFormData(prev => ({
          ...prev,
          brand: value,
          attributes: {},
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files].slice(0, 5),
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('designer', formData.designer);
      formDataToSend.append('mainCategory', formData.mainCategory);
      formDataToSend.append('subCategory', formData.subCategory);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('attributes', JSON.stringify(formData.attributes));
      
      // Append each image file
      formData.images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });
  
      const response = await fetch('https://malex-backend.onrender.com/api/products', {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit product');
      }
  
      const result = await response.json();
      
      // Call the onAddProduct callback with the new product
      onAddProduct(result.product);
      onClose();
      
      // Reset form
      setFormData({
        name: "",
        designer: "",
        mainCategory: "",
        subCategory: "",
        brand: "",
        price: "",
        stock: "",
        images: [],
        attributes: {},
      });
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('Error submitting product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentAttributes = () => {
    const mainCategory = productHierarchy[formData.mainCategory as keyof typeof productHierarchy];
    if (!mainCategory) return {};
    const subCategory = mainCategory.subCategories[formData.subCategory as keyof typeof mainCategory.subCategories];
    if (!subCategory) return {};
    return (subCategory as typeof productHierarchy[string]["subCategories"][string]).attributes;
  };

  const getBrandOptions = () => {
    if (!formData.mainCategory || !formData.subCategory) return [];
    return productHierarchy[formData.mainCategory].subCategories[formData.subCategory].brands;
  };

  const getSubCategoryOptions = () => {
    if (!formData.mainCategory) return [];
    return Object.keys(productHierarchy[formData.mainCategory].subCategories);
  };

  const renderNestedAttributes = (attributes: Record<string, Attribute>, parentPath = "") => {
    return Object.entries(attributes).map(([key, attr]) => {
      const fullPath = parentPath ? `${parentPath}-${key}` : key;
      const parentValue = parentPath ? formData.attributes[parentPath] : null;
      
      // Skip if this attribute depends on a parent that hasn't been selected
      if (attr.dependsOn && !formData.attributes[attr.dependsOn]) {
        return null;
      }
  
      // Skip if this is a conditional attribute and the parent value doesn't match
      if (attr.dependsOn && formData.attributes[attr.dependsOn] !== key) {
        return null;
      }
  
      return (
        <div key={fullPath} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {attr.name}*
          </label>
          <select
            name={`attr-${fullPath}`}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#62aee4] focus:border-transparent"
            onChange={handleInputChange}
            value={formData.attributes[fullPath] || ""}
            required
            disabled={isSubmitting}
          >
            <option value="">Select {attr.name}</option>
            {attr.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
  
          
          {attr.nestedAttributes && formData.attributes[fullPath] && (
            <div className="ml-4 mt-2 pl-4 border-l-2 border-gray-200">
              {renderNestedAttributes(attr.nestedAttributes, fullPath)}
            </div>
          )}
        </div>
      );
    });
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
        
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#62aee4] focus:border-transparent"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                  <input
                    type="text"
                    name="designer"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#62aee4] focus:border-transparent"
                    value={formData.designer}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Main Category*</label>
                  <select
                    name="mainCategory"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#62aee4] focus:border-transparent"
                    onChange={handleInputChange}
                    value={formData.mainCategory}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Main Category</option>
                    {Object.keys(productHierarchy).map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category*</label>
                  <select
                    name="subCategory"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#62aee4] focus:border-transparent"
                    onChange={handleInputChange}
                    value={formData.subCategory}
                    required
                    disabled={!formData.mainCategory || isSubmitting}
                  >
                    <option value="">Select Sub Category</option>
                    {getSubCategoryOptions().map(subCategory => (
                      <option key={subCategory} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand*</label>
                  <select
                    name="brand"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#62aee4] focus:border-transparent"
                    onChange={handleInputChange}
                    value={formData.brand}
                    required
                    disabled={!formData.subCategory || isSubmitting}
                  >
                    <option value="">Select Brand</option>
                    {getBrandOptions().map(brand => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity*</label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#62aee4] focus:border-transparent"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)*</label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#62aee4] focus:border-transparent"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {formData.brand && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderNestedAttributes(getCurrentAttributes())}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Images</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#62aee4] transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                  disabled={isSubmitting}
                />
                <label 
                  htmlFor="imageUpload" 
                  className={`cursor-pointer flex flex-col items-center ${isSubmitting ? 'opacity-50' : ''}`}
                >
                  <div className="mb-2 text-[#62aee4]">
                    <Plus size={24} />
                  </div>
                  <p className="text-sm text-gray-600">Drag and drop images here</p>
                  <p className="text-xs text-gray-500 mt-1">or click to browse (max 5 images)</p>
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        className="w-full h-32 object-cover rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        disabled={isSubmitting}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>


            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#62aee4] hover:bg-[#4287b8] text-black font-bold rounded-lg transition-colors disabled:opacity-50"
                disabled={isSubmitting || !formData.brand}
              >
                {isSubmitting ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
*/

"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Plus, Trash, X } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: any) => void;
}

interface DetailItem {
  name: string;
  value: string;
}

interface SpecificationItem {
  name: string;
  value: string;
}

interface ProductFormData {
  mainCategory: string;
  subCategory: string;
  details: DetailItem[];
  specifications: SpecificationItem[];
  batchNumber: string;
  netContent: string;
  notes: string;
  certifications: string[];
  images: File[];
}

const productHierarchy = {
  "Lab & Chemicals": {
    subCategories: {
      "Basic Chemicals": {},
      "Lab Equipment": {},
      "Solvents": {},
      "Reagents": {},
      "Analytical Standards": {},
    },
  },
  "Pharmaceuticals": {
    subCategories: {
      "Active Ingredients": {},
      "Excipients": {},
      "Formulations": {},
    },
  },
};

export const ProductModal = ({ isOpen, onClose, onAddProduct }: ProductModalProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    mainCategory: "",
    subCategory: "",
    details: [{ name: "", value: "" }],
    specifications: [{ name: "", value: "" }],
    batchNumber: "",
    netContent: "",
    notes: "",
    certifications: [],
    images: [],
  });

  const [newCertification, setNewCertification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDetailChange = (index: number, field: 'name' | 'value', value: string) => {
    const updatedDetails = [...formData.details];
    updatedDetails[index][field] = value;
    setFormData(prev => ({
      ...prev,
      details: updatedDetails,
    }));
  };

  const addDetailField = () => {
    setFormData(prev => ({
      ...prev,
      details: [...prev.details, { name: "", value: "" }],
    }));
  };

  const removeDetailField = (index: number) => {
    const updatedDetails = [...formData.details];
    updatedDetails.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      details: updatedDetails,
    }));
  };

  const handleSpecificationChange = (index: number, field: 'name' | 'value', value: string) => {
    const updatedSpecifications = [...formData.specifications];
    updatedSpecifications[index][field] = value;
    setFormData(prev => ({
      ...prev,
      specifications: updatedSpecifications,
    }));
  };

  const addSpecificationField = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { name: "", value: "" }],
    }));
  };

  const removeSpecificationField = (index: number) => {
    const updatedSpecifications = [...formData.specifications];
    updatedSpecifications.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      specifications: updatedSpecifications,
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification)) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification],
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      certifications: updatedCertifications,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files].slice(0, 5),
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('mainCategory', formData.mainCategory);
      formDataToSend.append('subCategory', formData.subCategory);
      formDataToSend.append('details', JSON.stringify(formData.details.filter(d => d.name && d.value)));
      formDataToSend.append('specifications', JSON.stringify(formData.specifications.filter(s => s.name && s.value)));
      formDataToSend.append('batchNumber', formData.batchNumber);
      formDataToSend.append('netContent', formData.netContent);
      formDataToSend.append('notes', formData.notes);
      formDataToSend.append('certifications', JSON.stringify(formData.certifications));
      
      // Append each image file
      formData.images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });
  
      const response = await fetch('https://malexbackend.onrender.com/api/products', {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit product');
      }
  
      const result = await response.json();
      
      // Call the onAddProduct callback with the new product
      onAddProduct(result.product);
      onClose();
      
      // Reset form
      setFormData({
        mainCategory: "",
        subCategory: "",
        details: [{ name: "", value: "" }],
        specifications: [{ name: "", value: "" }],
        batchNumber: "",
        netContent: "",
        notes: "",
        certifications: [],
        images: [],
      });
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('Error submitting product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubCategoryOptions = () => {
    if (!formData.mainCategory) return [];
    return Object.keys(productHierarchy[formData.mainCategory as keyof typeof productHierarchy].subCategories);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Chemical Product</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Category Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Main Category*</label>
                  <select
                    name="mainCategory"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={handleInputChange}
                    value={formData.mainCategory}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select Main Category</option>
                    {Object.keys(productHierarchy).map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category*</label>
                  <select
                    name="subCategory"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={handleInputChange}
                    value={formData.subCategory}
                    required
                    disabled={!formData.mainCategory || isSubmitting}
                  >
                    <option value="">Select Sub Category</option>
                    {getSubCategoryOptions().map(subCategory => (
                      <option key={subCategory} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Details</h3>
              <div className="space-y-3">
                {formData.details.map((detail, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Detail Name</label>
                      <input
                        type="text"
                        value={detail.name}
                        onChange={(e) => handleDetailChange(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Chemical Name, CAS Number"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                      <input
                        type="text"
                        value={detail.value}
                        onChange={(e) => handleDetailChange(index, 'value', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter value"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeDetailField(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                        disabled={isSubmitting || formData.details.length === 1}
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDetailField}
                  className="flex items-center text-sm text-blue-500 hover:text-blue-700 mt-2"
                  disabled={isSubmitting}
                >
                  <Plus size={16} className="mr-1" /> Add Detail Field
                </button>
              </div>
            </div>

            {/* Specifications Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Technical Specifications</h3>
              <div className="space-y-3">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specification Name</label>
                      <input
                        type="text"
                        value={spec.name}
                        onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Purity, pH Range"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter value"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeSpecificationField(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                        disabled={isSubmitting || formData.specifications.length === 1}
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpecificationField}
                  className="flex items-center text-sm text-blue-500 hover:text-blue-700 mt-2"
                  disabled={isSubmitting}
                >
                  <Plus size={16} className="mr-1" /> Add Specification Field
                </button>
              </div>
            </div>

            {/* Batch and Content Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Batch Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number*</label>
                  <input
                    type="text"
                    name="batchNumber"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.batchNumber}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Net Content*</label>
                  <input
                    type="text"
                    name="netContent"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.netContent}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    placeholder="e.g., 500ml, 1kg"
                  />
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Notes</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.notes}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="Enter any additional notes or handling instructions"
                />
              </div>
            </div>

            {/* Certifications Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Certifications</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add certification (e.g., ISO 9001, GMP)"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={addCertification}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    disabled={isSubmitting || !newCertification.trim()}
                  >
                    Add
                  </button>
                </div>
                {formData.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-sm">{cert}</span>
                        <button
                          type="button"
                          onClick={() => removeCertification(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                          disabled={isSubmitting}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Images</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                  disabled={isSubmitting}
                />
                <label 
                  htmlFor="imageUpload" 
                  className={`cursor-pointer flex flex-col items-center ${isSubmitting ? 'opacity-50' : ''}`}
                >
                  <div className="mb-2 text-blue-500">
                    <Plus size={24} />
                  </div>
                  <p className="text-sm text-gray-600">Drag and drop images here</p>
                  <p className="text-xs text-gray-500 mt-1">or click to browse (max 5 images)</p>
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        className="w-full h-32 object-cover rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        disabled={isSubmitting}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                disabled={isSubmitting || !formData.mainCategory || !formData.subCategory || !formData.batchNumber || !formData.netContent}
              >
                {isSubmitting ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
