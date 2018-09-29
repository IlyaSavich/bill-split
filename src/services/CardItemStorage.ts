import * as _ from 'lodash';
import {CardTitle, ICardItem} from 'models';

class CardItemStorage {
    private cardItemsGrouped: Record<CardTitle, ICardItem[]> = {
        [CardTitle.items]: [],
        [CardTitle.people]: [],
    };

    /**
     * Update or add new card item
     */
    public set(newCardItem: ICardItem) {
        const cardTitle = newCardItem.cardTitle;
        this.cardItemsGrouped[cardTitle] = this.cardItemsGrouped[cardTitle]
            .filter(cardItem => cardItem.id !== newCardItem.id);

        this.cardItemsGrouped[cardTitle].push(newCardItem);
    }

    public getItems() {
        return this.get(CardTitle.items);
    }

    public getPeople() {
        return this.get(CardTitle.people);
    }

    public get(cardTitle: CardTitle): ICardItem[] {
        return _.cloneDeep(this.cardItemsGrouped[cardTitle]);
    }

    public remove(removedCardItem: ICardItem) {
        _.remove(
            this.cardItemsGrouped[removedCardItem.cardTitle],
            cardItem => cardItem.id === removedCardItem.id,
        );
    }

    public clear(cardTitle: CardTitle) {
        this.cardItemsGrouped[cardTitle] = [];
    }
}

export default new CardItemStorage();
