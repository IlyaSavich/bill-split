import * as React from 'react';
import 'App.css';
import Card from 'components/Card/Card';
import PeopleCard from 'components/Card/People/PeopleCard';
import { CardTitle, ICardItem } from 'models';
import * as associationHelper from 'services/association/ItemHumanAssociationHelper';
import billing from 'services/Billing';
import Grid from '@material-ui/core/Grid';
import associator from 'services/association/ItemHumanAssociator';

interface IState {
    selectedCardItem: ICardItem | null;
    splittedBill: Record<number, number>;
}

class App extends React.Component<{}, IState> {
    public state: IState = {
        selectedCardItem: null,
        splittedBill: {},
    };

    public render() {
        const ids = associationHelper.getSelectedIdsFromAssociations(this.state.selectedCardItem);

        return (
            <div className="App" onClick={this.onClickOutSide}>
                <Grid className="padding-top-50">
                    <Grid container={true} item={true} justify="center" xs={12} spacing={40}>
                        <Grid item={true}>
                            <Card
                                title={CardTitle.items}
                                ids={ids.itemIds}
                                onSelectedCardItem={this.onSelectedCardItem}
                                onAddingAssociation={this.onAddingAssociation}
                                onRemovingAssociation={this.onRemovingAssociation}
                                onRemoveItem={this.onRemoveItem}
                                onRemoveAllItems={this.onRemoveAllItems}
                                onSaved={this.onSaveItem}
                                selectedCardItem={this.state.selectedCardItem}
                            />
                        </Grid>
                        <Grid item={true}>
                            <PeopleCard
                                title={CardTitle.people}
                                ids={ids.peopleIds}
                                onSelectedCardItem={this.onSelectedCardItem}
                                onAddingAssociation={this.onAddingAssociation}
                                onRemovingAssociation={this.onRemovingAssociation}
                                onRemoveItem={this.onRemoveHuman}
                                onRemoveAllItems={this.onRemoveAllItems}
                                onSaved={this.onSaveHuman}
                                splittedBill={this.state.splittedBill}
                                selectedCardItem={this.state.selectedCardItem}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }

    private onAddingAssociation = () => {
        const splittedBill = billing.recalculate();

        this.setState({ splittedBill });
    };

    private onRemovingAssociation = (cardItem: ICardItem) => {
        const selectedCardItem = this.state.selectedCardItem;

        if (selectedCardItem) {
            if (selectedCardItem.id === cardItem.id) {
                associator.removeAllForCardItem(cardItem);
            } else {
                associator.removeAssociation(cardItem, selectedCardItem);
            }

            const splittedBill = billing.recalculate();

            this.setState({ splittedBill });
        }
    };

    private onSelectedCardItem = (selectedCardItem: ICardItem) => {
        this.setState({ selectedCardItem });
    };

    private onRemoveItem = (cardItem: ICardItem) => {
        const splittedBill = billing.recalculate();
        const selectedCardItem = this.handleSelectedCardItemRemoval(cardItem);

        this.setState({ splittedBill, selectedCardItem });
    };

    private onRemoveAllItems = () => {
        const splittedBill = billing.recalculate();

        this.setState({ splittedBill, selectedCardItem: null });
    };

    private onRemoveHuman = (cardItem: ICardItem) => {
        const splittedBill = billing.recalculate();
        const selectedCardItem = this.handleSelectedCardItemRemoval(cardItem);

        this.setState({ splittedBill, selectedCardItem });
    };

    private onClickOutSide = (event: any) => {
        const isSelectable = event.target.dataset.selectable;
        if (!isSelectable) {
            this.setState({ selectedCardItem: null });
        }
    };

    private onSaveItem = () => {
        const splittedBill = billing.recalculate();

        this.setState({ splittedBill });
    };

    private onSaveHuman = () => {
        const splittedBill = billing.recalculate();

        this.setState({ splittedBill });
    };

    private handleSelectedCardItemRemoval(removedCardItem: ICardItem): ICardItem | null {
        const selectedCardItem = this.state.selectedCardItem;

        return selectedCardItem && selectedCardItem.id === removedCardItem.id ?
            null : selectedCardItem;
    }
}

export default App;
