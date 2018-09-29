import * as _ from 'lodash';
import * as associationHelper from 'services/association/ItemHumanAssociationHelper';
import cardItemStorage from 'services/CardItemStorage';

interface IPriceable {
    price: number;
}

function sumByPrice(array: IPriceable[]) {
    return _.sumBy(array, 'price');
}

class Billing {
    /**
     * @returns {Record<number, number>} { [people id]: money to be payed }
     */
    public recalculate(): Record<number, number> {
        const splittedBill: Record<number, number> = {};
        const items = cardItemStorage.getItems();
        const people = cardItemStorage.getPeople();
        const commonCredit = sumByPrice(
            associationHelper.filterItemsWithoutAssociation(items),
        ) / people.length;
        const peopleCredit = _.mapValues(
            associationHelper.getAssociationsGroupedByPeopleId(),
            itemIds => sumByPrice(itemIds.map(itemId => items[itemId])),
        );

        for (const human of people) {
            splittedBill[human.id] =
                human.price - commonCredit - (peopleCredit[human.id] || 0);
        }

        return splittedBill;
    }
}

export default new Billing();
