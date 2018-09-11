import * as _ from 'lodash';
import { ICardItem } from 'src/models';
import * as associationHelper from 'src/services/association/ItemHumanAssociationHelper';
import associator from 'src/services/association/ItemHumanAssociator';

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
        associator.remove(cardItem);

        return this.recalculate();
    }

    public addHuman(human: IBillingHuman): Record<number, number> {
        this.people.push(human);

        return this.recalculate();
    }

    public removeHuman(cardItem: ICardItem): Record<number, number> {
        _.remove(this.people, (human: IBillingHuman) => human.id === cardItem.id);
        associator.remove(cardItem);

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

    public removeAllAssociations(cardItem: ICardItem): Record<number, number> {
        associator.remove(cardItem);

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
}
