import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod';
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

const newCycleFormValidationSchema = zod.object({
    task: zod
    .string()
    .min(1, 'Informe a tarefa que você irá realizar'),
    minutesAmount: zod
    .number()
    .min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
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
    finishedDate?: Date; // Data de interrupção do ciclo
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
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId); // Busca o ciclo ativo
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0; // Calcula o total de segundos do ciclo ativo
    useEffect(() => {
        let interval: number;
        if (activeCycleId) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate);
                if(secondsDifference >= totalSeconds) {
                    setCycles(state => state.map((cycle) => {
                        if (cycle.id === activeCycleId) {
                            return {
                                ...cycle,
                                finishedDate: new Date(),
                            }
                        }
                        return cycle;
                    }));
                    setAmountSecondsPassed(totalSeconds);
                    clearInterval(interval);
                } else {
                    setAmountSecondsPassed(secondsDifference);
                }
            }, 1000);
        }
    
        // Limpar o intervalo quando o ciclo ativo mudar ou o componente desmontar
        return () => {
            clearInterval(interval);
        };
    }, [activeCycle, activeCycleId, totalSeconds]);
    

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

        setCycles(state => state.map((cycle) => {
            if (cycle.id === activeCycleId) {
                return {
                    ...cycle,
                    interruptedDate: new Date(),
                }
            }
            return cycle;
        }));
    }


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
                <NewCycleForm />
                <Countdown />
                {activeCycle ? (
                    <StopCountdownButton onClick={handleInterruptCycle} type="button"><HandPalm size={24}/>Interromper</StopCountdownButton>
                ) : (
                    <StartCountdownButton type="submit" disabled={isSubmitDisabled}><Play size={24}/>Começar</StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    )
}