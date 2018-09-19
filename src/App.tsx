import * as React from 'react';
import 'src/App.css';
import Card from 'src/components/Card/Card';
import PeopleCard from 'src/components/Card/People/PeopleCard';
import { ICardItem } from 'src/models';
import * as associationHelper from 'src/services/association/ItemHumanAssociationHelper';
import billing from 'src/services/Billing';
import Grid from '@material-ui/core/Grid';

interface IState {
    selectedCardItem: ICardItem | null;
    splittedBill: Record<number, number>;
}

class App extends React.Component<{}, IState> {
    public state = {
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
                                onCreated={this.onAddItem}
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
                                onCreated={this.onAddHuman}
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
        const selectedCardItem = this.state.selectedCardItem as ICardItem | null;
        if (selectedCardItem) {
            const splittedBill: Record<number, number> = selectedCardItem.id === cardItem.id
                ? billing.removeAllAssociations(cardItem)
                : billing.removeAssociation(cardItem, selectedCardItem);
            this.setState({ splittedBill });
        }
    }

    private onSelectedCardItem = (selectedCardItem: ICardItem) => {
        this.setState({ selectedCardItem });
    };

    private onRemoveItem = (cardItem: ICardItem) => {
        const splittedBill = billing.removeItem(cardItem);

        this.setState({ splittedBill });
    };

    private onRemoveHuman = (cardItem: ICardItem) => {
        const splittedBill = billing.removeHuman(cardItem);

        this.setState({ splittedBill });
    };

    private onClickOutSide = (event: any) => {
        const isSelectable = event.target.dataset.selectable;
        if (!isSelectable) {
            this.setState({ selectedCardItem: null });
        }
    };

    private onAddItem = (cardItem: ICardItem) => {
        const splittedBill = billing.addItem({ id: cardItem.id, price: cardItem.price });

        this.setState({ splittedBill });
    };

    private onAddHuman = (cardItem: ICardItem) => {
        const splittedBill = billing.addHuman({ id: cardItem.id, money: cardItem.price });

        this.setState({ splittedBill });
    };
}

export default App;
