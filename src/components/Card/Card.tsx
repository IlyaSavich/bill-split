import 'components/Card/Card.css';
import * as React from 'react';
import CardList from 'components/Card/CardList';
import {CardTitle, ICardItem} from 'models';
import IconButton from '@material-ui/core/IconButton';
import DeleteForever from '@material-ui/icons/DeleteForeverOutlined';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';

export interface IProps {
    title: CardTitle;
    ids: number[] | null;
    selectedCardItem: ICardItem | null;
    onAddingAssociation: (itemId: number, peopleId: number) => void;
    onRemovingAssociation: (targetCardItem: ICardItem) => void;
    onSaved: (cardItem: ICardItem) => void;
    onRemoveItem: (cardItem: ICardItem) => void;
    onRemoveAllItems: () => void;
    onSelectedCardItem: (cardItem: ICardItem) => void;
}

interface IState {
    isCreating: boolean;
    isClearing: boolean;
}

class Card<P extends IProps> extends React.Component<P, IState> {
    public state = {
        isClearing: false,
        isCreating: false,
    };

    public render() {
        return (
            <div className="card item-card" key={this.props.title}>
                <div className="header">
                    <Grid container={true} justify="space-between" alignItems="baseline" direction="row">
                        <Grid item={true}>
                            <IconButton type="button" onClick={this.removeAll}>
                                <DeleteForever />
                            </IconButton>
                        </Grid>
                        <Grid item={true}>
                            <span>{this.props.title}</span>
                        </Grid>
                        <Grid item={true}>
                            <IconButton onClick={this.createItem}>
                                <AddIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </div>
                <ul className="list-group list-group-flush">
                    <CardList
                        isCreating={this.state.isCreating}
                        isClearing={this.state.isClearing}
                        stopCreating={this.stopCreating}
                        onSaved={this.onItemSaved}
                        onCancelCreating={this.onCancelCreating}
                        afterClearing={this.afterClearing}
                        onAddingAssociation={this.props.onAddingAssociation}
                        onRemovingAssociation={this.props.onRemovingAssociation}
                        onSelectedCardItem={this.props.onSelectedCardItem}
                        onRemoveItem={this.props.onRemoveItem}
                        cardTitle={this.props.title}
                        ids={this.props.ids}
                        selectedCardItem={this.props.selectedCardItem}
                    />
                </ul>
            </div>
        );
    }

    protected removeAll = () => {
        this.setState({ isCreating: false, isClearing: true });
        this.props.onRemoveAllItems();
    };

    protected afterClearing = () => {
        this.setState({ isClearing: false });
    };

    protected createItem = () => {
        this.setState({ isCreating: true });
    };

    protected onItemSaved = (cardItem: ICardItem) => {
        this.setState({ isCreating: false });
        this.props.onSaved(cardItem);
    };

    protected onCancelCreating = () => {
        this.setState({ isCreating: false });
    };

    protected stopCreating = () => {
        this.setState({ isCreating: false });
    }
}

export default Card;
