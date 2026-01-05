import { ICommissionWithProduct } from "../../../domain/commission/entities/ICommissionWithProduct";

export type CommissionPeriod = "weekly" | "monthly" | "yearly" | "custom";

export interface DateRange {
  start: Date;
  end: Date;
}

export interface TimelineEntry {
  period: string;
  earnings: number;
  ordersCount: number;
}

export class CommissionPeriodUtil {
  static determinePeriod(start: Date, end: Date): CommissionPeriod {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return "weekly";
    if (diffDays <= 31) return "monthly";
    if (diffDays <= 365) return "yearly";
    return "custom";
  }

 
  static calculateDateRange(
    startDate?: string,
    endDate?: string
  ): DateRange {
    const now = new Date();
    let start: Date;
    let end: Date;

    if (!startDate && !endDate) {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
    } else {
      start = startDate
        ? new Date(startDate)
        : new Date(now.getFullYear(), now.getMonth(), 1);
      end = endDate
        ? new Date(endDate)
        : new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
    }

    return { start, end };
  }


  static groupCommissionsByPeriod(
    commissions: ICommissionWithProduct[],
    period: CommissionPeriod,
    startDate?: Date,
    endDate?: Date
  ): TimelineEntry[] {
    const timelineMap = new Map<
      string,
      { earnings: number; orders: Set<string>; sortKey: string }
    >();

    commissions.forEach((c) => {
      const date = c.createdAt;
      const { key, sortKey } = this._getPeriodKey(date, period);

      if (!timelineMap.has(key)) {
        timelineMap.set(key, {
          earnings: 0,
          orders: new Set(),
          sortKey,
        });
      }

      const entry = timelineMap.get(key)!;
      entry.earnings += c.doctorCut;
      entry.orders.add(c.orderId);
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
    timelineMap: Map<string, { earnings: number; orders: Set<string>; sortKey: string }>,
    period: CommissionPeriod,
    startDate?: Date,
    endDate?: Date
  ): Map<string, { earnings: number; orders: Set<string>; sortKey: string }> {
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
            earnings: 0,
            orders: new Set(),
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
            earnings: 0,
            orders: new Set(),
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
            earnings: 0,
            orders: new Set(),
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
            earnings: 0,
            orders: new Set(),
            sortKey,
          });
        }

        current.setDate(current.getDate() + 1);
      }
    }

    return filledMap;
  }

  private static _sortTimeline(
    filledTimeline: Map<string, { earnings: number; orders: Set<string>; sortKey: string }>,
    period: CommissionPeriod
  ): TimelineEntry[] {
    let sortedTimeline = Array.from(filledTimeline.entries()).map(
      ([period, value]) => ({
        period,
        earnings: value.earnings,
        ordersCount: value.orders.size,
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










