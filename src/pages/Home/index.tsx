import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, StopCountdownButton, TaskInput } from "./styles";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod';
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

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
    startDate: Date; // Data de início do ciclo
    interruptedDate?: Date; // Data de interrupção do ciclo
}

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]); // Inicializa um estado para armazenar os ciclos
    const [activeCycleId, setActiveCycleId] = useState<number | null>(null); // Inicializa um estado para armazenar o ciclo ativo
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0); // Inicializa um estado para armazenar a quantidade de segundos passados

    const { register, handleSubmit, watch, formState, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    });

    useEffect(() => {
        let interval: number;
        if (activeCycleId) {
            interval = setInterval(() => {
                setAmountSecondsPassed(
                    differenceInSeconds(new Date(), activeCycle?.startDate || new Date())
                );
            }, 1000);
        }
    
        // Limpar o intervalo quando o ciclo ativo mudar ou o componente desmontar
        return () => {
            clearInterval(interval);
        };
    }, [activeCycleId]);
    

    function handleCreateNewCycle(data: NewCycleFormData) {
        const newCycle: Cycle = {
            id: new Date().getTime(), // Gera um identificador único baseado no timestamp atual
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
        setCycles((state) => [...cycles, newCycle]); // Adiciona o novo ciclo ao estado de ciclos
        setActiveCycleId(newCycle.id); // Define o novo ciclo como o ciclo ativo
        setAmountSecondsPassed(0); // Reseta a quantidade de segundos passados
        reset(); // Reseta o formulário após o submit para os valores do defaultValues
    }

    function handleInterruptCycle() {
        setActiveCycleId(null); // Interrompe o ciclo ativo
        setAmountSecondsPassed(0); // Reseta a quantidade de segundos passados

        setCycles(cycles.map((cycle) => {
            if (cycle.id === activeCycleId) {
                return {
                    ...cycle,
                    interruptedDate: new Date(),
                }
            }
            return cycle;
        }));
    }

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId); // Busca o ciclo ativo
    
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0; // Calcula o total de segundos do ciclo ativo
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed: 0; // Calcula a quantidade de segundos restantes

    const minutesAmount = Math.floor(currentSeconds / 60); // Calcula a quantidade de minutos restantes
    const secondsAmount = currentSeconds % 60; // Calcula a quantidade de segundos restantes

    const minutes = String(minutesAmount).padStart(2, '0'); // Formata a quantidade de minutos para exibir com 2 dígitos
    const seconds = String(secondsAmount).padStart(2, '0'); // Formata a quantidade de segundos para exibir com 2 dígitos

    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`; // Atualiza o título da página com o tempo restante
        }
    }, [minutes, seconds, activeCycle]);

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
                        min={5} 
                        max={60}
                        disabled={ !!activeCycle }
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />
                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

                {activeCycle ? (
                    <StopCountdownButton onClick={handleInterruptCycle} type="button"><HandPalm size={24}/>Interromper</StopCountdownButton>
                ) : (
                    <StartCountdownButton type="submit" disabled={isSubmitDisabled}><Play size={24}/>Começar</StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    )
}