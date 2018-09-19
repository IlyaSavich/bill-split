import 'src/components/Card/Card.css';
import * as React from 'react';
import CardList from 'src/components/Card/CardList';
import { ICardItem } from 'src/models';
import IconButton from '@material-ui/core/IconButton';
import DeleteForever from '@material-ui/icons/DeleteForeverOutlined';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';

export interface IProps {
    title: string;
    ids: number[] | null;
    selectedCardItem: ICardItem | null;
    onAddingAssociation: (itemId: number, peopleId: number) => void;
    onRemovingAssociation: (targetCardItem: ICardItem) => void;
    onCreated: (cardItem: ICardItem) => void;
    onRemoveItem: (cardItem: ICardItem) => void;
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
                        onCreated={this.onCreated}
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
        this.setState({ ...this.state, isCreating: false, isClearing: true });
    };

    protected afterClearing = () => {
        this.setState({ ...this.state, isClearing: false });
    };

    protected createItem = () => {
        this.setState({ ...this.state, isCreating: true });
    };

    protected onCreated = (cardItem: ICardItem) => {
        this.setState({ ...this.state, isCreating: false });
        this.props.onCreated(cardItem);
    };

    protected onCancelCreating = () => {
        this.setState({ isCreating: false });
    };
}

export default Card;
