import * as _ from 'lodash';
import { CardTitle, ICardItem } from 'models';
import associator, { IItemHumanAssociation } from 'services/association/ItemHumanAssociator';

interface IAssociationAccessor {
    associationKey: string;
    defaultValue: ISelectedIds;
    result: {
        arrayKey: string;
        associationKey: string;
    };
}

interface ISelectedIds {
    itemIds: number[] | null;
    peopleIds: number[] | null;
}

const ASSOCIATION_ACCESSOR_MAP: Record<CardTitle, IAssociationAccessor> = {
    [CardTitle.items]: {
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
    [CardTitle.people]: {
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
 * Get selected ids from association. Used to getForCardTitle selected rows on click any list row
 */
export function getSelectedIdsFromAssociations(cardItem: ICardItem | null): ISelectedIds {
    if (!cardItem) {
        return { itemIds: null, peopleIds: null };
    }

    const propertyAccessor = ASSOCIATION_ACCESSOR_MAP[cardItem.cardTitle];
    const associations = associator.getAll();
    return associations.reduce((carry: ISelectedIds, association: IItemHumanAssociation) => {
        const checkId = association[propertyAccessor.associationKey];

        if (checkId !== cardItem.id) {
            return carry;
        }

        carry[propertyAccessor.result.arrayKey].push(association[propertyAccessor.result.associationKey]);

        return carry;
    }, _.cloneDeep(propertyAccessor.defaultValue)) || associations;
}

/**
 * Get items that not associated with any human. Used for calculation when needed to calc general items
 */
export function filterItemsWithoutAssociation(items: ICardItem[]) {
    return _.filter(items, item =>
        !associator.getAll().some(association => association.itemId === item.id),
    );
}

export function getAssociationsGroupedByPeopleId(): Record<number, number[]> {
    return associator.getAll().reduce((result, association) => {
        if (!result[association.peopleId]) {
            result[association.peopleId] = [];
        }

        result[association.peopleId].push(association.itemId);

        return result;
    }, {});
}
