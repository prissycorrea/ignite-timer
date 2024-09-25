import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod';
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";



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



    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId); // Busca o ciclo ativo

    
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
                <Countdown activeCycle={activeCycle} setCycles={setCycles} activeCycleId={activeCycleId} />
                {activeCycle ? (
                    <StopCountdownButton onClick={handleInterruptCycle} type="button"><HandPalm size={24}/>Interromper</StopCountdownButton>
                ) : (
                    <StartCountdownButton type="submit" disabled={isSubmitDisabled}><Play size={24}/>Começar</StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    )
}