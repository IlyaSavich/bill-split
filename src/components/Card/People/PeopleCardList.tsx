import * as React from 'react';
import * as _ from 'lodash';
import CardList, { IProps as BaseIProps } from 'src/components/Card/CardList';
import CardTextRow from 'src/components/Card/CardTextRow/CardTextRow';
import { ICardItem } from 'src/models';

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
                const isSelected = _.isEqual(_.omit(this.props.selectedCardItem, 'price'), _.omit(cardItem, 'price'))
                return <CardTextRow key={cardItem.id}
                    cardItem={newCardItem}
                    isSelected={isSelected}
                    onRemove={this.onRemoveRow}
                    onAddingAssociation={this.props.onAddingAssociation}
                    onRemovingAssociation={this.props.onRemovingAssociation}
                    onSelectedCardItem={this.props.onSelectedCardItem}
                />;
            },
        )
    }
}
