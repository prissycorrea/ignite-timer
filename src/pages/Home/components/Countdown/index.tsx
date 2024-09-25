import { useEffect, useState } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";

interface CountdownProps {
    activeCycle: any;
    activeCycleId: any;
    setCycles: any;
}

export function Countdown( { activeCycle, setCycles }: CountdownProps) {
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0); // Inicializa um estado para armazenar a quantidade de segundos passados
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
    return (
        <CountdownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountdownContainer>
    )
})}