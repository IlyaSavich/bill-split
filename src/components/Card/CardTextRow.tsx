import * as React from 'react';
import {ICardItem} from 'src/models';

interface IProps {
    cardItem: ICardItem;
    onRemove: (cardItem: ICardItem) => void;
    onAddingAssociation: (itemId: number, peopleId: number) => void;
    onSelectedCardItem: (cardItem: ICardItem, cardItemRef: HTMLLIElement | null) => void;
}

class CardTextRow extends React.Component<IProps> {
    private nodeRef: HTMLLIElement | null = null;

    public render() {
        return (
            <li className="list-group-item"
                draggable={true}
                onDragEnter={this.preventEvent}
                onDragOver={this.preventEvent}
                onDragStart={this.onDragStart}
                onClick={this.onClick}
                onDrop={this.onDrop}
                ref={this.setItemReference}
            >
                <span className="title">{this.props.cardItem.title}</span>
                <span className="price">${this.props.cardItem.price}</span>
                <span className="toolbar">
                    <div className="btn-group btn-group-sm" role="group">
                        <button type="button" className="btn btn-secondary" onClick={this.onRemove}>-</button>
                    </div>
                </span>
            </li>
        );
    }

    private preventEvent = (event: any) => {
        event.preventDefault();
        return false;
    };

    private onDragStart = (event: React.DragEvent<HTMLLIElement>) => {
        event.dataTransfer.setData('dragged.id', String(this.props.cardItem.id));
        event.dataTransfer.setData('dragged.cardTitle', String(this.props.cardItem.cardTitle));
    };

    private onClick = () => {
        this.props.onSelectedCardItem(this.props.cardItem, this.nodeRef);
    };

    private onDrop = (event: React.DragEvent<HTMLLIElement>) => {
        const draggedId = Number(event.dataTransfer.getData('dragged.id'));
        const draggedCardTitle = event.dataTransfer.getData('dragged.cardTitle');
        const association = draggedCardTitle === 'Items' ? {
            itemId: draggedId,
            peopleId: this.props.cardItem.id,
        } : {
            itemId: this.props.cardItem.id,
            peopleId: draggedId,
        };

        this.props.onAddingAssociation(association.itemId, association.peopleId);
    };

    private onRemove = (event: any) => {
        event.preventDefault();
        this.props.onRemove(this.props.cardItem);
        return false;
    };

    private setItemReference = (node: HTMLLIElement | null) => {
        this.nodeRef = node;
    };
}

export default CardTextRow;
