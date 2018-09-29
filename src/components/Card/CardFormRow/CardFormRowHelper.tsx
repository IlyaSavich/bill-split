import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import purple from '@material-ui/core/colors/purple';
import {CardTitle} from 'models';
import {Theme} from '@material-ui/core/es';

interface IFormProperties {
    placeholder: string;
    placeholder2: string;
    theme: Theme;
}

const FORM_PROPERTIES_MAP: Record<CardTitle, IFormProperties> = {
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

export function getFormProperties(cardTitle: CardTitle): IFormProperties {
    return FORM_PROPERTIES_MAP[cardTitle];
}
