import { ICardItem } from 'src/models';

export interface IItemHumanAssociation {
    itemId: number;
    peopleId: number;
}

export default new class ItemHumanAssociator {
    private associations: IItemHumanAssociation[] = [];

    public add(association: IItemHumanAssociation) {
        this.associations.push(association);
    }

    /**
     * Remove all associations for selected card item
     */
    public remove(cardItem: ICardItem) {
        const associationKey = this.getAssociationKey(cardItem)
        this.associations = this.associations.filter(
            association => association[associationKey] !== cardItem.id
        );
    }

    public removeAssociation(targetItem: ICardItem, selectedItem: ICardItem) {
        const targetKey = this.getAssociationKey(targetItem)
        const selectedItemKey = this.getAssociationKey(selectedItem)
        this.associations = this.associations.filter(
            association => association[selectedItemKey] !== selectedItem!.id ||
                association[targetKey] !== targetItem.id
        );
    }

    public getAll(): IItemHumanAssociation[] {
        return [...this.associations];
    }

    private getAssociationKey(cardItem: ICardItem): string {
        return cardItem.cardTitle === 'Items' ? 'itemId' : 'peopleId';
    }
}
