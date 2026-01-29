"use client";

import { ShoppingBag, CreditCard } from "lucide-react";
import { ChangeEvent } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  billingStreet: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingCountry: string;
}

interface ProfileEditFormProps {
  formData: FormData;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ProfileEditForm = ({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
}: ProfileEditFormProps) => (
  <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.firstName}
            onChange={onInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#f4b500] focus:border-[#f4b500]"
            required
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastName}
            onChange={onInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#f4b500] focus:border-[#f4b500]"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#f4b500] focus:border-[#f4b500]"
            required
          />
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Addresses</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddressForm
          type="shipping"
          formData={formData}
          onInputChange={onInputChange}
          icon={<ShoppingBag size={16} />}
          label="Shipping Address"
        />
        <AddressForm
          type="billing"
          formData={formData}
          onInputChange={onInputChange}
          icon={<CreditCard size={16} />}
          label="Billing Address"
        />
      </div>
    </div>

    <div className="col-span-2 flex justify-end gap-4 mt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-100 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-6 py-2 bg-[#62aee4] hover:bg-[#4287b8] text-black font-bold rounded-full transition-colors"
      >
        Save Changes
      </button>
    </div>
  </form>
);

const AddressForm = ({
  type,
  formData,
  onInputChange,
  icon,
  label,
}: {
  type: "shipping" | "billing";
  formData: FormData;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
      {icon} {label}
    </h4>
    <div className="space-y-3">
      <div>
        <label htmlFor={`${type}Street`} className="block text-xs font-medium text-gray-500 mb-1">
          Street
        </label>
        <input
          type="text"
          id={`${type}Street`}
          name={`${type}Street`}
          value={formData[`${type}Street` as keyof FormData]}
          onChange={onInputChange}
          className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-[#f4b500] focus:border-[#f4b500]"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${type}City`} className="block text-xs font-medium text-gray-500 mb-1">
            City
          </label>
          <input
            type="text"
            id={`${type}City`}
            name={`${type}City`}
            value={formData[`${type}City` as keyof FormData]}
            onChange={onInputChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-[#f4b500] focus:border-[#f4b500]"
            required
          />
        </div>
        <div>
          <label htmlFor={`${type}State`} className="block text-xs font-medium text-gray-500 mb-1">
            State
          </label>
          <input
            type="text"
            id={`${type}State`}
            name={`${type}State`}
            value={formData[`${type}State` as keyof FormData]}
            onChange={onInputChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-[#f4b500] focus:border-[#f4b500]"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${type}Zip`} className="block text-xs font-medium text-gray-500 mb-1">
            ZIP Code
          </label>
          <input
            type="text"
            id={`${type}Zip`}
            name={`${type}Zip`}
            value={formData[`${type}Zip` as keyof FormData]}
            onChange={onInputChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-[#f4b500] focus:border-[#f4b500]"
            required
          />
        </div>
        <div>
          <label htmlFor={`${type}Country`} className="block text-xs font-medium text-gray-500 mb-1">
            Country
          </label>
          <input
            type="text"
            id={`${type}Country`}
            name={`${type}Country`}
            value={formData[`${type}Country` as keyof FormData]}
            onChange={onInputChange}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-[#f4b500] focus:border-[#f4b500]"
            required
          />
        </div>
      </div>
    </div>
  </div>
);