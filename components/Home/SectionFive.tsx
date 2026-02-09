import Image from "next/image";
import { Building2, Zap, Headphones } from "lucide-react";

export default function SectionFive() {
  return (
    <section className="w-full bg-white py-15">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <div>
            <h2 className=" leading-tight text-4xl font-bold text-gray-900 font-heading">
              Grow Your Restaurant with <br />
              a Smarter Delivery Platform
            </h2>

            <p className="mt-4 max-w-xl text-m leading-relaxed text-gray-600">
              Our technology helps restaurants increase sales, streamline
              operations, and reach customers faster than ever—without the
              hassle.
            </p>

            {/* FEATURES */}
            <div className="mt-10 space-y-8">
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F1F5F9]">
                  <Building2 className="h-6 w-6 text-gray-900" />
                </div>
                <div>
                  <h4 className="font-[600] text-gray-900 font-heading text-[19px]">
                    Create Your Restaurant Account
                  </h4>
                  <p className="mt-1 max-w-md text-sm text-gray-600">
                    Set up your digital storefront in minutes. Upload your
                    menu, define pricing, add food images, and start receiving
                    orders instantly through our fully automated onboarding
                    flow.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F1F5F9]">
                  <Zap className="h-6 w-6 text-gray-900" />
                </div>
                <div>
                   <h4 className="font-[600] text-gray-900 font-heading text-[19px]">
                    Manage Orders in Real-Time
                  </h4>
                  <p className="mt-1 max-w-md text-sm text-gray-600">
                    Track new orders, accepted orders, rider assignments, and
                    delivery progress — all updated live. Everything stays
                    synchronized across devices.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4">
               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F1F5F9]">
                  <Headphones className="h-6 w-6 text-gray-900" />
                </div>
                <div>
                  <h4 className="font-[600] text-gray-900 font-heading text-[19px]">
                    24/7 Support for Restaurants
                  </h4>
                  <p className="mt-1 max-w-md text-sm text-gray-600">
                    Get priority assistance at any time. From technical help to
                    menu optimization, our support team ensures your operations
                    run smoothly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center lg:justify-end">
            <Image
              src="/assets/sectionFive/mobile.png"
              alt="Restaurant delivery mobile app"
              width={520}
              height={720}
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
