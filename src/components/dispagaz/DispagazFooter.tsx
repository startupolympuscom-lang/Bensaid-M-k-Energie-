import Link from "next/link";
import { DispagazLogo } from "@/components/dispagaz/DispagazLogo";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";
import { company } from "@/config/company";
import { dispagaz } from "@/config/dispagaz";
import { dispagazNavigation } from "@/content/dispagaz";
import { getAddressLine, getEmail, getPhones } from "@/lib/company";

export function DispagazFooter() {
  const phones = getPhones();
  const email = getEmail();
  const address = getAddressLine();

  return (
    <footer className="bg-night text-white">
      <div className="container-page pt-16 pb-10 lg:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-0">
          <div className="sm:col-span-2 lg:col-span-1 lg:border-r lg:border-white/10 lg:pr-12">
            <DispagazLogo heightClassName="h-9 lg:h-10" />
            <p className="mt-6 max-w-[20rem] text-[0.9375rem] leading-relaxed text-white/65">
              {dispagaz.tagline}. Une solution{" "}
              <Link
                href="/"
                className="text-white underline decoration-orange-deep decoration-2 underline-offset-4 transition-colors hover:text-orange"
              >
                {company.name}
              </Link>
              .
            </p>
          </div>

          <nav aria-labelledby="dz-footer-links" className="lg:px-12 xl:px-16">
            <h2 id="dz-footer-links" className="font-heading text-sm font-semibold text-white">
              Dispagaz
            </h2>
            <ul className="mt-5 space-y-3">
              {dispagazNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.9375rem] text-white/65 transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={dispagaz.demoHref}
                  className="text-[0.9375rem] text-white/65 transition-colors duration-200 hover:text-white"
                >
                  Demander une démo
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="font-heading text-sm font-semibold text-white">Contact</h2>
            <address className="mt-5 space-y-3.5 text-[0.9375rem] text-white/65 not-italic">
              {phones.length > 0 ? (
                <p className="flex items-start gap-3">
                  <PhoneIcon width={18} height={18} className="mt-[3px] shrink-0 text-white/45" />
                  <span className="flex flex-wrap gap-x-3">
                    {phones.map((phone) => (
                      <a
                        key={phone.e164}
                        href={phone.href}
                        className="transition-colors hover:text-white"
                      >
                        {phone.display}
                      </a>
                    ))}
                  </span>
                </p>
              ) : null}
              {email ? (
                <p className="flex items-start gap-3">
                  <MailIcon width={18} height={18} className="mt-[3px] shrink-0 text-white/45" />
                  <a
                    href={`mailto:${email}`}
                    className="break-all transition-colors hover:text-white"
                  >
                    {email}
                  </a>
                </p>
              ) : null}
              {address ? (
                <p className="flex items-start gap-3">
                  <PinIcon width={18} height={18} className="mt-[3px] shrink-0 text-white/45" />
                  <span>{address}</span>
                </p>
              ) : null}
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-7 text-[0.8125rem] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> Dispagaz® — {company.name}. Tous droits réservés.
          </p>
          <Link href="/" className="transition-colors hover:text-white">
            ← Retour au site {company.name}
          </Link>
        </div>
      </div>
    </footer>
  );
}
