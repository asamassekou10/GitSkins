/**
 * GitSkins - Streak Calculator
 *
 * Calculates contribution streaks from GitHub contribution data.
 */

import type { ContributionWeek, StreakData } from '@/types';

/**
 * Calculate streak statistics from contribution calendar data
 *
 * @param weeks - Array of contribution weeks from GitHub API
 * @returns StreakData with current streak, longest streak, and total active days
 */
export function calculateStreaks(weeks: ContributionWeek[]): StreakData {
  // Flatten all days and sort by date (oldest first)
  const allDays = weeks
    .flatMap((week) => week.contributionDays)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (allDays.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalActiveDays: 0,
    };
  }

  let longestStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;
  let totalActiveDays = 0;

  // Calculate longest streak and total active days
  for (const day of allDays) {
    if (day.contributionCount > 0) {
      tempStreak++;
      totalActiveDays++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // Calculate current streak (from most recent day backwards)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Reverse to start from most recent
  const reversedDays = [...allDays].reverse();

  for (let i = 0; i < reversedDays.length; i++) {
    const day = reversedDays[i];
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);

    // If the most recent day has no contributions, current streak is 0
    // But allow for today having no contributions yet (check if it's today or yesterday)
    if (i === 0) {
      const daysDiff = Math.floor((today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));

      // If the most recent data is from more than 1 day ago with no contributions, streak is 0
      if (daysDiff > 1 && day.contributionCount === 0) {
        currentStreak = 0;
        break;
      }

      // If today/yesterday has no contributions, check if streak was broken
      if (day.contributionCount === 0) {
        // Continue to check previous days
        continue;
      }
    }

    if (day.contributionCount > 0) {
      currentStreak++;
    } else {
      // Streak broken
      break;
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalActiveDays,
  };
}
