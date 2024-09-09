import 'styled-components';
import { defaultTheme } from '../styles/themes/default';

type ThemeType = typeof defaultTheme; //Guardando o tipo do tema padrão

declare module 'styled-components' { //Sobrescrevendo o módulo do styled-components
    export interface DefaultTheme extends ThemeType {}
}