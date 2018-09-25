import { ICardItem } from 'models';
import * as _ from 'lodash';

export interface IItemHumanAssociation {
    itemId: number;
    peopleId: number;
}

export default new class ItemHumanAssociator {
    private associations: IItemHumanAssociation[] = [];

    public add(association: IItemHumanAssociation) {
        if (!this.associations.some(current => _.isEqual(current, association))) {
            this.associations.push(association);
        }
    }

    /**
     * Remove all associations for selected card item
     */
    public removeAllForCardItem(cardItem: ICardItem) {
        const associationKey = this.getAssociationKey(cardItem);
        this.associations = this.associations.filter(
            association => association[associationKey] !== cardItem.id,
        );
    }

    public removeAll() {
        this.associations = [];
    }

    public removeAssociation(targetItem: ICardItem, selectedItem: ICardItem) {
        const targetKey = this.getAssociationKey(targetItem);
        const selectedItemKey = this.getAssociationKey(selectedItem);
        this.associations = this.associations.filter(
            association => association[selectedItemKey] !== selectedItem.id ||
                association[targetKey] !== targetItem.id,
        );
    }

    public getAll(): IItemHumanAssociation[] {
        return [...this.associations];
    }

    private getAssociationKey(cardItem: ICardItem): string {
        return cardItem.cardTitle.toLowerCase() === 'items' ? 'itemId' : 'peopleId';
    }
};
