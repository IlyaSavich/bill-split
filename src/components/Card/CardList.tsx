import * as _ from 'lodash';
import * as React from 'react';
import CardFormRow from 'src/components/Card/CardFormRow';
import CardTextRow from 'src/components/Card/CardTextRow';
import {ICardItem} from 'src/models';

export interface IProps {
    cardTitle: string;
    ids: number[] | null;
    isCreating: boolean;
    isClearing: boolean;
    onCreated: (cardItem: ICardItem) => void;
    onCancelCreating: () => void;
    afterClearing: () => void;
    onAddingAssociation: (itemId: number, peopleId: number) => void;
    onRemoveItem: (cardItem: ICardItem) => void;
    onSelectedCardItem: (cardItem: ICardItem, cardItemRef: HTMLLIElement | null) => void;
}

interface IState {
    isCreating: boolean;
    isClearing: boolean;
}

class CardList<P extends IProps> extends React.Component<P, IState> {
    public state = {
        isClearing: false,
        isCreating: false,
    };

    protected cardItems: ICardItem[] = [];

    public componentWillReceiveProps(nextProps: IProps): void {
        this.setState({...this.state, isCreating: nextProps.isCreating});

        if (nextProps.isClearing) {
            this.cardItems = [];
        }
    }

    public componentDidUpdate(): void {
        if (this.props.isClearing) {
            this.props.afterClearing();
        }
    }

    public render() {
        const cardComponents: JSX.Element[] = this.appendCardFormRow(this.getCardRows());

        return (<div>{cardComponents}</div>);
    }

    protected getCardRows(): JSX.Element[] {
        return this.cardItems.filter((cardItem: ICardItem) => {
            return this.props.ids === null ? true : this.props.ids.includes(cardItem.id);
        }).map(
            (cardItem: ICardItem) =>
                <CardTextRow key={cardItem.id}
                             cardItem={cardItem}
                             onRemove={this.onRemoveRow}
                             onAddingAssociation={this.props.onAddingAssociation}
                             onSelectedCardItem={this.props.onSelectedCardItem}
                />,
        )
    }

    protected onRemoveRow = (removedCardItem: ICardItem) => {
        _.remove(this.cardItems, (cardItem: ICardItem) => cardItem.id === removedCardItem.id);
        this.props.onRemoveItem(removedCardItem);

        this.forceUpdate();
    };

    private appendCardFormRow(cardComponents: JSX.Element[]): JSX.Element[] {
        if (this.state.isCreating) {
            cardComponents.push(
                <CardFormRow key="card-form"
                             onCreated={this.onCreated}
                             onCancel={this.onCancelCreating}
                             cardTitle={this.props.cardTitle}/>,
            );
        }

        return cardComponents;
    }

    private onCreated = (cardItem: ICardItem) => {
        this.cardItems.push(cardItem);

        this.setState({...this.state, isCreating: false});
        this.props.onCreated(cardItem);
    };

    private onCancelCreating = () => {
        this.setState({...this.state, isCreating: false});
        this.props.onCancelCreating();
    };
}

export default CardList;
