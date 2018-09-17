import * as React from 'react';
import Card, { IProps as BaseIProps } from 'src/components/Card/Card';
import PeopleCardList from 'src/components/Card/People/PeopleCardList';
import IconButton from '@material-ui/core/IconButton';
import DeleteForever from '@material-ui/icons/DeleteForeverOutlined'
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';

interface IProps extends BaseIProps {
    splittedBill: Record<number, number>;
}

export default class PeopleCard extends Card<IProps> {
    public render() {
        return (
            <div className="card people-card" key={this.props.title}>
                <div className='header'>
                    <Grid container={true} justify="space-between" alignItems='baseline' direction='row'>
                        <Grid item={true}>
                            <IconButton type='button' onClick={this.removeAll}>
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
                    <PeopleCardList
                        isCreating={this.state.isCreating}
                        isClearing={this.state.isClearing}
                        onCancelCreating={this.onCancelCreating}
                        afterClearing={this.afterClearing}
                        onAddingAssociation={this.props.onAddingAssociation}
                        onRemovingAssociation={this.props.onRemovingAssociation}
                        onSelectedCardItem={this.props.onSelectedCardItem}
                        cardTitle={this.props.title}
                        ids={this.props.ids}
                        splittedBill={this.props.splittedBill}
                        onCreated={this.onCreated}
                        onRemoveItem={this.props.onRemoveItem}
                        selectedCardItem={this.props.selectedCardItem}
                    />
                </ul>
            </div>
        );
    }
}
