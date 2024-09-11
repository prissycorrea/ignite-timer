import { Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, TaskInput } from "./styles";

export function Home() {
    return (
        <HomeContainer>
            <form action="">
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput type="text" id="task" list="tasks-suggestions" placeholder="Dê um nome para o seu projeto"/>
                    <label htmlFor="minutesAmount">durante</label>
                    <datalist id="tasks-suggestions">
                        <option value="projeto 01" />
                        <option value="projeto 02" />
                        <option value="projeto 03" />
                    </datalist>
                    <MinutesAmountInput type="number" id="minutesAmount" placeholder="00" step={5} min={5} max={60}/>
                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <StartCountdownButton type="submit" disabled><Play size={24}/>Começar</StartCountdownButton>
            </form>
        </HomeContainer>
    )
}