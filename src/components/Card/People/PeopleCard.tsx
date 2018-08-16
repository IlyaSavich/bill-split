import * as React from 'react';
import Card, {IProps as BaseIProps} from 'src/components/Card/Card';
import PeopleCardList from 'src/components/Card/People/PeopleCardList';

interface IProps extends BaseIProps {
    splittedBill: Record<number, number>;
}

export default class PeopleCard extends Card<IProps> {
    public render() {
        return (
            <div className="card" style={{ width: "18rem" }} key={this.props.title}>
                <div className="card-header">
                    <span className="title">{this.props.title}</span>
                    <span className="btn-group btn-group-sm" role="group">
                        <button type="button" className="btn btn-secondary" onClick={this.createItem}>+</button>
                        <button type="button" className="btn btn-secondary" onClick={this.removeAll}>-</button>
                    </span>
                </div>
                <ul className="list-group list-group-flush">
                    <PeopleCardList
                        isCreating={this.state.isCreating}
                        isClearing={this.state.isClearing}
                        onCancelCreating={this.onCancelCreating}
                        afterClearing={this.afterClearing}
                        onAddingAssociation={this.props.onAddingAssociation}
                        onSelectedCardItem={this.props.onSelectedCardItem}
                        cardTitle={this.props.title}
                        ids={this.props.ids}
                        splittedBill={this.props.splittedBill}
                        onCreated={this.onCreated}
                        onRemoveItem={this.props.onRemoveItem}
                    />
                </ul>
            </div>
        );
    }
}
