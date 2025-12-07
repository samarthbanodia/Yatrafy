"use client";

import { TripOption } from "@/types";
import Image from "next/image";
import { Plane, Hotel, Star, Shield, Calendar } from "lucide-react";

interface TripOptionCardProps {
  option: TripOption;
  onBook: () => void;
}

export default function TripOptionCard({ option, onBook }: TripOptionCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover border border-gray-100">
      {/* Hotel Image */}
      <div className="relative h-48 w-full bg-gradient-to-br from-purple-100 to-blue-100">
        {option.hotel.imageUrl && (
          <Image
            src={option.hotel.imageUrl}
            alt={option.hotel.name}
            fill
            className="object-cover"
            unoptimized
          />
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-gray-800">
            {option.hotel.rating}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Hotel Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {option.hotel.name}
          </h3>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Hotel className="w-4 h-4" />
            {option.hotel.location}
          </p>
        </div>

        {/* Flight Info */}
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Plane className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">
              {option.flight.airline}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            {option.flight.from} → {option.flight.to}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(option.flight.departTime).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* Scores */}
        <div className="flex gap-2 mb-4">
          {option.hotel.safetyScore && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-lg">
              <Shield className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-700">
                Safety {option.hotel.safetyScore}/10
              </span>
            </div>
          )}
          <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-lg">
            <span className="text-xs font-medium text-purple-700">
              ₹{option.hotel.pricePerNight}/night
            </span>
          </div>
        </div>

        {/* Rationale */}
        <p className="text-sm text-gray-600 mb-4 italic border-l-2 border-purple-300 pl-3">
          {option.rationale}
        </p>

        {/* Price and Book */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-500">Total Price</div>
            <div className="text-2xl font-bold gradient-text">
              ₹{option.totalPrice.toLocaleString()}
            </div>
          </div>
          <button
            onClick={onBook}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
