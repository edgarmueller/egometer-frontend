import { getWeek } from "../../common/date"

describe('getWeek', () => {
    it('should return year and week based on a given date ', () => {
        const [year, month, week] = getWeek(new Date(Date.UTC(2019, 11, 23)));
        expect(year).toBe(2019);
        expect(week).toBe(52);
    });

    it('should return year and week based for last iso calendar week', () => {
        const [year, month, week] = getWeek(new Date(Date.UTC(2019, 11, 30)));
        expect(year).toBe(2020);
        expect(week).toBe(1);
    });
})