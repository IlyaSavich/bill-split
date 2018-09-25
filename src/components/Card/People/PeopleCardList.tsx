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
                const editCardItem = this.state.editCardItem as ICardItem | null;
                if (this.canAddEditRow(editCardItem, cardItem)) {
                    return this.getEditCardRow(editCardItem!);
                }
                return this.getCardRow(newCardItem);
            },
        );
    }
}
