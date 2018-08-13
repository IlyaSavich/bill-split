import * as React from 'react';
import {ICardItem} from 'src/models';
import CardItemIdGenerator from 'src/services/CardItemIdGenerator';

interface IProps {
    cardTitle: string;
    onCreated: (card: ICardItem) => void;
    onCancel: () => void;
}

class CardFormRow extends React.Component<IProps> {
    public render() {
        return (
            <li className="list-group-item">
                <form name="create-list-item" onSubmit={this.onCreated}>
                    <input type="text" name="title" autoFocus={true}/>
                    <input type="number" name="price"/>
                    <span className="toolbar">
                        <div className="btn-group btn-group-sm" role="group">
                            <button type="submit" className="btn btn-secondary">+</button>
                            <button type="button" className="btn btn-secondary" onClick={this.props.onCancel}>-</button>
                        </div>
                    </span>
                </form>
            </li>
        );
    }

    private onCreated = (event: any) => {
        event.preventDefault();

        const data = new FormData(event.target);
        this.props.onCreated({
            cardTitle: this.props.cardTitle,
            id: CardItemIdGenerator.getId(),
            price: Number(data.get('price')),
            title: String(data.get('title')),
        });
    };
}

export default CardFormRow;
