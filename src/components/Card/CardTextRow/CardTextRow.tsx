import 'components/Card/CardTextRow/CardTextRow.css';
import * as cx from 'classnames';
import * as React from 'react';
import { ICardItem } from 'models';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
import EditOutlined from '@material-ui/icons/EditOutlined';
import Typography from '@material-ui/core/Typography';

interface IProps {
    cardItem: ICardItem;
    isSelected: boolean;
    onRemove: (cardItem: ICardItem) => void;
    onAddingAssociation: (itemId: number, peopleId: number) => void;
    onRemovingAssociation: (targerCardItem: ICardItem) => void;
    onSelectedCardItem: (cardItem: ICardItem) => void;
    onClickEdit: (editCardItem: ICardItem) => void;
}

class CardTextRow extends React.Component<IProps> {
    public render() {
        const className = cx('list-group-item', { 'color-blue': this.props.isSelected, 'btn-outline-light': !this.props.isSelected });
        return (
            <li className={className}
                draggable={true}
                onDragEnter={this.preventEvent}
                onDragOver={this.preventEvent}
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
                onClick={this.onClick}
                onDrop={this.onDrop}
                data-selectable={true}
            >
                <Grid container={true} direction="row" data-selectable={true}>
                    <Grid container={true} item={true} xs={9} direction="row" justify="space-around" alignItems="center" data-selectable={true}>
                        <Grid item={true} zeroMinWidth={true} xs={7} data-selectable={true}>
                            <Typography data-selectable={true} variant="body1" noWrap={true}>{this.props.cardItem.title}</Typography>
                        </Grid>
                        <Grid item={true} xs={2} data-selectable={true}>
                            <Typography data-selectable={true} variant="body1" noWrap={true}>${this.props.cardItem.price}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container={true} item={true} xs={3} direction="row" justify="flex-end" spacing={8} data-selectable={true}>
                        <Grid item={true} data-selectable={true}>
                            <IconButton className="icon-24">
                                <EditOutlined onClick={this.onClickEdit} />
                            </IconButton>
                        </Grid>
                        <Grid item={true} data-selectable={true}>
                            <IconButton className="icon-24">
                                <DeleteOutlined onClick={this.onRemove} />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
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
        this.props.onSelectedCardItem(this.props.cardItem);
    };

    private onDrop = (event: React.DragEvent<HTMLLIElement>) => {
        const draggedId = Number(event.dataTransfer.getData('dragged.id'));
        const draggedCardTitle = event.dataTransfer.getData('dragged.cardTitle');
        if (draggedCardTitle === this.props.cardItem.cardTitle) {
            return;
        }
        const association = draggedCardTitle.toLowerCase() === 'items' ?
            {
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
            this.props.onRemovingAssociation(this.props.cardItem);
        }
    };

    private onRemove = (event: any) => {
        event.stopPropagation();
        this.props.onRemove(this.props.cardItem);
    }

    private onClickEdit = (event: any) => {
        event.stopPropagation();
        this.props.onClickEdit(this.props.cardItem);
    }
}

export default CardTextRow;
