import * as React from 'react';
import CardList from 'src/components/Card/CardList';
import {ICardItem} from 'src/models';

export interface IProps {
    title: string;
    ids: number[] | null;
    onAddingAssociation: (itemId: number, peopleId: number) => void;
    onCreated: (cardItem: ICardItem) => void;
    onRemoveItem: (cardItem: ICardItem) => void;
    onSelectedCardItem: (cardItem: ICardItem, cardItemRef: HTMLLIElement | null) => void;
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
            <div className="card" style={{width: "18rem"}} key={this.props.title}>
                <div className="card-header">
                    <span className="title">{this.props.title}</span>
                    <span className="btn-group btn-group-sm" role="group">
                        <button type="button" className="btn btn-secondary" onClick={this.createItem}>+</button>
                        <button type="button" className="btn btn-secondary" onClick={this.removeAll}>-</button>
                    </span>
                </div>
                <ul className="list-group list-group-flush">
                    <CardList
                        isCreating={this.state.isCreating}
                        isClearing={this.state.isClearing}
                        onCreated={this.onCreated}
                        onCancelCreating={this.onCancelCreating}
                        afterClearing={this.afterClearing}
                        onAddingAssociation={this.props.onAddingAssociation}
                        onSelectedCardItem={this.props.onSelectedCardItem}
                        onRemoveItem={this.props.onRemoveItem}
                        cardTitle={this.props.title}
                        ids={this.props.ids}
                    />
                </ul>
            </div>
        );
    }

    protected removeAll = () => {
        this.setState({...this.state, isCreating: false, isClearing: true});
    };

    protected afterClearing = () => {
        this.setState({...this.state, isClearing: false});
    };

    protected createItem = () => {
        this.setState({...this.state, isCreating: true});
    };

    protected onCreated = (cardItem: ICardItem) => {
        this.setState({...this.state, isCreating: false});
        this.props.onCreated(cardItem);
    };

    protected onCancelCreating = () => {
        this.setState({isCreating: false});
    };
}

export default Card;
