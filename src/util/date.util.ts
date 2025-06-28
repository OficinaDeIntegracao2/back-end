import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const normalizeToBrazilNoon = (date: Date): Date => {
  const timeZone = "America/Sao_Paulo";
  const zoned = toZonedTime(date, timeZone); // converte para horário de SP
  const formatted = format(zoned, "yyyy-MM-dd"); // extrai só a data
  // recria o Date com 12h locais no fuso de SP
  const [year, month, day] = formatted.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
};