import * as _ from 'lodash';
import { ICardItem } from 'models';
import * as associationHelper from 'services/association/ItemHumanAssociationHelper';
import associator from 'services/association/ItemHumanAssociator';

export interface IBillingItem {
    id: number;
    price: number;
}

interface IBillingHuman {
    id: number;
    money: number;
}

export default new class Billing {
    private items: Record<number, IBillingItem> = {};
    private people: IBillingHuman[] = [];

    public putItem(item: IBillingItem): Record<number, number> {
        this.items[item.id] = item;

        return this.recalculate();
    }

    public removeItem(cardItem: ICardItem): Record<number, number> {
        for (const itemId of Object.keys(this.items)) {
            if (this.items[itemId].id === cardItem.id) {
                delete this.items[itemId];
            }
        }
        associator.removeAllForCardItem(cardItem);

        return this.recalculate();
    }

    public putHuman(human: IBillingHuman): Record<number, number> {
        const replaceIndex = this.people.findIndex(current => current.id === human.id);
        replaceIndex === -1 ? this.people.push(human) : this.people[replaceIndex] = human;

        return this.recalculate();
    }

    public removeHuman(cardItem: ICardItem): Record<number, number> {
        _.remove(this.people, (human: IBillingHuman) => human.id === cardItem.id);
        associator.removeAllForCardItem(cardItem);

        return this.recalculate();
    }

    public addAssociation(itemId: number, peopleId: number): Record<number, number> {
        associator.add({ itemId, peopleId });

        return this.recalculate();
    }

    public removeAssociation(cardItem: ICardItem, selectedCardItem: ICardItem): Record<number, number> {
        associator.removeAssociation(cardItem, selectedCardItem);

        return this.recalculate();
    }

    public removeAllAssociationsForCardItem(cardItem: ICardItem): Record<number, number> {
        associator.removeAllForCardItem(cardItem);

        return this.recalculate();
    }

    public removeAllAssociations(): Record<number, number> {
        associator.removeAll();

        return this.recalculate();
    }

    /**
     * @returns {Record<number, number>} { [people id]: money to be payed }
     */
    private recalculate(): Record<number, number> {
        const splittedBill: Record<number, number> = [];
        const priceForAll = _.sumBy(associationHelper.filterItemsWithoutAssociation(this.items), 'price');
        const peopleItems = associationHelper.getAssociationsGroupedByPeopleId();
        const preparedPeopleItems = peopleItems.map(
            (itemIds: number[]) => itemIds.map((itemId: number) => this.items[itemId]),
        );

        for (const human of this.people) {
            splittedBill[human.id] = human.money - priceForAll - (
                preparedPeopleItems[human.id] ? _.sumBy(preparedPeopleItems[human.id], 'price') : 0
            );
        }

        return splittedBill;
    }
};
