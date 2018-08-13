import * as _ from 'lodash';
import {ICardItem} from 'src/models';
import ItemPeopleAssociator from 'src/services/ItemPeopleAssociator';

export interface IBillingItem {
    id: number;
    price: number;
}

interface IBillingHuman {
    id: number;
    money: number;
}

export default class Billing {
    private associator: ItemPeopleAssociator;
    private items: Record<number, IBillingItem> = {};
    private people: IBillingHuman[] = [];

    constructor() {
        this.associator = new ItemPeopleAssociator();
    }

    public addItem(item: IBillingItem): Record<number, number> {
        this.items[item.id] = item;

        return this.recalculate();
    }

    public removeItem(cardItem: ICardItem): Record<number, number> {
        for (const itemId of Object.keys(this.items)) {
            if (this.items[itemId].id === cardItem.id) {
                delete this.items[itemId];
            }
        }
        this.associator.remove(cardItem);

        return this.recalculate();
    }

    public addHuman(human: IBillingHuman): Record<number, number> {
        this.people.push(human);

        return this.recalculate();
    }

    public removeHuman(cardItem: ICardItem): Record<number, number> {
        _.remove(this.people, (human: IBillingHuman) => human.id === cardItem.id);
        this.associator.remove(cardItem);

        return this.recalculate();
    }

    public addAssociation(itemId: number, peopleId: number): Record<number, number> {
        this.associator.add({itemId, peopleId});

        return this.recalculate();
    }

    public removeAssociation(cardItem: ICardItem): Record<number, number> {
        this.associator.remove(cardItem);

        return this.recalculate();
    }

    public getIdsFromAssociations(cardItem: ICardItem | null) {
        return this.associator.getIdsFromAssociations(cardItem);
    }

    /**
     * @returns {Record<number, number>} { [people id]: money to be payed }
     */
    private recalculate(): Record<number, number> {
        const splittedBill: Record<number, number> = [];
        const priceForAll = _.sumBy(this.associator.filterItemsWithoutAssociation(this.items), 'price');
        const peopleItems = this.associator.getAssociationsGroupedByPeopleId();
        const preparedPeopleItems = peopleItems.map(
            (itemIds: number[]) => itemIds.map((itemId: number) => this.items[itemId])
        );

        for (const human of this.people) {
            splittedBill[human.id] = priceForAll + (
                preparedPeopleItems[human.id] ? _.sumBy(preparedPeopleItems[human.id], 'price') : 0
            ) - human.money;
        }

        return splittedBill;
    }
}
