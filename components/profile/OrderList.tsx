"use client";

import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: number;
  name: string;
  designer: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  status: "Delivered" | "Shipped" | "Processing";
  items: OrderItem[];
  total: number;
  trackingNumber: string;
}

interface OrderListProps {
  orders: Order[];
 // onStartShopping: () => void;
}


export const OrderList = ({ orders }: OrderListProps) => {
  const router = useRouter();

  const handleStartShopping = () => {
    router.push("/collections");
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-500 mb-6">
          Your orders will appear here once you make a purchase
        </p>
        <button
          onClick={handleStartShopping}
          className="px-6 py-3 bg-[#f4b500] hover:bg-[#d4a017] text-black font-bold rounded-full transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

const OrderCard = ({ order }: { order: Order }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <div>
        <p className="font-medium text-gray-900">Order #{order.id}</p>
        <p className="text-sm text-gray-500">Placed on {order.date}</p>
      </div>
      <div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            order.status === "Delivered"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {order.status}
        </span>
      </div>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        {order.items.map((item) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </div>
      <OrderSummary
        trackingNumber={order.trackingNumber}
        total={order.total}
      />
    </div>
  </div>
);

const OrderItem = ({ item }: { item: OrderItem }) => (
  <div className="flex gap-4">
    <Image
      src={item.image}
      alt={item.name}
      width={80}
      height={80}
      className="w-20 h-20 object-cover rounded"
    />
    <div className="flex-1">
      <p className="font-medium text-gray-900">{item.name}</p>
      <p className="text-sm text-gray-500">{item.designer}</p>
      <p className="text-sm text-gray-900">
        ${item.price.toLocaleString()} x {item.quantity}
      </p>
    </div>
  </div>
);

const OrderSummary = ({
  trackingNumber,
  total,
}: {
  trackingNumber: string;
  total: number;
}) => (
  <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
    <div>
      <p className="text-sm text-gray-500">Tracking number</p>
      <p className="font-medium text-gray-900">{trackingNumber}</p>
    </div>
    <div className="text-right">
      <p className="text-sm text-gray-500">Total</p>
      <p className="font-bold text-gray-900">${total.toLocaleString()}</p>
    </div>
  </div>
);