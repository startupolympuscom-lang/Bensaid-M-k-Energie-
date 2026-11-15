import type { Metadata } from "next";
import { QuoteForm } from "@/components/contact/QuoteForm";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { contactPage } from "@/content/contact";
import { getAddressLine, getEmail, getPhones } from "@/lib/company";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: contactPage.metaTitle,
  description: contactPage.metaDescription,
  path: "/contact",
});

export default function ContactPage() {
  const phones = getPhones();
  const email = getEmail();
  const address = getAddressLine();

  return (
    <section aria-labelledby="contact-title" className="pt-12 pb-20 sm:pt-16 lg:pt-24 lg:pb-32">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <SectionEyebrow>{contactPage.eyebrow}</SectionEyebrow>
          <h1 id="contact-title" className="type-h1 mt-7 max-w-[14ch]">
            {contactPage.title}
          </h1>
          <p className="type-lead mt-6 max-w-[28rem]">{contactPage.description}</p>

          <dl className="mt-12 border-t border-line lg:mt-14">
            {phones.length > 0 ? (
              <div className="flex gap-4 border-b border-line py-5">
                <dt className="pt-0.5">
                  <PhoneIcon width={18} height={18} className="text-ink-subtle" />
                  <span className="sr-only">Téléphone</span>
                </dt>
                <dd className="flex flex-col gap-1">
                  {phones.map((phone) => (
                    <a
                      key={phone.e164}
                      href={phone.href}
                      className="w-fit text-[1.0625rem] text-ink decoration-orange decoration-2 underline-offset-4 transition-colors hover:underline"
                    >
                      {phone.display}
                    </a>
                  ))}
                </dd>
              </div>
            ) : null}
            {email ? (
              <div className="flex gap-4 border-b border-line py-5">
                <dt className="pt-0.5">
                  <MailIcon width={18} height={18} className="text-ink-subtle" />
                  <span className="sr-only">Email</span>
                </dt>
                <dd>
                  <a
                    href={`mailto:${email}`}
                    className="text-[1.0625rem] break-all text-ink decoration-orange decoration-2 underline-offset-4 transition-colors hover:underline"
                  >
                    {email}
                  </a>
                </dd>
              </div>
            ) : null}
            {address ? (
              <div className="flex gap-4 border-b border-line py-5">
                <dt className="pt-0.5">
                  <PinIcon width={18} height={18} className="text-ink-subtle" />
                  <span className="sr-only">Adresse</span>
                </dt>
                <dd className="text-[1.0625rem] text-ink">{address}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div id="devis" className="lg:col-span-7">
          <div className="rounded-[1.375rem] border border-line bg-offwhite p-6 sm:p-10 lg:p-12">
            <h2 className="type-h2 text-[1.75rem] sm:text-[2rem]">{contactPage.formTitle}</h2>
            <p className="mt-3 text-[0.9375rem] text-ink-muted">{contactPage.formIntro}</p>
            <div className="mt-9">
              <QuoteForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
