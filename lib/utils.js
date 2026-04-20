import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if the restaurant is currently open based on schedule and manual toggle.
 * schedule: { "0": ["10:00", "22:00"], "1": ["10:00", "22:00"], ... } where 0 is Sunday
 */
export function isRestaurantOpen(schedule, manualOverride = true) {
  if (manualOverride === false || manualOverride === 'false') return false;
  if (!schedule) return true; // Default to open if no schedule set

  const now = new Date();
  const day = now.getDay(); // 0-6
  const hours = now.getHours();
  const mins = now.getMinutes();
  const currentTime = hours * 60 + mins;

  const daySchedule = schedule[day.toString()] || schedule[day];
  if (!daySchedule || daySchedule === 'closed') return false;

  const [openStr, closeStr] = daySchedule;
  const [openH, openM] = openStr.split(':').map(Number);
  const [closeH, closeM] = closeStr.split(':').map(Number);

  const openTime = openH * 60 + openM;
  const closeTime = closeH * 60 + closeM;

  if (closeTime < openTime) {
    // Overnight shift (e.g. 18:00 - 02:00)
    return currentTime >= openTime || currentTime <= closeTime;
  }

  return currentTime >= openTime && currentTime <= closeTime;
}

export function formatOpeningHours(schedule, lang = 'en') {
  if (!schedule) return '';
  const days = lang === 'ar' 
    ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return Object.entries(schedule).map(([d, times]) => {
    const dayName = days[parseInt(d)];
    if (times === 'closed') return `${dayName}: ${lang === 'ar' ? 'مغلق' : 'Closed'}`;
    return `${dayName}: ${times[0]} - ${times[1]}`;
  }).join('\n');
}
