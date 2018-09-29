import CardList, { IProps as BaseIProps } from 'components/Card/CardList';
import { ICardItem } from 'models';
import * as React from 'react';
import CardTextRow from 'components/Card/CardTextRow/CardTextRow';

interface IProps extends BaseIProps {
    splittedBill: Record<number, number>;
}

export default class PeopleCardList extends CardList<IProps> {
    protected getCardRow(cardItem: ICardItem): JSX.Element {
        const bill = this.props.splittedBill[cardItem.id];

        return <CardTextRow
            key={cardItem.id}
            cardItem={cardItem}
            bill={bill}
            isSelected={!!this.props.selectedCardItem && this.props.selectedCardItem.id === cardItem.id}
            onRemove={this.onRemoveRow}
            onAddingAssociation={this.props.onAddingAssociation}
            onRemovingAssociation={this.props.onRemovingAssociation}
            onSelectedCardItem={this.props.onSelectedCardItem}
            onClickEdit={this.onClickEdit}
        />;
    }
}
