import React, { useEffect, useState } from "react";

// Product interface
interface IProduct {
  _id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  stock: number;
  sku?: string;
  attributes?: Record<string, object>;
  metadata?: Record<string, object>;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || "";

  const DEFAULT_IMAGE = "https://ui-avatars.com/api/?name=Product&background=ddd&color=555&size=300";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`); // <-- your backend route
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center p-6">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-6">{error}</div>;
  }

  return (
    <div className="p-6 mb-40">
      
      {products.length === 0 ? (
        <div className="text-gray-500">No products found.</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-2xl shadow hover:shadow-lg transition bg-white"
            >
              <img
              src={product.imageUrl || DEFAULT_IMAGE}
              alt={product.title}
              className="w-full h-40 object-cover rounded-t-xl"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE;
              }}
            />

              <div className="p-4">
                <h2 className="font-semibold text-lg">{product.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                <p className="font-bold text-blue-600">
                  {product.currency} {(product.price / 100).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Stock: {product.stock > 0 ? product.stock : "Out of stock"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;
