import * as _ from 'lodash';
import {CardTitle, ICardItem} from 'models';

class CardItemStorage {
    private cardItemsGrouped: Record<CardTitle, ICardItem[]> = {
        [CardTitle.items]: [],
        [CardTitle.people]: [],
    };

    public add(cardItem: ICardItem) {
        this.cardItemsGrouped[cardItem.cardTitle].push(cardItem);
    }

    public update(newCardItem: ICardItem) {
        const cardTitle = newCardItem.cardTitle;

        this.cardItemsGrouped[cardTitle] = this.cardItemsGrouped[cardTitle]
            .map(cardItem => cardItem.id === newCardItem.id ? newCardItem : cardItem);
    }

    public getItems() {
        return this.getForCardTitle(CardTitle.items);
    }

    public getPeople() {
        return this.getForCardTitle(CardTitle.people);
    }

    public getForCardTitle(cardTitle: CardTitle): ICardItem[] {
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
