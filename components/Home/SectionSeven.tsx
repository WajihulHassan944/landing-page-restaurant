import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SectionSeven() {
  return (
    <section className="w-full bg-white py-15">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <div>
            <h2 className="text-4xl font-bold leading-tight text-gray-900 font-heading">
              Smooth and Easy 
              Restaurant Order 
              Management
            </h2>

            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-gray-600 ">
              With user-friendly features, competitive exchange rates, and
              robust security measures, our platform simplifies international
              transactions.
            </p>

            {/* CHECK LIST */}
            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                  <Check className="h-4 w-4 text-gray-900" />
                </span>
                <span className="text-[16px] text-gray-700">
                  Seamless order flow from customers to your kitchen
                </span>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                  <Check className="h-4 w-4 text-gray-900" />
                </span>
                <span className="text-[16px] text-gray-700">
                  Smart menu, pricing, and inventory controls
                </span>
              </li>
            </ul>

            {/* CTA */}
            <div className="mt-10">
              <Button className="rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white hover:bg-black/90">
                Get Started
              </Button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center lg:justify-end">
            <Image
              src="/assets/sectionSeven/map.png"
              alt="Global restaurant order management map"
              width={560}
              height={420}
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
