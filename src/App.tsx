import * as React from 'react';
import 'src/App.css';
import Card from 'src/components/Card/Card';
import PeopleCard from 'src/components/Card/People/PeopleCard';
import { ICardItem } from 'src/models';
import * as associationHelper from 'src/services/association/ItemHumanAssociationHelper';
import billing from 'src/services/Billing';

interface IState {
    cardItemRef: HTMLLIElement | null;
    selectedCardItem: ICardItem | null;
    splittedBill: Record<number, number>;
}

class App extends React.Component<{}, IState> {
    public state = {
        cardItemRef: null,
        selectedCardItem: null,
        splittedBill: {},
    };

    public render() {
        const ids = associationHelper.getSelectedIdsFromAssociations(this.state.selectedCardItem);

        return (
            <div className="App" onClick={this.onClickOutSide}>
                <Card title="Items"
                    ids={ids.itemIds}
                    onSelectedCardItem={this.onSelectedCardItem}
                    onAddingAssociation={this.onAddingAssociation}
                    onRemovingAssociation={this.onRemovingAssociation}
                    onRemoveItem={this.onRemoveItem}
                    onCreated={this.onAddItem}
                    selectedCardItem={this.state.selectedCardItem}
                />
                <PeopleCard
                    title="People"
                    ids={ids.peopleIds}
                    onSelectedCardItem={this.onSelectedCardItem}
                    onAddingAssociation={this.onAddingAssociation}
                    onRemovingAssociation={this.onRemovingAssociation}
                    onRemoveItem={this.onRemoveHuman}
                    onCreated={this.onAddHuman}
                    splittedBill={this.state.splittedBill}
                    selectedCardItem={this.state.selectedCardItem}
                />
            </div>
        );
    }

    private onAddingAssociation = (itemId: number, peopleId: number) => {
        const splittedBill = billing.addAssociation(itemId, peopleId);

        this.setState({ ...this.state, splittedBill });
    };

    private onRemovingAssociation = (cardItem: ICardItem) => {
        if (this.state.selectedCardItem) {
            const id = 'id'
            const splittedBill: Record<number, number> = this.state.selectedCardItem![id] === cardItem.id
                ? billing.removeAllAssociations(cardItem)
                : billing.removeAssociation(cardItem, this.state.selectedCardItem!)
            this.setState({ splittedBill })
        }
    }

    private onSelectedCardItem = (selectedCardItem: ICardItem, cardItemRef: HTMLLIElement | null) => {
        this.setState({ ...this.state, selectedCardItem, cardItemRef });
    };

    private onRemoveItem = (cardItem: ICardItem) => {
        const splittedBill = billing.removeItem(cardItem);

        this.setState({ ...this.state, splittedBill });
    };

    private onRemoveHuman = (cardItem: ICardItem) => {
        const splittedBill = billing.removeHuman(cardItem);

        this.setState({ ...this.state, splittedBill });
    };

    private onClickOutSide = (event: any) => {
        const cardItemRef = this.state.cardItemRef as HTMLLIElement | null;

        if (cardItemRef && !cardItemRef.contains(event.target)) {
            this.setState({ ...this.state, selectedCardItem: null, cardItemRef: null });
        }
    };

    private onAddItem = (cardItem: ICardItem) => {
        const splittedBill = billing.addItem({ id: cardItem.id, price: cardItem.price });

        this.setState({ ...this.state, splittedBill });
    };

    private onAddHuman = (cardItem: ICardItem) => {
        const splittedBill = billing.addHuman({ id: cardItem.id, money: cardItem.price });

        this.setState({ ...this.state, splittedBill });
    };
}

export default App;
