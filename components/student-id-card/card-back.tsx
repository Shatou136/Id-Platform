"use client";

import { CARD_BACK } from "@/lib/school-identity";
import "./student-id-card.css";

type CardBackProps = {
  scale?: "print" | "preview";
};

export function CardBack({ scale = "print" }: CardBackProps) {
  return (
    <div
      className="slui-card-stage"
      data-scale={scale === "preview" ? "preview" : undefined}
    >
      <article className="slui-card slui-card-back" aria-label="Student ID Card back">
        <p className="slui-back-republic">{CARD_BACK.republic}</p>
        <p className="slui-back-motto">{CARD_BACK.motto}</p>
        <p className="slui-back-this">{CARD_BACK.thisWord}</p>
        <p className="slui-back-kind">{CARD_BACK.cardKind}</p>
        <p className="slui-back-property">{CARD_BACK.propertyOf}</p>
        <p className="slui-back-school">{CARD_BACK.school}</p>
        <p className="slui-back-return">{CARD_BACK.returnTo}</p>
        <p className="slui-back-tel">{CARD_BACK.tel}</p>
        <p className="slui-back-email">{CARD_BACK.email}</p>
      </article>
    </div>
  );
}
