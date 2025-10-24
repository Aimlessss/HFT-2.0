export class MarketTime {
    static getISTDate(): Date {
        const now = new Date();
        const offset = 5.5 * 60; // IST offset in minutes
        return new Date(now.getTime() + offset * 60 * 1000);
    }

    static isMarketOpen(now: Date = MarketTime.getISTDate()): boolean {
        const hour = now.getHours();
        const minute = now.getMinutes();
        const day = now.getDay(); // 0 = Sunday, 6 = Saturday

        if (day === 0 || day === 6) return false;

        const start = 9 * 60 + 15;
        const end = 15 * 60 + 30;
        const current = hour * 60 + minute;

        return current >= start && current <= end;
    }

    static msUntilNextMarketOpen(): number {
        const now = MarketTime.getISTDate();
        const nextOpen = new Date(now);
        nextOpen.setHours(9, 15, 0, 0); // Market opens at 9:15 AM IST

        // If current time is after today's market open, start checking from tomorrow
        if (now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() >= 15)) {
            nextOpen.setDate(nextOpen.getDate() + 1);
        }

        // Skip to Monday if it's Saturday or Sunday
        while (nextOpen.getDay() === 0 || nextOpen.getDay() === 6) {
            nextOpen.setDate(nextOpen.getDate() + 1);
        }

        return nextOpen.getTime() - now.getTime();
    }
}
