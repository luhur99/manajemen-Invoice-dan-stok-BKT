import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid, parseISO } from "date-fns"; // Import isValid and parseISO
import { id as idLocale } from "date-fns/locale"; // Import id locale

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateSafely = (
  dateInput: string | Date | null | undefined,
  formatString: string = "dd MMMM yyyy",
  locale: Locale = idLocale
): string => {
  if (!dateInput) {
    return "-";
  }

  let dateObj: Date;
  if (typeof dateInput === 'string') {
    dateObj = parseISO(dateInput);
  } else {
    dateObj = dateInput;
  }

  if (isValid(dateObj)) {
    return format(dateObj, formatString, { locale });
  }
  return "-";
};