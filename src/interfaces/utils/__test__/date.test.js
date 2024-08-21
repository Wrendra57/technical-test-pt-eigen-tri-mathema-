const { dueDateGenerator } = require('../date');

describe('dueDateGenerator', () => {
    it('should generate due date correctly', async () => {
        const days = 5;
        const { now, dueDate } = await dueDateGenerator(days);

        const expectedNow = new Date();
        const expectedDueDate = new Date();
        expectedDueDate.setDate(expectedNow.getDate() + days);

        expect(now.toDateString()).toBe(expectedNow.toDateString());
        expect(dueDate.toDateString()).toBe(expectedDueDate.toDateString());
    });

    it('should generate due date correctly for 0 days', async () => {
        const days = 0;
        const { now, dueDate } = await dueDateGenerator(days);

        const expectedNow = new Date();
        const expectedDueDate = new Date();
        expectedDueDate.setDate(expectedNow.getDate() + days);

        expect(now.toDateString()).toBe(expectedNow.toDateString());
        expect(dueDate.toDateString()).toBe(expectedDueDate.toDateString());
    });

    it('should generate due date correctly for negative days', async () => {
        const days = -3;
        const { now, dueDate } = await dueDateGenerator(days);

        const expectedNow = new Date();
        const expectedDueDate = new Date();
        expectedDueDate.setDate(expectedNow.getDate() + days);

        expect(now.toDateString()).toBe(expectedNow.toDateString());
        expect(dueDate.toDateString()).toBe(expectedDueDate.toDateString());
    });
});