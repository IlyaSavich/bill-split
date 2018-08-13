import * as _ from 'lodash';
import {ICardItem} from 'src/models';
import {IBillingItem} from 'src/services/Billing';

interface ISelectedIds {
    itemIds: number[] | null;
    peopleIds: number[] | null;
}

interface IItemPeopleAssociation {
    itemId: number;
    peopleId: number;
}

export default class ItemPeopleAssociator {
    private associations: IItemPeopleAssociation[] = [];

    public getIdsFromAssociations(cardItem: ICardItem | null): ISelectedIds {
        if (!cardItem) {
            return {itemIds: null, peopleIds: null};
        }

        const propertyAccessor = this.getAssociationPropertyAccessor(cardItem);

        return this.associations.reduce((carry: ISelectedIds, association: IItemPeopleAssociation) => {
            const checkId = association[propertyAccessor.associationKey];

            if (checkId !== cardItem.id) {
                return carry;
            }

            carry[propertyAccessor.result.arrayKey].push(association[propertyAccessor.result.associationKey]);

            return carry;
        }, {itemIds: propertyAccessor.defaultValue.itemIds, peopleIds: propertyAccessor.defaultValue.peopleIds});
    }

    public filterItemsWithoutAssociation(items: Record<number, IBillingItem>) {
        return _.filter(items, (item: IBillingItem) => {
            return _.find(
                this.associations, (association: IItemPeopleAssociation) => association.itemId === item.id
            ) === undefined;
        });
    }

    public getAssociationsGroupedByPeopleId(): number[][] {
        return _.map(
            _.groupBy(this.associations, 'peopleId'),
            (associations: IItemPeopleAssociation[]) => _.map(associations, _.property('itemId'))
        );
    }

    public add(association: IItemPeopleAssociation) {
        this.associations.push(association);
    }

    public remove(cardItem: ICardItem) {
        const associationKey = cardItem.cardTitle === 'Items' ? 'itemId' : 'peopleId';

        _.remove(
            this.associations, (association: IItemPeopleAssociation) => association[associationKey] === cardItem.id
        );
    }

    private getAssociationPropertyAccessor(cardItem: ICardItem) {
        return cardItem.cardTitle === 'Items' ? {
            associationKey: 'itemId',
            defaultValue: {
                itemIds: null,
                peopleIds: [],
            },
            result: {
                arrayKey: 'peopleIds',
                associationKey: 'peopleId',
            },
        } : {
            associationKey: 'peopleId',
            defaultValue: {
                itemIds: [],
                peopleIds: null,
            },
            result: {
                arrayKey: 'itemIds',
                associationKey: 'itemId',
            },
        };
    }
}
