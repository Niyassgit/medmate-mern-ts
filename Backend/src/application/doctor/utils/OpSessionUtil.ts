export function formatTo12Hour(time: string): string {
  const [hourStr, minuteStr] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr || "00";
  const suffix = hour >= 12 ? "pm" : "am";

  if (hour === 0) hour = 12; 
  else if (hour > 12) hour -= 12; 

  const displayMinute = minute === "00" ? "" : `:${minute}`;
  return `${hour}${displayMinute}${suffix}`;
}

export function getOpSession(opStartTime?: string, opEndTime?: string): string | null {
  if (!opStartTime || !opEndTime) return null;

  const startHour = parseInt(opStartTime.split(":")[0], 10);
  const isEvening = startHour >= 12;

  const startFormatted = formatTo12Hour(opStartTime);
  const endFormatted = formatTo12Hour(opEndTime);

  return `${startFormatted} to ${endFormatted} (${isEvening ? "Evening" : "Morning"} Session)`;
}
