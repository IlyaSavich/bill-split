import * as _ from 'lodash';
import * as React from 'react';
import CardFormRow from 'components/Card/CardFormRow/CardFormRow';
import CardTextRow from 'components/Card/CardTextRow/CardTextRow';
import { ICardItem } from 'models';

export interface IProps {
    cardTitle: string;
    ids: number[] | null;
    isCreating: boolean;
    isClearing: boolean;
    selectedCardItem: ICardItem | null;
    onSaved: (cardItem: ICardItem) => void;
    onCancelCreating: () => void;
    afterClearing: () => void;
    onAddingAssociation: (itemId: number, peopleId: number) => void;
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

    protected cardItems: ICardItem[] = [];

    public componentDidUpdate(): void {
        if (this.props.isClearing) {
            this.cardItems = [];
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
        }).map(cardItem => {
            if (this.canAddEditRow(this.state.editCardItem, cardItem)) {
                return this.getEditCardRow(this.state.editCardItem!);
            }

            return this.getCardRow(cardItem);
        });
    }

    protected canAddEditRow(editCardItem: ICardItem | null, cardItem: ICardItem): boolean {
        return !!editCardItem && editCardItem.id === cardItem.id && !this.props.isCreating;
    }

    protected onRemoveRow = (removedCardItem: ICardItem) => {
        _.remove(this.cardItems, (cardItem: ICardItem) => cardItem.id === removedCardItem.id);
        this.props.onRemoveItem(removedCardItem);
    }

    protected onClickEdit = (editCardItem: ICardItem) => {
        this.setState({ editCardItem });
        this.props.stopCreating();
    }

    protected getCardRow = (cardItem: ICardItem): JSX.Element => {
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

    protected getEditCardRow = (editCardItem: ICardItem): JSX.Element => {
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
                    cardTitle={this.props.cardTitle} />,
            );
        }

        return cardComponents;
    }

    private onCreated = (cardItem: ICardItem) => {
        this.cardItems.push(cardItem);
        this.props.onSaved(cardItem);
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
        this.cardItems = this.cardItems.map(cardItem => {
            return cardItem.id === editCardItem.id ? editCardItem : cardItem;
        });

        this.props.onSaved(editCardItem);
        this.setState({ editCardItem: null });
    }
}

export default CardList;
