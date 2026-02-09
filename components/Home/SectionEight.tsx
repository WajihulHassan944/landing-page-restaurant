import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function SectionEight() {
  return (
    <section className="w-full bg-white pt-15 pb-90">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <div>
            <span className="text-[16px] text-gray-500">FAQ’S</span>

            <h2 className="mt-4 text-4xl font-bold leading-tight text-gray-900 font-heading">
              Frequently 
              Asked 
              Questions
            </h2>

            <p className="mt-8 text-[16px] text-gray-600 ">Ask any questions</p>

            <a
              href="mailto:support@yourfoodsaas.com"
              className="mt-2 inline-block text-xl font-medium text-blue-600 hover:underline"
            >
              support@yourfoodsaas.com
            </a>
          </div>

          {/* RIGHT FAQ ACCORDION */}
          <div>
            <Accordion
              type="single"
              collapsible
              defaultValue="item-1"
              className="w-full"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-[18px] font-heading font-[600] text-[#171717]">
                  Can I use the platform for both dine-in and delivery orders?
                </AccordionTrigger>
                <AccordionContent className="text-[15px] text-[#595959]">
                  Yes, our system supports all order types — delivery,
                  takeaway, and dine-in. Restaurants can easily manage them
                  through a single dashboard designed for speed and efficiency.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                 <AccordionTrigger className="text-[18px] font-heading font-[600] text-[#171717]">
                 How do I update my restaurant menu?
                </AccordionTrigger>
                   <AccordionContent className="text-[15px] text-[#595959]">
               You can update your menu directly from the restaurant
                  dashboard. Add or remove items, update prices, manage
                  variations, and control availability in real time without
                  any technical assistance.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
              <AccordionTrigger className="text-[18px] font-heading font-[600] text-[#171717]">
                    Do you provide delivery riders?
                </AccordionTrigger>
                 <AccordionContent className="text-[15px] text-[#595959]">
                 We support both in-house and third-party delivery models.
                  Restaurants can use their own riders or integrate with
                  supported delivery partners depending on their business
                  needs.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
               <AccordionTrigger className="text-[18px] font-heading font-[600] text-[#171717]">
                   Are there any fees for joining the platform?
                </AccordionTrigger>
                 <AccordionContent className="text-[15px] text-[#595959]">
                 There are no upfront setup fees. Pricing depends on your
                  selected plan and order volume. Full details are available
                  during onboarding or by contacting our sales team.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-[18px] font-heading font-[600] text-[#171717]">
                  Can I manage orders from multiple devices?
                </AccordionTrigger>
                    <AccordionContent className="text-[15px] text-[#595959]">
              Yes. Your account stays synchronized across all devices,
                  allowing you to manage orders, menus, and analytics from
                  multiple tablets, phones, or desktops simultaneously.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
