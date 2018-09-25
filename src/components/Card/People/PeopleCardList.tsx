import CardList, { IProps as BaseIProps } from 'components/Card/CardList';
import { ICardItem } from 'models';

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
                if (this.canAddEditRow(this.state.editCardItem, cardItem)) {
                    return this.getEditCardRow(this.state.editCardItem!);
                }
                return this.getCardRow(newCardItem);
            },
        );
    }
}
