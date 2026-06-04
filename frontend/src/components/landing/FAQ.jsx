import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "How accurate are the AI quotes?",
    a: "TerrainPRO pulls realistic AUD rates and applies them to your specific job inputs — square meterage, plant, materials, soil class and timeline. For typical residential and small commercial work, our beta crews report ~94% accuracy vs final invoice. It's an estimate, not a fixed price — final figures should come after a site visit.",
  },
  {
    q: "Which trades is it built for?",
    a: "Day one we're laser-focused on earthmoving (excavation, cut/fill, trenching, spoil removal), concreting (slabs, footpaths, driveways) and landscaping (hardscape and softscape). Roofing, fencing and tiling are on the roadmap.",
  },
  {
    q: "Can I use my own rates and suppliers?",
    a: "Yes. On Crew and Contractor plans you can upload a custom rates library — plant hire, supplier pricing, labour bands. TerrainPRO will weight your rates over the regional defaults so quotes match your business.",
  },
  {
    q: "Does it integrate with my accounting software?",
    a: "Crew and Contractor plans push accepted quotes straight to Xero and MYOB AccountRight. Variations and progress claims sync too — no double-entry.",
  },
  {
    q: "What if the client wants changes?",
    a: "Hit ‘Variation’ on any quote. TerrainPRO generates a delta quote (just the difference) signed off separately. No more arguments at the end of the job.",
  },
  {
    q: "Is there a free trial?",
    a: "Sole Trader is free forever (up to 20 quotes/month). Crew has a 14-day full-feature trial, no card up front. You'll know inside a week if it's earning its keep.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      data-testid="faq-section"
      className="relative py-24 sm:py-32 border-t border-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <span className="font-display uppercase text-4xl sm:text-5xl tracking-tight text-yellow-500">
            <span className="opacity-50">[</span> FAQ <span className="opacity-50">]</span>
          </span>
          <p className="mt-4 text-neutral-400 leading-relaxed max-w-xl">
            Straight answers. No fluff. Everything Aussie tradies ask before
            they put TerrainPRO on the tools.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              data-testid={`faq-item-${i}`}
              className="border-b border-neutral-800"
            >
              <AccordionTrigger className="text-left font-display uppercase text-base sm:text-lg tracking-tight py-5 hover:no-underline hover:text-yellow-500">
                <span className="flex items-center gap-4">
                  <span className="font-mono text-xs text-yellow-500 tracking-[0.2em]">
                    / 0{i + 1}
                  </span>
                  <span>{f.q}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-neutral-400 leading-relaxed text-sm pl-12 pr-4 pb-6">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
