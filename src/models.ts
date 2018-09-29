export enum CardTitle {
    items = 'items',
    people = 'people',
}

export interface ICardItem {
    cardTitle: CardTitle;
    id: number;
    title: string;
    price: number;
}
