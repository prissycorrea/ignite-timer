import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    body {
        background: ${props => props.theme.secondary};
        color: ${props => props.theme.white};
        font: 400 16px Roboto, sans-serif;
    }
`