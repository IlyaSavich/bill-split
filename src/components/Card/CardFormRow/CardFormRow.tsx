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
    onCreated: (card: ICardItem) => void;
    onCancel: () => void;
}

class CardFormRow extends React.Component<IProps> {
    public render() {
        const formProperties = formRowHelper.getFormProperties(this.props.cardTitle);
        return (
            <li className="list-group-item">
                <form name="create-list-item" onSubmit={this.onCreated}>
                    <MuiThemeProvider theme={formProperties.theme}>
                        <Input autoFocus={true} name="title" placeholder={formProperties.placeholder} required={true} type="text" />
                        <Input name="price" placeholder={formProperties.placeholder2} required={true} type="number" />
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

    private onCreated = (event: any) => {
        event.preventDefault();

        const data = new FormData(event.target);
        this.props.onCreated({
            cardTitle: this.props.cardTitle.toLowerCase(),
            id: CardItemIdGenerator.getId(),
            price: Number(data.get('price')),
            title: String(data.get('title')),
        });
    };
}

export default CardFormRow;
