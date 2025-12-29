import {
  CommissionPeriodUtil,
  CommissionPeriod,
} from "../../doctor/utils/CommissionPeriodUtil";

export interface RevenueTimelineEntry {
  period: string;
  amount: number;
}

interface RevenueData {
  createdAt: Date;
  totalAmount: number;
}

export class RevenuePeriodUtil {
  static groupRevenueByPeriod(
    revenueData: RevenueData[],
    period: CommissionPeriod,
    startDate?: Date,
    endDate?: Date
  ): RevenueTimelineEntry[] {
    const timelineMap = new Map<
      string,
      { amount: number; sortKey: string }
    >();

    revenueData.forEach((data) => {
      const { key, sortKey } = this._getPeriodKey(data.createdAt, period);

      if (!timelineMap.has(key)) {
        timelineMap.set(key, {
          amount: 0,
          sortKey,
        });
      }

      const entry = timelineMap.get(key)!;
      entry.amount += data.totalAmount;
    });

    const filledTimeline = this._fillMissingPeriods(
      timelineMap,
      period,
      startDate,
      endDate
    );

    return this._sortTimeline(filledTimeline, period);
  }

  private static _getPeriodKey(
    date: Date,
    period: CommissionPeriod
  ): { key: string; sortKey: string } {
    if (period === "yearly") {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      return { key, sortKey };
    } else if (period === "monthly") {
      const weekNumber = Math.ceil(date.getDate() / 7);
      const key = `Week ${weekNumber}`;
      const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(weekNumber).padStart(2, "0")}`;
      return { key, sortKey };
    } else {
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayOfWeek = date.getDay();
      const key = dayNames[dayOfWeek];
      if (period === "weekly") {
        const dayOrder = dayOfWeek === 0 ? 7 : dayOfWeek;
        const sortKey = `${String(dayOrder).padStart(2, "0")}`;
        return { key, sortKey };
      } else {
        const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        return { key, sortKey };
      }
    }
  }

  private static _fillMissingPeriods(
    timelineMap: Map<string, { amount: number; sortKey: string }>,
    period: CommissionPeriod,
    startDate?: Date,
    endDate?: Date
  ): Map<string, { amount: number; sortKey: string }> {
    if (!startDate || !endDate) {
      return timelineMap;
    }

    const filledMap = new Map(timelineMap);
    const current = new Date(startDate);
    const end = new Date(endDate);

    if (period === "yearly") {
      current.setDate(1);
      while (current <= end) {
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const key = `${monthNames[current.getMonth()]} ${current.getFullYear()}`;
        const sortKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;

        if (!filledMap.has(key)) {
          filledMap.set(key, {
            amount: 0,
            sortKey,
          });
        }
        current.setMonth(current.getMonth() + 1);
        current.setDate(1);
      }
    } else if (period === "monthly") {
      const startMonth = current.getMonth();
      const startYear = current.getFullYear();

      for (let week = 1; week <= 4; week++) {
        const key = `Week ${week}`;
        const sortKey = `${startYear}-${String(startMonth + 1).padStart(2, "0")}-${String(week).padStart(2, "0")}`;

        if (!filledMap.has(key)) {
          filledMap.set(key, {
            amount: 0,
            sortKey,
          });
        }
      }
    } else if (period === "weekly") {
      const dayNames = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const dayOrder: Record<string, number> = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7,
      };

      for (const dayName of dayNames) {
        const sortKey = `${String(dayOrder[dayName]).padStart(2, "0")}`;
        if (!filledMap.has(dayName)) {
          filledMap.set(dayName, {
            amount: 0,
            sortKey,
          });
        }
      }
    } else {
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      while (current <= end) {
        const dayOfWeek = current.getDay();
        const key = dayNames[dayOfWeek];
        const sortKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;

        if (!filledMap.has(key)) {
          filledMap.set(key, {
            amount: 0,
            sortKey,
          });
        }

        current.setDate(current.getDate() + 1);
      }
    }

    return filledMap;
  }

  private static _sortTimeline(
    filledTimeline: Map<string, { amount: number; sortKey: string }>,
    period: CommissionPeriod
  ): RevenueTimelineEntry[] {
    let sortedTimeline = Array.from(filledTimeline.entries()).map(
      ([period, value]) => ({
        period,
        amount: value.amount,
        sortKey: value.sortKey,
      })
    );

    if (period === "weekly") {
      const dayOrder: Record<string, number> = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7,
      };
      sortedTimeline = sortedTimeline.sort((a, b) => {
        const orderA = dayOrder[a.period] || 999;
        const orderB = dayOrder[b.period] || 999;
        return orderA - orderB;
      });
    } else if (period === "monthly") {
      sortedTimeline = sortedTimeline.sort((a, b) => {
        const weekA = parseInt(a.period.replace("Week ", "")) || 999;
        const weekB = parseInt(b.period.replace("Week ", "")) || 999;
        return weekA - weekB;
      });
    } else {
      sortedTimeline = sortedTimeline.sort((a, b) =>
        a.sortKey.localeCompare(b.sortKey)
      );
    }

    return sortedTimeline.map(({ sortKey, ...rest }) => rest);
  }
}



