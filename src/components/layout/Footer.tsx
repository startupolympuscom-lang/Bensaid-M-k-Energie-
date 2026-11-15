import Link from "next/link";
import { cacheLife } from "next/cache";
import { Logo } from "@/components/layout/Logo";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";
import { company } from "@/config/company";
import { mainNavigation } from "@/content/navigation";
import {
  getAddressLine,
  getEmail,
  getLegalIdentifiers,
  getPhones,
  getSocialLinks,
} from "@/lib/company";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
};

export function Footer() {
  const phones = getPhones();
  const email = getEmail();
  const address = getAddressLine();
  const legal = getLegalIdentifiers();
  const social = getSocialLinks();

  return (
    <footer className="border-t border-line bg-white">
      <div className="container-page pt-16 pb-10 lg:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-0">
          <div className="sm:col-span-2 lg:col-span-1 lg:border-r lg:border-line lg:pr-12">
            <Logo heightClassName="h-12 lg:h-14" />
            <p className="mt-6 max-w-[19rem] text-[0.9375rem] leading-relaxed text-ink-muted">
              {company.tagline}.
            </p>
          </div>

          <nav aria-labelledby="footer-links" className="lg:px-12 xl:px-16">
            <h2 id="footer-links" className="font-heading text-sm font-semibold text-ink">
              Liens utiles
            </h2>
            <ul className="mt-5 space-y-3">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.9375rem] text-ink-muted transition-colors duration-200 hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-heading text-sm font-semibold text-ink">Contact</h2>
            <address className="mt-5 space-y-3.5 text-[0.9375rem] text-ink-muted not-italic">
              {phones.length > 0 ? (
                <p className="flex items-start gap-3">
                  <PhoneIcon width={18} height={18} className="mt-[3px] shrink-0 text-ink-subtle" />
                  <span className="flex flex-wrap gap-x-2">
                    {phones.map((phone, i) => (
                      <span key={phone.e164}>
                        <a href={phone.href} className="transition-colors hover:text-ink">
                          {phone.display}
                        </a>
                        {i < phones.length - 1 ? (
                          <span aria-hidden="true" className="pl-2 text-line">
                            /
                          </span>
                        ) : null}
                      </span>
                    ))}
                  </span>
                </p>
              ) : null}
              {email ? (
                <p className="flex items-start gap-3">
                  <MailIcon width={18} height={18} className="mt-[3px] shrink-0 text-ink-subtle" />
                  <a
                    href={`mailto:${email}`}
                    className="break-all transition-colors hover:text-ink"
                  >
                    {email}
                  </a>
                </p>
              ) : null}
              {address ? (
                <p className="flex items-start gap-3">
                  <PinIcon width={18} height={18} className="mt-[3px] shrink-0 text-ink-subtle" />
                  <span>{address}</span>
                </p>
              ) : null}
            </address>
            {social.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem]">
                {social.map(({ network, url }) => (
                  <li key={network}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                    >
                      {SOCIAL_LABELS[network] ?? network}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-7 text-[0.8125rem] text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {company.name}. Tous droits réservés.
          </p>
          {legal.length > 0 ? (
            <p className="flex gap-4">
              {legal.map((item) => (
                <span key={item.label}>
                  {item.label} : {item.value}
                </span>
              ))}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
