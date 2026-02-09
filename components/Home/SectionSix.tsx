import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SectionSix() {
  return (
    <section className="w-full bg-white py-15">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* LEFT IMAGE */}
          <div className="flex justify-center lg:justify-start">
            <Image
              src="/assets/sectionSix/dining.png"
              alt="Restaurant dining experience"
              width={520}
              height={620}
              priority
              className="object-contain"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div>
            <h2 className="text-4xl font-bold leading-tight text-gray-900 font-heading">
              Transforming 
              Restaurant Growth, 
              One Order at a Time.
            </h2>

            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-gray-600">
              Our platform empowers restaurants to operate smarter, serve
              faster, and scale effortlessly. Designed with advanced automation
              and real-time insights, we help food businesses stay ahead in a
              competitive delivery market.
            </p>

            {/* CHECK LIST */}
            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                  <Check className="h-4 w-4 text-gray-900" />
                </span>
                <span className="text-[16px] text-gray-700">
                  Manage all incoming orders instantly
                </span>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                  <Check className="h-4 w-4 text-gray-900" />
                </span>
                <span className="text-[16px] text-gray-700">
                  Smart tools to boost restaurant performance
                </span>
              </li>

              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                  <Check className="h-4 w-4 text-gray-900" />
                </span>
                <span className="text-[16px] text-gray-700">
                  Faster deliveries, happier customers
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
        </div>
      </div>
    </section>
  );
}
