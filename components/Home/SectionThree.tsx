import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "../ui/button";

const categories = [
  {
    title: "Menu Management",
    description: "Easily update dishes, variations, prices & stock levels.",
    icon: "/assets/sectionThree/menu.png",
  },
  {
    title: "Order & Delivery Flow",
    description: "Easily update dishes, variations, prices & stock levels.",
    icon: "/assets/sectionThree/order.png",
  },
  {
    title: "Sales & Analytics",
    description:
      "Monitor revenue, popular items, peak hours & performance insights.",
    icon: "/assets/sectionThree/analytics.png",
  },
  {
    title: "Customer Feedback",
    description:
      "View ratings, respond to reviews & boost your reputation.",
    icon: "/assets/sectionThree/feedback.png",
  },
  {
    title: "Promotions & Discounts",
    description:
      "Create offers, promo codes & highlight best-selling meals.",
    icon: "/assets/sectionThree/discount.png",
  },
  {
    title: "Staff & Role Control",
    description:
      "Manage staff accounts, access levels & activity logs.",
    icon: "/assets/sectionThree/staff.png",
  },
];

export default function SectionThree() {
  return (
    <section className="w-full bg-white py-14 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-10 md:mb-12 max-w-xl text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-heading">
            Browse Popular Categories
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-[16px] text-gray-600">
            Discover the perfect course from our top-loved selections,
            designed to help you learn, grow, and succeed
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {categories.map((item, index) => (
            <Card
              key={index}
              className="rounded-[20px] md:rounded-[24px] border-none bg-[#F7F7F7] shadow-none"
            >
              <CardContent className="flex items-center gap-3 md:gap-4 px-4  md:py-0">
                {/* Icon */}
                <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl bg-primary">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={26}
                    height={26}
                    className="object-contain"
                  />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs md:text-sm leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 md:mt-12 text-center">
          <Button className="w-full sm:w-auto rounded-full bg-black px-8 py-3 text-sm md:py-3.5 font-medium text-white hover:bg-black/90">
            View all
          </Button>
        </div>
      </div>
    </section>
  );
}
