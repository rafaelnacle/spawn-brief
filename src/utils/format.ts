import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Currency } from "../types";
export const formatPrice = (value: number, currency: Currency) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value);
export const relativeDate = (date: string) =>
  formatDistanceToNow(parseISO(date), { addSuffix: true, locale: ptBR });
export const fullDate = (date: string) => format(parseISO(date), "dd MMM yyyy", { locale: ptBR });
export const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
