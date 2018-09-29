import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import purple from '@material-ui/core/colors/purple';
import {CardTitle} from 'models';

const FORM_PROPERTIES_MAP = {
    [CardTitle.items]: {
        placeholder: 'Title',
        placeholder2: 'Price',
        theme:
            createMuiTheme({
                palette: {
                    primary: purple,
                },
            }),
    },
    [CardTitle.people]: {
        placeholder: 'Name',
        placeholder2: 'Budget',
        theme:
            createMuiTheme({
                palette: {
                    primary: green,
                },
            }),
    },
};

export function getFormProperties(cardTitle: CardTitle) {
    return FORM_PROPERTIES_MAP[cardTitle];
}
