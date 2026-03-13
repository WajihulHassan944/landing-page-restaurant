"use client";

import { useRef } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";

interface Props {
  formData: any;
  publishedData: any;
}

export default function StorePublished({ formData, publishedData }: Props) {
  const qrRef = useRef<HTMLDivElement>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_ADMIN_URL ||
    "https://saas-restaurant-admin-dashboard.vercel.app/";

  const loginUrl = `${baseUrl}/login?email=${formData?.user?.email}&restaurantId=${publishedData?.restaurantId}`;

  const downloadQR = async () => {
    if (!qrRef.current) return;

    const dataUrl = await toPng(qrRef.current);

    const link = document.createElement("a");
    link.download = `${formData?.restaurant?.name || "restaurant"}-qr.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-5xl bg-white rounded-xl p-12 text-center">
        <h1 className="text-[22px] font-semibold mb-2">
          🎉 Your Store Is Now Live
        </h1>

        <p className="text-sm text-gray-400 mb-8">
          Scan QR code or click below to open admin dashboard login.
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
            <strong>Email:</strong> {formData?.user?.email}
          </p>
        </div>

        {/* QR Code */}
        <div className="mx-auto bg-[#F8F8F8] rounded-2xl px-20 py-8 w-fit">
        <center>  <div
            ref={qrRef}
            className="bg-white p-4 rounded-lg shadow-[3px_4px_4px_0px_#00000040] w-fit"
          >
            <QRCode value={loginUrl} size={140} />
          </div>
</center>
          {/* Visit dashboard */}
          <a
            href={loginUrl}
            target="_blank"
            className="mt-4 flex items-center justify-center gap-1 text-black text-sm font-medium hover:underline w-full"
          >
            Visit dashboard
            <ExternalLink size={14} />
          </a>

          <p className="text-sm text-gray-600 mt-2 break-all">{loginUrl}</p>

          {/* Download QR */}
          <button
            onClick={downloadQR}
            className="mt-4 flex items-center justify-center gap-1 text-sm text-gray-600 hover:text-black w-full"
          >
            <Download size={14} />
            Download QR Code
          </button>
        </div>

        {/* IDs */}
        <div className="mt-8 text-sm text-gray-600 space-y-1">
          <p>Owner ID: {publishedData?.ownerId}</p>
          <p>Tenant ID: {publishedData?.tenantId}</p>
          <p>Restaurant ID: {publishedData?.restaurantId}</p>
          <p>Branch ID: {publishedData?.branchId}</p>
        </div>

        {/* Dashboard Button */}
        <div className="mt-10 flex justify-center">
          <Button
            onClick={() => (window.location.href = `${baseUrl}/login`)}
            className="bg-primary hover:bg-red-800 px-10 py-3 rounded-[14px] text-base"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}