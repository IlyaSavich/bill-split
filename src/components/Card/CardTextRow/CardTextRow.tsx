import 'src/components/Card/CardTextRow/CardTextRow.css'
import * as React from 'react';
import { ICardItem } from 'src/models';

interface IProps {
    cardItem: ICardItem;
    isSelected: boolean;
    onRemove: (cardItem: ICardItem) => void;
    onAddingAssociation: (itemId: number, peopleId: number) => void;
    onRemovingAssociation: (targerCardItem: ICardItem) => void;
    onSelectedCardItem: (cardItem: ICardItem, cardItemRef: HTMLLIElement | null) => void;
}

class CardTextRow extends React.Component<IProps> {

    private nodeRef: HTMLLIElement | null = null;

    public render() {
        const className = `list-group-item ${this.props.isSelected ? 'color-blue' : 'btn-outline-light'}`
        return (
            <li className={className}
                draggable={true}
                onDragEnter={this.preventEvent}
                onDragOver={this.preventEvent}
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
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
        this.setState({ isSelected: true })
    };

    private onDrop = (event: React.DragEvent<HTMLLIElement>) => {
        const draggedId = Number(event.dataTransfer.getData('dragged.id'));
        const draggedCardTitle = event.dataTransfer.getData('dragged.cardTitle');
        if (draggedCardTitle === this.props.cardItem.cardTitle) {
            return
        }
        const association = draggedCardTitle === 'Items' ? {
            itemId: draggedId,
            peopleId: this.props.cardItem.id,
        } : {
                itemId: this.props.cardItem.id,
                peopleId: draggedId,
            };

        this.props.onAddingAssociation(association.itemId, association.peopleId);
    };

    private onDragEnd = (event: React.DragEvent<HTMLLIElement>) => {
        if (event.dataTransfer.dropEffect === 'none') {
            this.props.onRemovingAssociation(this.props.cardItem)
        }
    };

    private onRemove = (event: any) => {
        event.stopPropagation();
        this.props.onRemove(this.props.cardItem);
    };

    private setItemReference = (node: HTMLLIElement | null) => {
        this.nodeRef = node;
    };
}

export default CardTextRow;
