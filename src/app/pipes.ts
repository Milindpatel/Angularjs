import { Pipe, PipeTransform } from '@angular/core';

/** "Milind" -> "dniliM" */
@Pipe({ name: 'reverse' })
export class ReversePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return value ? [...value].reverse().join('') : '';
  }
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** 1 -> "1st", 2 -> "2nd", 11 -> "11th", 22 -> "22nd" */
export function ordinal(n: number): string {
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}th`;
  return n + (['th', 'st', 'nd', 'rd'][n % 10] ?? 'th');
}

/** "1977-05-25" or a Date -> "25th May 1977" (calendar date, no time-zone shifts). */
@Pipe({ name: 'dateSuffix' })
export class DateSuffixPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    let year: number, month: number, day: number;
    const iso = typeof value === 'string' ? /^(\d{4})-(\d{2})-(\d{2})/.exec(value) : null;
    if (iso) {
      [year, month, day] = [Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])];
    } else {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);
      [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDate()];
    }
    return `${ordinal(day)} ${MONTHS[month]} ${year}`;
  }
}
