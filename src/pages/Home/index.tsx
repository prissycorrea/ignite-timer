import { Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, TaskInput } from "./styles";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod';
import { useState } from "react";

const newCycleFormValidationSchema = zod.object({
    task: zod
    .string()
    .min(1, 'Informe a tarefa que você irá realizar'),
    minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
}) 

//interface NewCycleFormData {
    //task: string;
    //minutesAmount: number;
//}

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
    id: number; // Identificador único do ciclo, para registrar no histórico
    task: string;
    minutesAmount: number;
}

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]); // Inicializa um estado para armazenar os ciclos
    const [activeCycleId, setActiveCycleId] = useState<number | null>(null); // Inicializa um estado para armazenar o ciclo ativo

    const { register, handleSubmit, watch, formState, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    });

    function handleCreateNewCycle(data: NewCycleFormData) {
        const newCycle: Cycle = {
            id: new Date().getTime(), // Gera um identificador único baseado no timestamp atual
            task: data.task,
            minutesAmount: data.minutesAmount,
        }
        setCycles((state) => [...cycles, newCycle]); // Adiciona o novo ciclo ao estado de ciclos
        setActiveCycleId(newCycle.id); // Define o novo ciclo como o ciclo ativo
        reset(); // Reseta o formulário após o submit para os valores do defaultValues
    }

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId); // Busca o ciclo ativo
    console.log(activeCycle);

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
                        min={5} 
                        max={60}
                        {...register('minutesAmount',{ valueAsNumber: true })}
                    />
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