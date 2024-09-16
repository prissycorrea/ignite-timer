import { Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, TaskInput } from "./styles";

export function Home() {
    const { register, handleSubmit, watch } = useForm();

    function handleCreateNewCycle(data: any) {
        console.log(data);
    }

    const task = watch('task');  // Observa o campo task
    const isSubmitDisabled = !task;  // Desabilita o botão de submit se o campo task estiver vazio

    return (
        <HomeContainer>
            <form onSubmit={ handleSubmit(handleCreateNewCycle) } action="">
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                        id="task" 
                        list="tasks-suggestions" 
                        placeholder="Dê um nome para o seu projeto" 
                        {...register('task')}/>
                    <label htmlFor="minutesAmount">durante</label>
                    <datalist id="tasks-suggestions">
                        <option value="projeto 01" />
                        <option value="projeto 02" />
                        <option value="projeto 03" />
                    </datalist>
                    <MinutesAmountInput 
                        type="number" 
                        id="minutesAmount" 
                        placeholder="00" 
                        step={5} 
                        min={5} 
                        max={60}
                        {...register('minutesAmount',{ valueAsNumber: true })}/>
                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <StartCountdownButton type="submit" disabled={isSubmitDisabled}><Play size={24}/>Começar</StartCountdownButton>
            </form>
        </HomeContainer>
    )
}