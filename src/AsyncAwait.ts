class AsyncAwaitSample {

    public async add() {
        const result1 = await Promise.resolve(12);
        const result2 = await Promise.resolve(52);

        return result1 + result2;
    }

    public async tryAdd() {
        try {
            const result= await this.add();
            return result;
        } catch (e) {
            return 0;
        }
    }
}