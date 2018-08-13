import * as React from 'react';
import 'src/App.css';
import PeopleCard from 'src/components/Card/People/PeopleCard';
import Card from 'src/components/Card/Card';
import {ICardItem} from 'src/models';
import Billing from 'src/services/Billing';

interface IState {
    selectedCardItem: ICardItem | null;
    splittedBill: Record<number, number>;
}

class App extends React.Component<{}, IState> {
    public state = {
        selectedCardItem: null,
        splittedBill: {},
    };

    private cardItemRef: HTMLLIElement | null = null;
    private billing: Billing;

    constructor(props: any) {
        super(props);

        this.billing = new Billing();
    }

    public render() {
        const ids = this.billing.getIdsFromAssociations(this.state.selectedCardItem);

        return (
            <div className="App" onClick={this.onClickOutSide}>
                <Card title="Items"
                      ids={ids.itemIds}
                      onSelectedCardItem={this.onSelectedCardItem}
                      onAddingAssociation={this.onAddingAssociation}
                      onRemoveItem={this.onRemoveItem}
                      onCreated={this.onAddItem}
                />
                <PeopleCard ids={ids.peopleIds}
                            onSelectedCardItem={this.onSelectedCardItem}
                            onAddingAssociation={this.onAddingAssociation}
                            onRemoveItem={this.onRemoveHuman}
                            onCreated={this.onAddHuman}
                />
            </div>
        );
    }

    private onAddingAssociation = (itemId: number, peopleId: number) => {
        const splittedBill: Record<number, number> = this.billing.addAssociation(itemId, peopleId);

        this.setState({...this.state, splittedBill});
    };

    private onSelectedCardItem = (cardItem: ICardItem, cardItemRef: HTMLLIElement | null) => {
        this.setState({...this.state, selectedCardItem: cardItem});
        this.cardItemRef = cardItemRef;
    };

    private onRemoveItem = (cardItem: ICardItem) => {
        const splittedBill: Record<number, number> = this.billing.removeItem(cardItem);

        this.setState({...this.state, splittedBill});
    };

    private onRemoveHuman = (cardItem: ICardItem) => {
        const splittedBill: Record<number, number> = this.billing.removeHuman(cardItem);

        this.setState({...this.state, splittedBill});
    };

    private onClickOutSide = (event: any) => {
        if (this.cardItemRef && !this.cardItemRef.contains(event.target)) {
            this.setState({...this.state, selectedCardItem: null});
            this.cardItemRef = null;
        }
    };

    private onAddItem = (cardItem: ICardItem) => {
        const splittedBill: Record<number, number> = this.billing.addItem({id: cardItem.id, price: cardItem.price});

        this.setState({...this.state, splittedBill});
    };

    private onAddHuman = (cardItem: ICardItem) => {
        const splittedBill: Record<number, number> = this.billing.addHuman({id: cardItem.id});

        this.setState({...this.state, splittedBill});
    };
}

export default App;
