import Image from "next/image";

const stats = [
  {
    icon: "/assets/sectionTwo/users.png",
    value: "120K+",
    title:
      "A complete operating system designed to help restaurants increase revenue and run daily operations effortlessly.",
    iconSize: 76, // bigger icon
  },
  {
    icon: "/assets/sectionTwo/star.png",
    value: "500+",
    title:
      "Trusted by restaurant owners for its unmatched reliability, intuitive design, and real-time order control.",
    iconSize: 30,
  },
  {
    icon: "/assets/sectionTwo/location.png",
    value: "89+",
    title:
      "We help restaurants grow with a strong presence across multiple regions and delivery networks.",
    iconSize: 30,
  },
];

export default function SectionTwo() {
  return (
    <section className="w-full bg-white py-10 pt-35">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-20 md:grid-cols-3">
          {stats.map((item, index) => (
            <div key={index}>
              {/* Icon + Value (ROW) */}
              <div className="flex items-center gap-3">
                <Image
                  src={item.icon}
                  alt={item.value}
                  width={item.iconSize}
                  height={item.iconSize}
                  className="object-contain"
                />
                <h3 className="text-3xl font-semibold text-gray-900 font-heading">
                  {item.value}
                </h3>
              </div>

              {/* Description */}
              <p className="mt-3 max-w-sm text-[16px] leading-relaxed text-gray-600">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
