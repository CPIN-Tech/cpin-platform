import { formatEther } from 'viem';
import dayjs from './dayjs';

export function formatAmount(input: bigint | string | null, decimals = 2) {
  if (input == null) {
    return '0';
  }
  const str = typeof input == 'bigint' ? formatEther(input) : input;
  let [part1, part2] = str.split('.');
  if (part1.length >= 5) {
    part1 = part1.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (!part2) {
    part2 = '0';
  }
  return `${part1}.${part2.slice(0, decimals)}`;
}

export function formatDate(input: Date | string | null) {
  if (input == null) {
    return '-';
  }
  const date: Date = typeof input === 'string' ? new Date(input) : input;
  const yyyy = date.getFullYear();
  if (yyyy < 2000) {
    return '-';
  }
  let mm: string | number = date.getMonth() + 1;
  let dd: string | number = date.getDate();

  if (dd < 10) dd = `0${dd}`;
  if (mm < 10) mm = `0${mm}`;

  return `${dd}.${mm}.${yyyy}`;
}

export function formatDateISO(input: Date | string | null) {
  if (input == null) {
    return '-';
  }
  const date: Date = typeof input === 'string' ? new Date(input) : input;
  const yyyy = date.getUTCFullYear();
  if (yyyy < 2000) {
    return '-';
  }
  let mm: string | number = date.getUTCMonth() + 1;
  let dd: string | number = date.getUTCDate();

  if (dd < 10) dd = `0${dd}`;
  if (mm < 10) mm = `0${mm}`;

  return `${yyyy}-${mm}-${dd}`;
}

export function formatTime(input: Date | string | null) {
  if (input == null) {
    return '-';
  }
  const date: Date = typeof input === 'string' ? new Date(input) : input;
  let hh: string | number = date.getHours();
  let mm: string | number = date.getMinutes();
  let ss: string | number = date.getSeconds();

  if (hh < 10) hh = `0${hh}`;
  if (mm < 10) mm = `0${mm}`;
  if (ss < 10) ss = `0${ss}`;

  return `${hh}:${mm}.${ss}`;
}

export function formatShortDateTime(input: Date | string | null) {
  if (input == null) {
    return '-';
  }
  const date: Date = typeof input === 'string' ? new Date(input) : input;

  let MM: string | number = date.getMonth() + 1;
  let dd: string | number = date.getDate();
  let hh: string | number = date.getHours();
  let mm: string | number = date.getMinutes();
  let ss: string | number = date.getSeconds();

  if (hh < 10) hh = `0${hh}`;
  if (mm < 10) mm = `0${mm}`;
  if (ss < 10) ss = `0${ss}`;

  if (dd < 10) dd = `0${dd}`;
  if (MM < 10) MM = `0${MM}`;

  return `${MM}-${dd} ${hh}:${mm}`;
}

export function calculateDaysAgo(dateString: string): string {
  const daysAgo = dayjs().diff(dayjs(dateString), 'day');
  return `${daysAgo} days ago`;
}
