import * as React from 'react';
import 'App.css';
import Card from 'components/Card/Card';
import PeopleCard from 'components/Card/People/PeopleCard';
import { ICardItem } from 'models';
import * as associationHelper from 'services/association/ItemHumanAssociationHelper';
import billing from 'services/Billing';
import Grid from '@material-ui/core/Grid';

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
                <Grid className="margin-top-50">
                    <Grid container={true} item={true} justify="center" xs={12} spacing={40}>
                        <Grid item={true}>
                            <Card title="ITEMS"
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
                                title="PEOPLE"
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

    private onAddingAssociation = (itemId: number, peopleId: number) => {
        const splittedBill = billing.addAssociation(itemId, peopleId);

        this.setState({ splittedBill });
    };

    private onRemovingAssociation = (cardItem: ICardItem) => {
        const selectedCardItem = this.state.selectedCardItem;

        if (selectedCardItem) {
            const splittedBill: Record<number, number> = selectedCardItem.id === cardItem.id
                ? billing.removeAllAssociationsForCardItem(cardItem)
                : billing.removeAssociation(cardItem, selectedCardItem);
            this.setState({ splittedBill });
        }
    }

    private onSelectedCardItem = (selectedCardItem: ICardItem) => {
        this.setState({ selectedCardItem });
    };

    private onRemoveItem = (cardItem: ICardItem) => {
        const splittedBill = billing.removeItem(cardItem);

        this.setState({ splittedBill, selectedCardItem: this.handleSelectedCardItemRemoval(cardItem) });
    };

    private onRemoveAllItems = () => {
        const splittedBill = billing.removeAllAssociations();

        this.setState({ splittedBill, selectedCardItem: null });
    }

    private onRemoveHuman = (cardItem: ICardItem) => {
        const splittedBill = billing.removeHuman(cardItem);

        this.setState({ splittedBill, selectedCardItem: this.handleSelectedCardItemRemoval(cardItem) });
    };

    private handleSelectedCardItemRemoval = (removedCardItem: ICardItem): ICardItem | null => {
        const selectedCardItem = this.state.selectedCardItem as ICardItem | null;
        return selectedCardItem && selectedCardItem.id === removedCardItem.id ? null : selectedCardItem;
    }

    private onClickOutSide = (event: any) => {
        const isSelectable = event.target.dataset.selectable;
        if (!isSelectable) {
            this.setState({ selectedCardItem: null });
        }
    };

    private onSaveItem = (cardItem: ICardItem) => {
        const splittedBill = billing.putItem({ id: cardItem.id, price: cardItem.price });

        this.setState({ splittedBill });
    };

    private onSaveHuman = (cardItem: ICardItem) => {
        const splittedBill = billing.putHuman({ id: cardItem.id, money: cardItem.price });

        this.setState({ splittedBill });
    };
}

export default App;
