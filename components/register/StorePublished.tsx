"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Props {
  formData: any;
  publishedData: any;
}

export default function StorePublished({ formData, publishedData }: Props) {
  console.log("Published Store Data:", publishedData);

  const storeUrl = `https://${formData?.restaurant?.slug}.yourdomain.com`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-5xl bg-white rounded-xl p-12 text-center">
        
        {/* ================= OLD STATIC VERSION ================= */}
        {/*
        <h1 className="text-[22px] font-semibold mb-2">
          Store Has Been Published
        </h1>

        <p className="text-sm text-gray-400 mb-10">
          Scan QR code or click the link below
        </p>

        <div className="mx-auto bg-[#F8F8F8] rounded-2xl px-20 py-8 w-fit">
          <div className="bg-white p-4 rounded-lg shadow-[3px_4px_4px_0px_#00000040]">
            <Image
              src="/publish.png"
              alt="Store QR Code"
              width={140}
              height={140}
            />
          </div>

          <button className="mt-4 flex items-center justify-center gap-1 text-primary text-sm font-medium hover:underline w-full">
            Visit store URL
            <ExternalLink size={14} />
          </button>
        </div>

        <div className="mt-10 flex justify-center">
          <Button className="bg-primary hover:bg-red-800 px-23 py-3 rounded-[14px] text-base">
            Go to Dashboard
          </Button>
        </div>
        */}

        {/* ================= NEW DYNAMIC VERSION ================= */}

        <h1 className="text-[22px] font-semibold mb-2">
          🎉 Your Store Is Now Live
        </h1>

        <p className="text-sm text-gray-400 mb-8">
          Your restaurant has been successfully created.
        </p>

        {/* Store Info */}
        <div className="mb-8 space-y-1 text-sm text-gray-600">
          <p>
            <strong>Restaurant:</strong> {formData?.restaurant?.name}
          </p>
          <p>
            <strong>Branch:</strong> {formData?.branch?.name}
          </p>
          <p>
            <strong>Email:</strong> {formData.user?.email}
          </p>
        </div>

        {/* QR + Store URL */}
        <div className="mx-auto bg-[#F8F8F8] rounded-2xl px-20 py-8 w-fit">
          <div className="bg-white p-4 rounded-lg shadow-[3px_4px_4px_0px_#00000040]">
            {/* You can later replace with real QR generator */}
            <Image
              src="/publish.png"
              alt="Store QR Code"
              width={140}
              height={140}
            />
          </div>

          {/* Store URL */}
          <a
            href={storeUrl}
            target="_blank"
            className="mt-4 flex items-center justify-center gap-1 text-primary text-sm font-medium hover:underline w-full"
          >
            Visit store
            <ExternalLink size={14} />
          </a>

          <p className="text-xs text-gray-400 mt-2 break-all">
            {storeUrl}
          </p>
        </div>

        {/* IDs returned from API */}
        <div className="mt-8 text-xs text-gray-400 space-y-1">
          <p>Owner ID: {publishedData?.ownerId}</p>
          <p>Tenant ID: {publishedData?.tenantId}</p>
          <p>Restaurant ID: {publishedData?.restaurantId}</p>
          <p>Branch ID: {publishedData?.branchId}</p>
        </div>

        {/* Dashboard Button */}
        <div className="mt-10 flex justify-center">
          <Button
            onClick={() =>
              (window.location.href =
                "http://saas-restaurant-admin-dashboard.vercel.app/login")
            }
            className="bg-primary hover:bg-red-800 px-10 py-3 rounded-[14px] text-base"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}