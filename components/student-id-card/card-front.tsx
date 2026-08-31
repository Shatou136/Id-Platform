"use client";

import { QRCodeSVG } from "qrcode.react";
import {
  cardQrPayload,
  formatCardFields,
  type StudentIdCardInput,
} from "@/lib/card-fields";
import { code128Svg } from "@/lib/code128-svg";
import { SCHOOL } from "@/lib/school-identity";
import "./student-id-card.css";

type CardFrontProps = {
  fields: StudentIdCardInput;
  scale?: "print" | "preview";
  logoSrc?: string;
  schoolName?: string;
};

export function CardFront({
  fields,
  scale = "print",
  logoSrc = SCHOOL.logoSrc,
  schoolName = SCHOOL.nameOnCard,
}: CardFrontProps) {
  const formatted = formatCardFields(fields);
  const nameSize =
    formatted.fullName.length > 24
      ? "2.45mm"
      : formatted.fullName.length > 18
        ? "2.75mm"
        : undefined;
  let barcodeMarkup = "";
  try {
    barcodeMarkup = formatted.matricule
      ? code128Svg(formatted.matricule)
      : "";
  } catch {
    barcodeMarkup = "";
  }

  return (
    <div
      className="slui-card-stage"
      data-scale={scale === "preview" ? "preview" : undefined}
    >
      <article className="slui-card slui-card-front" aria-label="Student ID Card front">
        <div className="slui-card-watermark">
          {/* Print must use the file as-is; next/image can alter the plastic. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" />
        </div>
        <header className="slui-card-header">
          <p className="slui-card-school">{schoolName}</p>
          <p className="slui-card-faculties">{SCHOOL.facultiesLine}</p>
          <p className="slui-card-auth">{SCHOOL.authorisation}</p>
        </header>
        <div className="slui-card-flag-slot" aria-hidden="true">
          <div className="slui-card-flag">
            <svg
              viewBox="0 0 90 180"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="30" height="180" fill="#007a33" />
              <rect x="30" width="30" height="180" fill="#ce1126" />
              <rect x="60" width="30" height="180" fill="#fcd116" />
              <polygon
                fill="#fcd116"
                points="45,68 48.3,78.2 59.2,78.4 50.6,84.7 53.7,95.2 45,88.8 36.3,95.2 39.4,84.7 30.8,78.4 41.7,78.2"
              />
            </svg>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="slui-card-logo"
          src={logoSrc}
          alt={SCHOOL.name}
        />
        <p className="slui-card-title">{SCHOOL.frontTitle}</p>
        <div className="slui-card-photo">
          {formatted.photoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={formatted.photoSrc} alt="" />
          ) : (
            <div className="slui-card-photo-empty">PHOTO</div>
          )}
        </div>
        <div className="slui-card-namebar">
          <span style={nameSize ? { fontSize: nameSize } : undefined}>
            {formatted.fullName}
          </span>
        </div>
        <dl className="slui-card-fields">
          <div>
            <dt>SEX:</dt>
            <dd>{formatted.sex}</dd>
          </div>
          <div>
            <dt>PROGRAM:</dt>
            <dd>{formatted.programme}</dd>
          </div>
          <div>
            <dt>DATE OF BIRTH:</dt>
            <dd>{formatted.dateOfBirth}</dd>
          </div>
          <div>
            <dt>PLACE OF BIRTH:</dt>
            <dd>{formatted.placeOfBirth}</dd>
          </div>
          <div>
            <dt>MATRICULE:</dt>
            <dd>{formatted.matricule}</dd>
          </div>
          <div>
            <dt>CAMPUS:</dt>
            <dd>{formatted.campus}</dd>
          </div>
        </dl>
        <div className="slui-card-qr">
          <QRCodeSVG
            value={cardQrPayload(formatted)}
            size={128}
            level="M"
            bgColor="#ffffff"
            fgColor="#000000"
            aria-label="QR Code"
          />
        </div>
        <div className="slui-card-validity">
          VALIDITY: {formatted.validityYear}
        </div>
        <div
          className="slui-card-barcode"
          dangerouslySetInnerHTML={
            barcodeMarkup ? { __html: barcodeMarkup } : undefined
          }
        />
      </article>
    </div>
  );
}
