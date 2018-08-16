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
        const associationKey = cardItem.cardTitle === 'Items' ? 'itemId' : 'peopleId';

        this.associations = this.associations.filter(
            (association: IItemHumanAssociation) => association[associationKey] !== cardItem.id
        );
    }

    public getAll(): IItemHumanAssociation[] {
        return [...this.associations];
    }
}
