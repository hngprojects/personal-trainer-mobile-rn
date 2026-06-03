export function parseDisplayTime(time: string) {
  const normalized = time
    .trim()
    .replace(/\u202f|\u00a0/g, ' ')
    .toUpperCase();
  const match = normalized.match(/^(\d{1,2})(?::(\d{2}))?\s*([AP]M)$/);

  if (!match) {
    throw new Error(`Invalid time value: ${time}`);
  }

  let hour = Number(match[1]);
  const minute = Number(match[2] ?? '0');
  const period = match[3];

  if (!Number.isInteger(hour) || hour < 1 || hour > 12) {
    throw new Error(`Invalid hour value: ${time}`);
  }

  if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
    throw new Error(`Invalid minute value: ${time}`);
  }

  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  return { hour, minute };
}

export function buildLocalDateTimeIso(date: Date, time: string) {
  const { hour, minute } = parseDisplayTime(time);
  const selected = new Date(date);
  selected.setHours(hour, minute, 0, 0);

  if (Number.isNaN(selected.getTime())) {
    throw new Error(`Invalid date/time value: ${date.toISOString()} ${time}`);
  }

  return selected.toISOString();
}

export function buildLocalDatePartsIso(
  year: number,
  monthIndex: number,
  day: number,
  time: string,
) {
  const { hour, minute } = parseDisplayTime(time);
  const selected = new Date(year, monthIndex, day, hour, minute, 0, 0);

  if (Number.isNaN(selected.getTime())) {
    throw new Error(`Invalid date/time value: ${year}-${monthIndex + 1}-${day} ${time}`);
  }

  return selected.toISOString();
}

export function formatDisplayTime(date: Date) {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;

  return `${hour12}:${minutes} ${period}`;
}
