import * as React from 'react';
import { ICardItem } from 'models';
import CardItemIdGenerator from 'services/CardItemIdGenerator';
import Input from '@material-ui/core/Input';
import Done from '@material-ui/icons/Done';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { MuiThemeProvider } from '@material-ui/core/styles';
import * as formRowHelper from 'components/Card/CardFormRow/CardFormRowHelper';

interface IProps {
    cardTitle: string;
    editItem?: ICardItem;
    onSubmit: (card: ICardItem) => void;
    onCancel: () => void;
}

class CardFormRow extends React.Component<IProps> {
    public render() {
        const formProperties = formRowHelper.getFormProperties(this.props.cardTitle);
        return (
            <li className="list-group-item">
                <form name="create-list-item" onSubmit={this.onSubmit}>
                    <MuiThemeProvider theme={formProperties.theme}>
                        <Input
                            defaultValue={this.props.editItem ? this.props.editItem.title : ''}
                            autoFocus={true} name="title"
                            placeholder={formProperties.placeholder}
                            required={true}
                            type="text" />
                        <Input
                            defaultValue={this.props.editItem ? this.props.editItem.price : ''}
                            name="price"
                            placeholder={formProperties.placeholder2}
                            required={true}
                            type="number" />
                        <div>
                            <IconButton type="button" onClick={this.props.onCancel}>
                                <Close />
                            </IconButton>
                            <IconButton type="submit">
                                <Done />
                            </IconButton>
                        </div>
                    </MuiThemeProvider>
                </form>
            </li>
        );
    }

    private onSubmit = (event: any) => {
        event.preventDefault();

        const data = new FormData(event.target);
        this.props.onSubmit({
            cardTitle: this.props.cardTitle.toLowerCase(),
            id: this.props.editItem ? this.props.editItem.id : CardItemIdGenerator.getId(),
            price: Number(data.get('price')),
            title: String(data.get('title')),
        });
    };
}

export default CardFormRow;
