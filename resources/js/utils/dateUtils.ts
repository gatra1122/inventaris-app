import { DateTime } from 'luxon';

export const formatWIB = (dateISO: string) => {
  return DateTime.fromISO(dateISO, { zone: "utc" })
                .setZone("Asia/Jakarta")
                .setLocale('id')
                .toFormat("dd MMM yyyy, HH:mm ")+"WIB";
};