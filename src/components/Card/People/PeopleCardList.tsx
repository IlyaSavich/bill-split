import CardList, { IProps as BaseIProps } from 'components/Card/CardList';
import { ICardItem } from 'models';
import cardItemStorage from 'services/CardItemStorage';

interface IProps extends BaseIProps {
    splittedBill: Record<number, number>;
}

export default class PeopleCardList extends CardList<IProps> {
    protected getCardRows(): JSX.Element[] {
        return cardItemStorage.getPeople().filter(cardItem => {
            return this.props.ids === null ? true : this.props.ids.includes(cardItem.id);
        }).map(cardItem => {
            const newCardItem: ICardItem = { ...cardItem, price: this.props.splittedBill[cardItem.id] };

            return this.canAddEditRow(this.state.editCardItem, cardItem) ?
                this.getEditCardRow(this.state.editCardItem!) :
                this.getCardRow(newCardItem);
        });
    }
}
