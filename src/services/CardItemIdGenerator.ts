export default class CardItemIdGenerator {
    public static getId(): number {
        const id = CardItemIdGenerator.lastId;
        CardItemIdGenerator.lastId++;

        return id;
    }

    private static lastId = 0;
}
