import * as React from 'react';
import CardList, {IProps as BaseIProps} from 'src/components/Card/CardList';
import CardTextRow from 'src/components/Card/CardTextRow';
import {ICardItem} from 'src/models';

interface IProps extends BaseIProps {
    splittedBill: Record<number, number>;
}

export default class PeopleCardList extends CardList<IProps> {
    protected getCardRows(): JSX.Element[] {
        return this.cardItems.filter((cardItem: ICardItem) => {
            return this.props.ids === null ? true : this.props.ids.includes(cardItem.id);
        }).map(
            (cardItem: ICardItem) => {
                const newCardItem: ICardItem = { ...cardItem, price: this.props.splittedBill[cardItem.id] };

                return <CardTextRow key={cardItem.id}
                                    cardItem={newCardItem}
                                    onRemove={this.onRemoveRow}
                                    onAddingAssociation={this.props.onAddingAssociation}
                                    onSelectedCardItem={this.props.onSelectedCardItem}
                />;
            },
        )
    }
}
