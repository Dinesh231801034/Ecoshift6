// import { useState, useEffect } from 'react';
// import { X, Upload, Package, DollarSign, Hash, Tag, Image as ImageIcon } from 'lucide-react';

// const ProductModal = ({ isOpen, onClose, product, onSave, isEditing = false }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     category: '',
//     subcategory: '',
//     price: '',
//     original_price: '',
//     sku: '',
//     brand: '',
//     tags: '',
//     stock_quantity: '',
//     min_order_quantity: '1',
//     max_order_quantity: '100',
//     weight: '',
//     dimensions: '',
//     shipping_available: true,
//     free_shipping_threshold: '',
//     is_active: true,
//     is_featured: false,
//     is_eco_friendly: true,
//     eco_certifications: '',
//     specifications: {}
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (isEditing && product) {
//       setFormData({
//         name: product.name || '',
//         description: product.description || '',
//         category: product.category || '',
//         subcategory: product.subcategory || '',
//         price: product.price || '',
//         original_price: product.original_price || '',
//         sku: product.sku || '',
//         brand: product.brand || '',
//         tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
//         stock_quantity: product.stock_quantity || '',
//         min_order_quantity: product.min_order_quantity || '1',
//         max_order_quantity: product.max_order_quantity || '100',
//         weight: product.weight || '',
//         dimensions: product.dimensions || '',
//         shipping_available: product.shipping_available !== false,
//         free_shipping_threshold: product.free_shipping_threshold || '',
//         is_active: product.is_active !== false,
//         is_featured: product.is_featured || false,
//         is_eco_friendly: product.is_eco_friendly !== false,
//         eco_certifications: Array.isArray(product.eco_certifications) ? product.eco_certifications.join(', ') : '',
//         specifications: product.specifications || {}
//       });
//     } else {
//       // Reset form for new product
//       setFormData({
//         name: '',
//         description: '',
//         category: '',
//         subcategory: '',
//         price: '',
//         original_price: '',
//         sku: '',
//         brand: '',
//         tags: '',
//         stock_quantity: '',
//         min_order_quantity: '1',
//         max_order_quantity: '100',
//         weight: '',
//         dimensions: '',
//         shipping_available: true,
//         free_shipping_threshold: '',
//         is_active: true,
//         is_featured: false,
//         is_eco_friendly: true,
//         eco_certifications: '',
//         specifications: {}
//       });
//     }
//   }, [isEditing, product]);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('access_token');
      
//       // Prepare data for API
//       const apiData = {
//         ...formData,
//         tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
//         eco_certifications: formData.eco_certifications ? formData.eco_certifications.split(',').map(cert => cert.trim()) : [],
//         price: parseFloat(formData.price),
//         original_price: formData.original_price ? parseFloat(formData.original_price) : null,
//         stock_quantity: parseInt(formData.stock_quantity),
//         min_order_quantity: parseInt(formData.min_order_quantity),
//         max_order_quantity: parseInt(formData.max_order_quantity),
//         weight: formData.weight ? parseFloat(formData.weight) : null,
//         free_shipping_threshold: formData.free_shipping_threshold ? parseFloat(formData.free_shipping_threshold) : null,
//       };

//       const url = isEditing 
//         ? `http://127.0.0.1:8000/api/merchants/products/${product.id}/`
//         : 'http://127.0.0.1:8000/api/merchants/products/';
      
//       const method = isEditing ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(apiData),
//       });

//       if (response.ok) {
//         onSave();
//         onClose();
//       } else {
//         const errorData = await response.json();
//         setError(errorData.detail || 'Failed to save product');
//       }
//     } catch (err) {
//       setError('Network error. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <h2 className="text-2xl font-bold text-gray-900">
//               {isEditing ? 'Edit Product' : 'Add New Product'}
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <X size={24} />
//             </button>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6">
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
//               {error}
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Basic Information */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                 <Package className="mr-2" size={20} />
//                 Basic Information
//               </h3>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   placeholder="Enter product name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description *
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   required
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   placeholder="Enter product description"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category *
//                   </label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   >
//                     <option value="">Select Category</option>
//                     <option value="Personal Care">Personal Care</option>
//                     <option value="Kitchen & Dining">Kitchen & Dining</option>
//                     <option value="Fashion & Accessories">Fashion & Accessories</option>
//                     <option value="Electronics">Electronics</option>
//                     <option value="Home & Garden">Home & Garden</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Subcategory
//                   </label>
//                   <input
//                     type="text"
//                     name="subcategory"
//                     value={formData.subcategory}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="Enter subcategory"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Brand *
//                 </label>
//                 <input
//                   type="text"
//                   name="brand"
//                   value={formData.brand}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   placeholder="Enter brand name"
//                 />
//               </div>
//             </div>

//             {/* Pricing & Inventory */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                 <DollarSign className="mr-2" size={20} />
//                 Pricing & Inventory
//               </h3>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Price (₹) *
//                   </label>
//                   <input
//                     type="number"
//                     name="price"
//                     value={formData.price}
//                     onChange={handleInputChange}
//                     required
//                     step="0.01"
//                     min="0"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="0.00"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Original Price (₹)
//                   </label>
//                   <input
//                     type="number"
//                     name="original_price"
//                     value={formData.original_price}
//                     onChange={handleInputChange}
//                     step="0.01"
//                     min="0"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="0.00"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   SKU *
//                 </label>
//                 <input
//                   type="text"
//                   name="sku"
//                   value={formData.sku}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   placeholder="Enter SKU"
//                 />
//               </div>

//               <div className="grid grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Stock Quantity *
//                   </label>
//                   <input
//                     type="number"
//                     name="stock_quantity"
//                     value={formData.stock_quantity}
//                     onChange={handleInputChange}
//                     required
//                     min="0"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="0"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Min Order
//                   </label>
//                   <input
//                     type="number"
//                     name="min_order_quantity"
//                     value={formData.min_order_quantity}
//                     onChange={handleInputChange}
//                     min="1"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="1"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Max Order
//                   </label>
//                   <input
//                     type="number"
//                     name="max_order_quantity"
//                     value={formData.max_order_quantity}
//                     onChange={handleInputChange}
//                     min="1"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     placeholder="100"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Tags
//                 </label>
//                 <input
//                   type="text"
//                   name="tags"
//                   value={formData.tags}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   placeholder="Enter tags separated by commas"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Eco-friendly Settings */}
//           <div className="mt-6 p-4 bg-green-50 rounded-lg">
//             <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
//               <Tag className="mr-2" size={20} />
//               Eco-friendly Settings
//             </h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="is_eco_friendly"
//                   checked={formData.is_eco_friendly}
//                   onChange={handleInputChange}
//                   className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//                 />
//                 <label className="ml-2 text-sm text-gray-700">
//                   Eco-friendly Product
//                 </label>
//               </div>
              
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="is_featured"
//                   checked={formData.is_featured}
//                   onChange={handleInputChange}
//                   className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//                 />
//                 <label className="ml-2 text-sm text-gray-700">
//                   Featured Product
//                 </label>
//               </div>
//             </div>

//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Eco Certifications
//               </label>
//               <input
//                 type="text"
//                 name="eco_certifications"
//                 value={formData.eco_certifications}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 placeholder="Enter certifications separated by commas"
//               />
//             </div>
//           </div>

//           {/* Status Settings */}
//           <div className="mt-6 flex items-center space-x-6">
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="is_active"
//                 checked={formData.is_active}
//                 onChange={handleInputChange}
//                 className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//               />
//               <label className="ml-2 text-sm text-gray-700">
//                 Active Product
//               </label>
//             </div>
            
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="shipping_available"
//                 checked={formData.shipping_available}
//                 onChange={handleInputChange}
//                 className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//               />
//               <label className="ml-2 text-sm text-gray-700">
//                 Shipping Available
//               </label>
//             </div>
//           </div>

//           {/* Submit Buttons */}
//           <div className="mt-8 flex justify-end space-x-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg flex items-center space-x-2"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   <span>Saving...</span>
//                 </>
//               ) : (
//                 <span>{isEditing ? 'Update Product' : 'Create Product'}</span>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProductModal;







import React, { useState, useEffect } from "react";

  const API_BASE = import.meta.env?.VITE_API_BASE || window.__API_BASE__ || 'http://127.0.0.1:5000';

export default function ProductModal({ isOpen, onClose, product, onSave, isEditing: externalIsEditing }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    sku: "",
    category: "",
    subcategory: "",
    brand: "",
    primary_image: null,
  });

  const [isEditing, setIsEditing] = useState(!!externalIsEditing);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock_quantity: product.stock_quantity || "",
        sku: product.sku || "",
        category: product.category || "",
        subcategory: product.subcategory || "",
        brand: product.brand || "",
        primary_image: null,
      });
      setIsEditing(true);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        sku: "",
        category: "",
        subcategory: "",
        brand: "",
        primary_image: null,
      });
      setIsEditing(!!externalIsEditing);
    }
  }, [product, isOpen, externalIsEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      const form = new FormData();
      // Required fields
      form.append('name', formData.name);
      form.append('description', formData.description);
      if (formData.category) form.append('category', formData.category);
      if (formData.subcategory) form.append('subcategory', formData.subcategory);
      if (formData.brand) form.append('brand', formData.brand);
      form.append('sku', formData.sku);
      form.append('price', String(parseFloat(formData.price || '0')));
      form.append('stock_quantity', String(parseInt(formData.stock_quantity || '0', 10)));
      if (formData.primary_image) form.append('primary_image', formData.primary_image);

      const url = isEditing
  ? `${API_BASE}/api/merchants/products/${product.id}/`
  : `${API_BASE}/api/merchants/products/`;

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const firstKey = errorData && typeof errorData === 'object' ? Object.keys(errorData)[0] : null;
        const firstVal = firstKey ? errorData[firstKey] : null;
        const msg = typeof firstVal === 'string' ? firstVal : Array.isArray(firstVal) ? firstVal.join(', ') : null;
        setError(errorData.detail || errorData.error || msg || "Failed to save product");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-4">
          <h2 className="text-white font-semibold">
            {isEditing ? "Edit Product" : "Add Product"}
          </h2>
        </div>
        {error && <div className="m-4 bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full border rounded px-2 py-1"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border rounded px-2 py-1"
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full border rounded px-2 py-1"
          />
          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            className="w-full border rounded px-2 py-1"
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full border rounded px-2 py-1"
          />
          <input
            type="text"
            placeholder="Brand"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            className="w-full border rounded px-2 py-1"
          />

          {/* Image Uploads */}
          <label className="block text-sm font-medium text-gray-700">
            Primary Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, primary_image: e.target.files[0] })
            }
          />

          <label className="block text-sm font-medium text-gray-700">
            Additional Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setFormData({ ...formData, additional_images: e.target.files })
            }
          />

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-60">
              {isLoading ? "Saving..." : isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



