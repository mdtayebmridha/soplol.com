import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'Which payment methods are available?',
    answer: 'Cash on Delivery is available for Bangladesh checkout. SSLCommerz appears only when merchant credentials are configured; online orders are marked paid only after provider validation.',
  },
  {
    question: 'Can I place an international order?',
    answer: 'International checkout is not currently available. Orders can currently be placed for Bangladesh addresses in BDT.',
  },
  {
    question: 'How do I track an order?',
    answer: 'Enter the order number and phone number used at checkout on the Track Order page. It shows the status saved for the order.',
  },
  {
    question: 'Can I create an account?',
    answer: 'Yes. Sign-up and sign-in use a customer account. You can still place an order as a guest; signed-in orders are linked to your account.',
  },
  {
    question: 'How can I contact soplol?',
    answer: 'Use the contact form to save an order or product question and receive a reference number.',
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-16 text-neutral-900">
      <div className="border-b border-neutral-200 pb-6">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-800">Got Questions?</span>
        <h1 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h1>
        <p className="mt-2 text-sm text-neutral-500">Current information about accounts, orders, and checkout.</p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question} className="space-y-2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <h2 className="flex items-start gap-2 text-sm font-bold text-neutral-900 sm:text-base">
              <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-800" />
              {faq.question}
            </h2>
            <p className="pl-7 text-xs leading-relaxed text-neutral-600 sm:text-sm">{faq.answer}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2 rounded-2xl bg-neutral-100 p-6 text-center">
        <h2 className="text-sm font-bold text-neutral-900">Still have a question?</h2>
        <p className="text-xs text-neutral-600">Send it using the contact form.</p>
        <Link href="/contact" className="inline-block rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800">
          Contact soplol
        </Link>
      </div>
    </div>
  );
}
