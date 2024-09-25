import { useForm } from "react-hook-form";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import * as zod from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

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

export function NewCycleForm() {
    const { register, handleSubmit, watch, formState, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    });

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