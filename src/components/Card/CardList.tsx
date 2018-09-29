import * as React from 'react';
import CardFormRow from 'components/Card/CardFormRow/CardFormRow';
import CardTextRow from 'components/Card/CardTextRow/CardTextRow';
import { CardTitle, ICardItem } from 'models';
import cardItemStorage from 'services/CardItemStorage';

export interface IProps {
    cardTitle: CardTitle;
    ids: number[] | null;
    isCreating: boolean;
    isClearing: boolean;
    selectedCardItem: ICardItem | null;
    onSaved: () => void;
    onCancelCreating: () => void;
    afterClearing: () => void;
    onAddingAssociation: () => void;
    onRemovingAssociation: (targetCardItem: ICardItem) => void;
    onRemoveItem: (cardItem: ICardItem) => void;
    onSelectedCardItem: (cardItem: ICardItem) => void;
    stopCreating: () => void;
}

interface IState {
    editCardItem: ICardItem | null;
}

class CardList<P extends IProps> extends React.Component<P, IState> {
    public state: IState = {
        editCardItem: null,
    };

    public componentDidUpdate(): void {
        if (this.props.isClearing) {
            cardItemStorage.clear(this.props.cardTitle);
            this.props.afterClearing();
        }
    }

    public render() {
        const cardComponents: JSX.Element[] = this.appendCardFormRow(this.getCardRows());

        return (<div>{cardComponents}</div>);
    }

    protected getCardRows(): JSX.Element[] {
        return cardItemStorage.getForCardTitle(this.props.cardTitle).filter(cardItem => {
            return this.props.ids === null ? true : this.props.ids.includes(cardItem.id);
        }).map(cardItem => {
            if (this.canAddEditRow(cardItem)) {
                return this.getEditCardRow()!;
            }

            return this.getCardRow(cardItem);
        });
    }

    protected canAddEditRow(cardItem: ICardItem): boolean {
        const editCardItem = this.state.editCardItem;

        return !!editCardItem && editCardItem.id === cardItem.id && !this.props.isCreating;
    }

    protected onRemoveRow = (removedCardItem: ICardItem) => {
        cardItemStorage.remove(removedCardItem);
        this.props.onRemoveItem(removedCardItem);
    }

    protected onClickEdit = (editCardItem: ICardItem) => {
        this.setState({ editCardItem });
        this.props.stopCreating();
    }

    protected getCardRow(cardItem: ICardItem): JSX.Element {
        return <CardTextRow
            key={cardItem.id}
            cardItem={cardItem}
            isSelected={!!this.props.selectedCardItem && this.props.selectedCardItem.id === cardItem.id}
            onRemove={this.onRemoveRow}
            onAddingAssociation={this.props.onAddingAssociation}
            onRemovingAssociation={this.props.onRemovingAssociation}
            onSelectedCardItem={this.props.onSelectedCardItem}
            onClickEdit={this.onClickEdit}
        />;
    }

    private getEditCardRow(): JSX.Element | null {
        const editCardItem = this.state.editCardItem;

        if (!editCardItem) {
            return null;
        }

        return <CardFormRow
            key={editCardItem.id}
            onSubmit={this.onSaveEditing}
            onCancel={this.onCancelEditing}
            cardTitle={this.props.cardTitle}
            editItem={editCardItem}
        />;
    }

    private appendCardFormRow(cardComponents: JSX.Element[]): JSX.Element[] {
        if (this.props.isCreating) {
            cardComponents.push(
                <CardFormRow
                    key="card-form"
                    onSubmit={this.onCreated}
                    onCancel={this.onCancelCreating}
                    cardTitle={this.props.cardTitle}/>,
            );
        }

        return cardComponents;
    }

    private onCreated = (cardItem: ICardItem) => {
        cardItemStorage.add(cardItem);

        this.props.onSaved();
        this.setState({ editCardItem: null });
    };

    private onCancelCreating = () => {
        this.setState({ editCardItem: null });
        this.props.onCancelCreating();
    };

    private onCancelEditing = () => {
        this.setState({ editCardItem: null });
    }

    private onSaveEditing = (editCardItem: ICardItem) => {
        cardItemStorage.update(editCardItem);

        this.props.onSaved();
        this.setState({ editCardItem: null });
    }
}

export default CardList;
