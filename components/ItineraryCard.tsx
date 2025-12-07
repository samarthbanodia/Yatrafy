"use client";

import { Flight, Hotel } from "@/types";
import Image from "next/image";
import { Plane, Hotel as HotelIcon, Calendar, MapPin } from "lucide-react";

interface ItineraryCardProps {
  flight: Flight;
  hotel: Hotel;
  startDate: string;
  endDate: string;
}

export default function ItineraryCard({
  flight,
  hotel,
  startDate,
  endDate,
}: ItineraryCardProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 shadow-xl border border-purple-200">
      <h3 className="text-lg font-bold gradient-text mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        Your Itinerary
      </h3>

      {/* Flight Details */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Plane className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{flight.airline}</div>
            <div className="text-xs text-gray-600">Flight Booking</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-gray-500 text-xs">From</div>
            <div className="font-medium text-gray-900">{flight.from}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">To</div>
            <div className="font-medium text-gray-900">{flight.to}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Departure</div>
            <div className="font-medium text-gray-900">
              {new Date(flight.departTime).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Arrival</div>
            <div className="font-medium text-gray-900">
              {new Date(flight.arriveTime).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Details */}
      <div className="bg-white rounded-xl p-4 shadow-sm overflow-hidden">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 flex-shrink-0">
            {hotel.imageUrl && (
              <Image
                src={hotel.imageUrl}
                alt={hotel.name}
                fill
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">{hotel.name}</div>
            <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {hotel.location}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Rating: {hotel.rating}/5 ⭐
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t border-gray-100">
          <div>
            <div className="text-gray-500 text-xs">Check-in</div>
            <div className="font-medium text-gray-900">
              {new Date(startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Check-out</div>
            <div className="font-medium text-gray-900">
              {new Date(endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
