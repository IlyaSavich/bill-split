import * as _ from 'lodash';
import { ICardItem } from 'src/models';
import associator, { IItemHumanAssociation } from 'src/services/association/ItemHumanAssociator';
import { IBillingItem } from 'src/services/Billing';

interface IAssociationAccessor {
    associationKey: string,
    defaultValue: ISelectedIds,
    result: {
        arrayKey: string,
        associationKey: string,
    },
}

interface ISelectedIds {
    itemIds: number[] | null;
    peopleIds: number[] | null;
}

const ASSOCIATION_ACCESSOR_MAP = {
    Items: {
        associationKey: 'itemId',
        defaultValue: {
            itemIds: null,
            peopleIds: [],
        },
        result: {
            arrayKey: 'peopleIds',
            associationKey: 'peopleId',
        },
    },
    People: {
        associationKey: 'peopleId',
        defaultValue: {
            itemIds: [],
            peopleIds: null,
        },
        result: {
            arrayKey: 'itemIds',
            associationKey: 'itemId',
        },
    },
};

/**
 * Get selected ids from association. Used to get selected rows on click any list row
 */
export function getSelectedIdsFromAssociations(cardItem: ICardItem | null): ISelectedIds {
    if (!cardItem) {
        return { itemIds: null, peopleIds: null };
    }

    const propertyAccessor = ASSOCIATION_ACCESSOR_MAP[cardItem.cardTitle] as IAssociationAccessor;
    const associations = associator.getAll();

    return associations.reduce((carry: ISelectedIds, association: IItemHumanAssociation) => {
        const checkId = association[propertyAccessor.associationKey];

        if (checkId !== cardItem.id) {
            return carry;
        }

        carry[propertyAccessor.result.arrayKey].push(association[propertyAccessor.result.associationKey]);

        return carry;
    }, { ...propertyAccessor.defaultValue }) || associations;
}

/**
 * Get items that not associated with any human. Used for calculation when needed to calc general items
 */
export function filterItemsWithoutAssociation(items: Record<number, IBillingItem>) {
    return _.filter(items, (item: IBillingItem) => {
        return _.find(
            associator.getAll(), (association: IItemHumanAssociation) => association.itemId === item.id,
        ) === undefined;
    });
}

export function getAssociationsGroupedByPeopleId(): number[][] {
    return _.map(
        _.groupBy(associator.getAll(), 'peopleId'),
        (associations: IItemHumanAssociation[]) => _.map(associations, _.property('itemId')),
    );
}
