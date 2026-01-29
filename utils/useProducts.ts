/*import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

interface Product {
  _id: string;
  name: string;
  designer: string;
  category: {
    main: string;
    sub: string;
    brand: string;
  };
  price: number;
  stock: number;
  images: string[];
  attributes: Record<string, string>;
  createdAt: string;
}

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
  
      console.log('Fetching products from:', 'http://localhost:5000/api/products');


    const response = await fetch('http://localhost:5000/api/products');

      const data = await response.json();

 
  
      console.log('Response received:', data);
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }
  
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { 
    products, 
    loading, 
    error,
    refresh: fetchProducts 
  };
};

export default useProducts;*/

import { useState, useEffect } from 'react';

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

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://malexbackend.onrender.com/api/products');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }

      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { 
    products, 
    loading, 
    error,
    refresh: fetchProducts 
  };
};

export default useProducts;