"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, Sliders } from "lucide-react";
import NavbarTwo from "@/components/HeaderTwo";
import LuxuryFooter from "@/components/LuxuryFooter";
import useProducts from "@/utils/useProducts";
import ProductCard from "@/components/product/ProductCard";
import ProductDetailModal from "@/components/product/ProductDetailModal";

interface DetailItem {
  name: string;
  value: string;
  _id: string;
}

interface SpecificationItem {
  name: string;
  value: string;
  _id: string;
}

interface Product {
  _id: string;
  mainCategory: string;
  subCategory: string;
  details: DetailItem[];
  specifications: SpecificationItem[];
  batchNumber: string;
  netContent: string;
  notes: string;
  certifications: string[];
  images: string[];
  createdAt: string;
}

const CollectionsPage = () => {
  const { products, loading, error } = useProducts();

  // Transform the API products to match our frontend format
  /*const transformedProducts = products.map((product) => {
    const nameDetail = product.details.find(d => d.name === "Name") || product.details[0];
    return {
      id: product._id,
      name: nameDetail?.value || "Chemical Product",
      mainCategory: product.mainCategory,
      subCategory: product.subCategory,
      batchNumber: product.batchNumber,
      netContent: product.netContent,
      certifications: product.certifications,
      images: product.images,
      createdAt: product.createdAt,
      isNew: new Date(product.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000,
    }
  });*/
  const transformedProducts = products.map((product) => {
  const nameDetail = product.details?.find(d => d.name === "Name") || product.details?.[0];
  const name = nameDetail?.value || "Chemical Product";

  return {
    id: product._id,
    name,
    mainCategory: product.mainCategory || "Unknown",
    subCategory: product.subCategory || "Unknown",
    batchNumber: product.batchNumber || "",
    netContent: product.netContent || "",
    certifications: product.certifications || [],
    images: product.images || [],
    createdAt: product.createdAt,
    isNew: new Date(product.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000,
  };
});


  // Extract unique categories, subcategories, and certifications for filters
  const mainCategories = [...new Set(transformedProducts.map(item => item.mainCategory))];
  const subCategories = [...new Set(transformedProducts.map(item => item.subCategory))];
  const certifications = [...new Set(transformedProducts.flatMap(item => item.certifications))];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMainCategories, setSelectedMainCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState("All Products");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products based on search and filters
  const filteredProducts = transformedProducts.filter((product) => {
    // Search query
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.mainCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Main category filter
    const matchesMainCategory = selectedMainCategories.length === 0 || 
                              selectedMainCategories.includes(product.mainCategory);
    
    // Sub category filter
    const matchesSubCategory = selectedSubCategories.length === 0 || 
                             selectedSubCategories.includes(product.subCategory);
    
    // Certification filter
    const matchesCertifications = selectedCertifications.length === 0 || 
                                product.certifications.some(cert => selectedCertifications.includes(cert));
    
    // Collection theme filter
    const matchesCollection = activeCollection === "All Products" || 
                            (activeCollection === "New Formulations" && product.isNew) ||
                            (activeCollection === "Top Sellers" && product.certifications.includes("ISO Certified"));

    return matchesSearch && matchesMainCategory && matchesSubCategory && 
           matchesCertifications && matchesCollection;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Toggle filters
  const toggleFilter = (filter: string, filterType: string) => {
    switch (filterType) {
      case "mainCategory":
        setSelectedMainCategories(prev =>
          prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
        break;
      case "subCategory":
        setSelectedSubCategories(prev =>
          prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
        break;
      case "certification":
        setSelectedCertifications(prev =>
          prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
        break;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedMainCategories([]);
    setSelectedSubCategories([]);
    setSelectedCertifications([]);
    setSearchQuery("");
    setSortOption("newest");
    setActiveCollection("All Products");
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <NavbarTwo />
        <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="animate-pulse h-8 w-32 bg-gray-200 rounded-full mx-auto"></div>
          <div className="animate-pulse h-12 w-64 bg-gray-200 rounded-full mx-auto mt-6"></div>
          <div className="animate-pulse h-4 w-96 bg-gray-200 rounded-full mx-auto mt-4"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-xl h-[500px] animate-pulse"></div>
            ))}
          </div>
        </main>
        <LuxuryFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <NavbarTwo />
        <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-red-500">{error}</div>
        </main>
        <LuxuryFooter />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <NavbarTwo />
      
      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82cee4] to-[#62aee4]">
              Chemical Products Collection
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            High-quality laboratory chemicals, reagents, and equipment for your scientific needs
          </p>
        </motion.section>

        {/* Collection Themes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 overflow-x-auto"
        >
          <div className="flex space-x-4 pb-2">
            {[
              "All Products",
              "New Formulations",
              "Top Sellers",
              "Laboratory Essentials",
              "Industrial Chemicals",
              "Specialty Compounds",
            ].map((theme) => (
              <motion.button
                key={theme}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCollection(theme)}
                className={`px-6 py-3 rounded-full whitespace-nowrap ${activeCollection === theme ? "bg-[#82cee4] text-black font-bold" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
              >
                {theme}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search chemicals, categories, batch numbers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#82cee4] focus:border-[#82cee4]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Sort and Filter Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#82cee4] focus:border-[#82cee4]"
                >
                  <option value="newest">Newest First</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-full shadow-sm hover:bg-gray-50"
              >
                <Sliders className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden md:block w-64 flex-shrink-0"
          >
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-32">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#82cee4] hover:text-[#62aee4]"
                >
                  Clear all
                </button>
              </div>

              {/* Main Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Main Category</h4>
                <div className="space-y-2">
                  {mainCategories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        id={`category-${category}`}
                        type="checkbox"
                        checked={selectedMainCategories.includes(category)}
                        onChange={() => toggleFilter(category, "mainCategory")}
                        className="h-4 w-4 rounded border-gray-300 text-[#82cee4] focus:ring-[#82cee4]"
                      />
                      <label htmlFor={`category-${category}`} className="ml-3 text-sm text-gray-600">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Sub Category</h4>
                <div className="space-y-2">
                  {subCategories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        id={`subcategory-${category}`}
                        type="checkbox"
                        checked={selectedSubCategories.includes(category)}
                        onChange={() => toggleFilter(category, "subCategory")}
                        className="h-4 w-4 rounded border-gray-300 text-[#82cee4] focus:ring-[#82cee4]"
                      />
                      <label htmlFor={`subcategory-${category}`} className="ml-3 text-sm text-gray-600">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certification Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Certifications</h4>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert} className="flex items-center">
                      <input
                        id={`certification-${cert}`}
                        type="checkbox"
                        checked={selectedCertifications.includes(cert)}
                        onChange={() => toggleFilter(cert, "certification")}
                        className="h-4 w-4 rounded border-gray-300 text-[#82cee4] focus:ring-[#82cee4]"
                      />
                      <label htmlFor={`certification-${cert}`} className="ml-3 text-sm text-gray-600">
                        {cert}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Product Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex-1"
          >
            {/* Results Count */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing <span className="font-bold">{filteredProducts.length}</span> {filteredProducts.length === 1 ? "product" : "products"}
              </p>
              {selectedMainCategories.length > 0 || selectedSubCategories.length > 0 || 
               selectedCertifications.length > 0 ? (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#82cee4] hover:text-[#62aee4] flex items-center gap-1"
                >
                  <X size={14} /> Clear filters
                </button>
              ) : null}
            </div>

            {/* Products */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      mainCategory: product.mainCategory,
                      subCategory: product.subCategory,
                      details: products.find(p => p._id === product.id)?.details || [],
                      specifications: products.find(p => p._id === product.id)?.specifications || [],
                      batchNumber: product.batchNumber,
                      netContent: product.netContent,
                      notes: products.find(p => p._id === product.id)?.notes || "",
                      certifications: product.certifications,
                      images: product.images,
                      createdAt: product.createdAt
                    }}
                    onQuickView={() => {
                      const fullProduct = products.find(p => p._id === product.id);
                      if (fullProduct) setSelectedProduct(fullProduct);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-[#82cee4] hover:bg-[#62aee4] text-black font-bold rounded-full transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Mobile Filters */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-white p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Main Category Filter */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900">Main Category</h4>
                  <ChevronDown size={18} />
                </div>
                <div className="space-y-2">
                  {mainCategories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        id={`mobile-category-${category}`}
                        type="checkbox"
                        checked={selectedMainCategories.includes(category)}
                        onChange={() => toggleFilter(category, "mainCategory")}
                        className="h-4 w-4 rounded border-gray-300 text-[#82cee4] focus:ring-[#82cee4]"
                      />
                      <label htmlFor={`mobile-category-${category}`} className="ml-3 text-sm text-gray-600">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub Category Filter */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900">Sub Category</h4>
                  <ChevronDown size={18} />
                </div>
                <div className="space-y-2">
                  {subCategories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        id={`mobile-subcategory-${category}`}
                        type="checkbox"
                        checked={selectedSubCategories.includes(category)}
                        onChange={() => toggleFilter(category, "subCategory")}
                        className="h-4 w-4 rounded border-gray-300 text-[#82cee4] focus:ring-[#82cee4]"
                      />
                      <label htmlFor={`mobile-subcategory-${category}`} className="ml-3 text-sm text-gray-600">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certification Filter */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900">Certifications</h4>
                  <ChevronDown size={18} />
                </div>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert} className="flex items-center">
                      <input
                        id={`mobile-certification-${cert}`}
                        type="checkbox"
                        checked={selectedCertifications.includes(cert)}
                        onChange={() => toggleFilter(cert, "certification")}
                        className="h-4 w-4 rounded border-gray-300 text-[#82cee4] focus:ring-[#82cee4]"
                      />
                      <label htmlFor={`mobile-certification-${cert}`} className="ml-3 text-sm text-gray-600">
                        {cert}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-[#82cee4] hover:bg-[#62aee4] text-black font-bold py-3 rounded-full"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        )}
        {selectedProduct && (
          <ProductDetailModal 
            product={{
              ...selectedProduct,
              id: selectedProduct._id
            }}
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>
      <LuxuryFooter />
    </div>
  );
};

export default CollectionsPage;

/*"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, Sliders } from "lucide-react";
import NavbarTwo from "@/components/HeaderTwo";
import LuxuryFooter from "@/components/LuxuryFooter";
import useProducts from "@/utils/useProducts";
import ProductCard from "@/components/product/ProductCard";
import ProductDetailModal from "@/components/product/ProductDetailModal";

interface DetailItem {
  name: string;
  value: string;
  _id: string;
}

interface SpecificationItem {
  name: string;
  value: string;
  _id: string;
}

interface Product {
  _id: string;
  mainCategory: string;
  subCategory: string;
  details: DetailItem[];
  specifications: SpecificationItem[];
  batchNumber: string;
  netContent: string;
  notes: string;
  certifications: string[];
  images: string[];
  createdAt: string;
}

const CollectionsPage = () => {
  const { products, loading, error } = useProducts();

  // Transform the API products to match our frontend format
  const transformedProducts = products.map((product) => {
    const nameDetail = product.details.find(d => d.name === "Name") || product.details[0];
    return {
      id: product._id,
      name: nameDetail?.value || "Chemical Product",
      mainCategory: product.mainCategory,
      subCategory: product.subCategory,
      batchNumber: product.batchNumber,
      netContent: product.netContent,
      certifications: product.certifications,
      images: product.images,
      createdAt: product.createdAt,
      isNew: new Date(product.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000,
    }
  });

  // Extract unique categories, subcategories, and certifications for filters
  const mainCategories = [...new Set(transformedProducts.map(item => item.mainCategory))];
  const subCategories = [...new Set(transformedProducts.map(item => item.subCategory))];
  const certifications = [...new Set(transformedProducts.flatMap(item => item.certifications))];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMainCategories, setSelectedMainCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState("All Products");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products based on search and filters
  const filteredProducts = transformedProducts.filter((product) => {
    // Search query
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.mainCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Main category filter
    const matchesMainCategory = selectedMainCategories.length === 0 || 
                              selectedMainCategories.includes(product.mainCategory);
    
    // Sub category filter
    const matchesSubCategory = selectedSubCategories.length === 0 || 
                             selectedSubCategories.includes(product.subCategory);
    
    // Certification filter
    const matchesCertifications = selectedCertifications.length === 0 || 
                                product.certifications.some(cert => selectedCertifications.includes(cert));
    
    // Collection theme filter
    const matchesCollection = activeCollection === "All Products" || 
                            (activeCollection === "New Formulations" && product.isNew) ||
                            (activeCollection === "Top Sellers" && product.certifications.includes("ISO Certified"));

    return matchesSearch && matchesMainCategory && matchesSubCategory && 
           matchesCertifications && matchesCollection;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Toggle filters
  const toggleFilter = (filter: string, filterType: string) => {
    switch (filterType) {
      case "mainCategory":
        setSelectedMainCategories(prev =>
          prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
        break;
      case "subCategory":
        setSelectedSubCategories(prev =>
          prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
        break;
      case "certification":
        setSelectedCertifications(prev =>
          prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
        break;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedMainCategories([]);
    setSelectedSubCategories([]);
    setSelectedCertifications([]);
    setSearchQuery("");
    setSortOption("newest");
    setActiveCollection("All Products");
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <NavbarTwo />
        <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="animate-pulse h-8 w-32 bg-gray-200 rounded-full mx-auto"></div>
          <div className="animate-pulse h-12 w-64 bg-gray-200 rounded-full mx-auto mt-6"></div>
          <div className="animate-pulse h-4 w-96 bg-gray-200 rounded-full mx-auto mt-4"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-xl h-[500px] animate-pulse"></div>
            ))}
          </div>
        </main>
        <LuxuryFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <NavbarTwo />
        <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-red-500">{error}</div>
        </main>
        <LuxuryFooter />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <NavbarTwo />
      
   
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82cee4] to-[#62aee4]">
              Chemical Products Collection
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            High-quality laboratory chemicals, reagents, and equipment for your scientific needs
          </p>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 overflow-x-auto"
        >
          <div className="flex space-x-4 pb-2">
            {[
              "All Products",
              "New Formulations",
              "Top Sellers",
              "Laboratory Essentials",
              "Industrial Chemicals",
              "Specialty Compounds",
            ].map((theme) => (
              <motion.button
                key={theme}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCollection(theme)}
                className={`px-6 py-3 rounded-full whitespace-nowrap ${activeCollection === theme ? "bg-[#82cee4] text-black font-bold" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
              >
                {theme}
              </motion.button>
            ))}
          </div>
        </motion.div>

  
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
     
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search chemicals, categories, batch numbers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#82cee4] focus:border-[#82cee4]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

     
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#82cee4] focus:border-[#82cee4]"
                >
                  <option value="newest">Newest First</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>

       
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-full shadow-sm hover:bg-gray-50"
              >
                <Sliders className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
    
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden md:block w-64 flex-shrink-0"
          >
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-32">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#82cee4] hover:text-[#62aee4]"
                >
                  Clear all
                </button>
              </div>

     
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Main Category</h4>
                <div className="space-y-2">
                  {mainCategories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        id={`category-${category}`}
                        type="checkbox"
                        checked={selectedMainCategories.includes(category)}
                        onChange={() => toggleFilter(category, "mainCategory")}
                        className="h-4 w-4 rounded border-gray-300 text-[#82cee4] focus:ring-[#82cee4]"
                      />
                      <label htmlFor={`category-${category}`} className="ml-3 text-sm text-gray-600">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Sub Category</h4>
                <div className="space-y-2">
                  {subCategories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        id={`subcategory-${category}`}
                        type="checkbox"
                        checked={selectedSubCategories.includes(category)}
                        onChange={() => toggleFilter(category, "subCategory")}
                        className="h-4 w-4 rounded border-gray-300 text-[#82cee4] focus:ring-[#82cee4]"
                      />
                      <label htmlFor={`subcategory-${category}`} className="ml-3 text-sm text-gray-600">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Certifications</h4>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert} className="flex items-center">
                      <input
                        id={`certification-${cert}`}
                        type="checkbox"
                        checked={selectedCertifications.includes(cert)}
                        onChange={() => toggleFilter(cert, "certification")}
                        className="h-4 w-4 rounded border-gray-300 text-[#82cee4] focus:ring-[#82cee4]"
                      />
                      <label htmlFor={`certification-${cert}`} className="ml-3 text-sm text-gray-600">
                        {cert}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

  
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex-1"
          >
     
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing <span className="font-bold">{filteredProducts.length}</span> {filteredProducts.length === 1 ? "product" : "products"}
              </p>
              {selectedMainCategories.length > 0 || selectedSubCategories.length > 0 || 
               selectedCertifications.length > 0 ? (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#82cee4] hover:text-[#62aee4] flex items-center gap-1"
                >
                  <X size={14} /> Clear filters
                </button>
              ) : null}
            </div>

     
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      mainCategory: product.mainCategory,
                      subCategory: product.subCategory,
                      details: products.find(p => p._id === product.id)?.details || [],
                      specifications: products.find(p => p._id === product.id)?.specifications || [],
                      batchNumber: product.batchNumber,
                      netContent: product.netContent,
                      notes: products.find(p => p._id === product.id)?.notes || "",
                      certifications: product.certifications,
                      images: product.images,
                      createdAt: product.createdAt
                    }}
                    onQuickView={() => {
                      const fullProduct = products.find(p => p._id === product.id);
                      if (fullProduct) setSelectedProduct(fullProduct);
                    }}
                    onAddToCart={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-[#82cee4] hover:bg-[#62aee4] text-black font-bold rounded-full transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-white p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-8">
     
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900">Main Category</h4>
                  <ChevronDown size={18} />
                </div>
                <div className="space-y-2">
                  {mainCategories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        id={`mobile-category-${category}`}
                        type="checkbox"
                        checked={selectedMainCategories.includes(category)}
                        onChange={() => toggleFilter(category, "mainCategory")}
                        className="h-4 w-4 rounded border-gray-300 text-[#82cee4] focus:ring-[#82cee4]"
                      />
                      <label htmlFor={`mobile-category-${category}`} className="ml-3 text-sm text-gray-600">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

         
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900">Sub Category</h4>
                  <ChevronDown size={18} />
                </div>
                <div className="space-y-2">
                  {subCategories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        id={`mobile-subcategory-${category}`}
                        type="checkbox"
                        checked={selectedSubCategories.includes(category)}
                        onChange={() => toggleFilter(category, "subCategory")}
                        className="h-4 w-4 rounded border-gray-300 text-[#82cee4] focus:ring-[#82cee4]"
                      />
                      <label htmlFor={`mobile-subcategory-${category}`} className="ml-3 text-sm text-gray-600">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

          
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900">Certifications</h4>
                  <ChevronDown size={18} />
                </div>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert} className="flex items-center">
                      <input
                        id={`mobile-certification-${cert}`}
                        type="checkbox"
                        checked={selectedCertifications.includes(cert)}
                        onChange={() => toggleFilter(cert, "certification")}
                        className="h-4 w-4 rounded border-gray-300 text-[#82cee4] focus:ring-[#82cee4]"
                      />
                      <label htmlFor={`mobile-certification-${cert}`} className="ml-3 text-sm text-gray-600">
                        {cert}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-[#82cee4] hover:bg-[#62aee4] text-black font-bold py-3 rounded-full"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        )}
        {selectedProduct && (
          <ProductDetailModal 
            product={{
              ...selectedProduct,
              id: selectedProduct._id
            }}
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>
      <LuxuryFooter />
    </div>
  );
};

export default CollectionsPage;*/


