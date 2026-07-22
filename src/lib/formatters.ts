const usdCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

const percentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

const calendarDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const calendarMonthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function parseDateKey(value: string): Date {
  const [year, month, day = "1"] = value.split("-");
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

export function formatUsd(value: number) {
  return usdCurrencyFormatter.format(value);
}

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function formatPercentage(value: number) {
  return percentageFormatter.format(value);
}

export function formatCalendarDate(value: string) {
  return calendarDateFormatter.format(parseDateKey(value));
}

export function formatCalendarMonth(value: string) {
  return calendarMonthFormatter.format(parseDateKey(value));
}
