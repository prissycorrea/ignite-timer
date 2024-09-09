import styled from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'neutral';

interface ButtonContainerProps {
    variant?: ButtonVariant;
}

const buttonVariants = {
    primary: 'purple',
    secondary: 'orange',
    danger: 'red',
    success: 'green',
    neutral: 'white',
};

export const ButtonContainer = styled.button<ButtonContainerProps> `
    width: 100px;
    height: 50px;
    border-radius: 8px;
    border: none;
    margin: 8px;
    cursor: pointer;

    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.white};
    /*${props => {
        return `background-color: ${buttonVariants[props.variant || 'primary']};`
    }}*/
`