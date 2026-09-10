import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import type { Locale } from "../i18n/locale";
import type { Currency } from "../types";
export const formatPrice = (value: number, currency: Currency, locale: Locale = "pt-BR") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
export const relativeDate = (date: string, locale: Locale = "pt-BR") =>
  formatDistanceToNow(parseISO(date), {
    addSuffix: true,
    locale: locale === "pt-BR" ? ptBR : enUS,
  });
export const fullDate = (date: string, locale: Locale = "pt-BR") =>
  format(parseISO(date), locale === "pt-BR" ? "dd MMM yyyy" : "MMM d, yyyy", {
    locale: locale === "pt-BR" ? ptBR : enUS,
  });
export const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
