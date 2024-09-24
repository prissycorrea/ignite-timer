import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";

export function NewCycleForm() {
    return (
        <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                        id="task" 
                        list="tasks-suggestions" 
                        placeholder="Dê um nome para o seu projeto" 
                        disabled={ !!activeCycle }
                        {...register('task')}
                    />
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
                        min={1} 
                        max={60}
                        disabled={ !!activeCycle }
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />
                    <span>minutos.</span>
                </FormContainer>
    )
}