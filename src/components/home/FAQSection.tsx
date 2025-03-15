
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "What products do you supply?",
      answer: "We specialize in the wholesale supply of fresh fruits and vegetables, including pomegranates, grapes, bananas, dragon fruits, and drumsticks."
    },
    {
      question: "How do you ensure the quality of your products?",
      answer: "Our produce is sourced directly from trusted farms, ensuring freshness and high quality. We also follow strict handling and transportation protocols to maintain standards."
    },
    {
      question: "Do you provide support to farmers?",
      answer: "Yes, we offer quick credit solutions and market accessibility to empower farmers and help them grow sustainably."
    },
    {
      question: "Which regions do you serve?",
      answer: "We cater to regional and national markets, supplying quality produce to businesses, distributors, and retailers."
    },
    {
      question: "What makes Lakshmikrupa Agriculture different from other suppliers?",
      answer: "Our focus on freshness, direct farm sourcing, efficient supply chain, and farmer support sets us apart from competitors."
    },
    {
      question: "Can I place a bulk order?",
      answer: "Yes, we specialize in bulk orders for fruits and vegetables. Contact us to discuss your requirements."
    }
  ];

  return (
    <section className="container py-12 md:py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about our products and services
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-card rounded-lg p-6 shadow-sm">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="flex items-center text-left">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0" />
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-10">
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
