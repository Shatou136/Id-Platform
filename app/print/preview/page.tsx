import { CardBack, CardFront } from "@/components/student-id-card";
import { AppShell } from "@/components/app-shell";
import { PHOTOGRAPHED_SPECIMEN } from "@/lib/card-fields";
import Link from "next/link";

export default function CardPreviewPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight">
            Student ID Card template
          </h1>
          <p className="mt-2 text-[15px] leading-6 text-muted">
            Every future card is printed from this face. The left column is the
            template. The right column is the photographed plastic it must match.
            Specimen text is from the photographed card; the Photo slot stays
            empty until a Request supplies one.
          </p>
          <p className="mt-3 text-[15px] leading-6">
            <Link className="font-medium text-accent" href="/print">
              Open the Print page
            </Link>
            {" · "}
            <Link className="font-medium text-accent" href="/student">
              Send a Request
            </Link>
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Front</h2>
          <div className="grid gap-6 xl:grid-cols-2">
            <figure className="space-y-2">
              <CardFront fields={PHOTOGRAPHED_SPECIMEN} scale="preview" />
              <figcaption className="text-[13px] text-muted">
                Template front
              </figcaption>
            </figure>
            <figure className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/id-front.jpg"
                alt="Photographed Student ID Card front"
                className="w-[calc(85.6mm*1.85)] max-w-full rounded-[2.5mm] border border-line object-cover"
              />
              <figcaption className="text-[13px] text-muted">
                Photographed front
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Back</h2>
          <div className="grid gap-6 xl:grid-cols-2">
            <figure className="space-y-2">
              <CardBack scale="preview" />
              <figcaption className="text-[13px] text-muted">
                Template back
              </figcaption>
            </figure>
            <figure className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/id-back.jpg"
                alt="Photographed Student ID Card back"
                className="w-[calc(85.6mm*1.85)] max-w-full rounded-[2.5mm] border border-line object-cover"
              />
              <figcaption className="text-[13px] text-muted">
                Photographed back
              </figcaption>
            </figure>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
