import * as CheckBox from '@radix-ui/react-checkbox'
import { Check } from "phosphor-react";
import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';

const availableWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export function NewHabitForm() {
  const [title, setTitle] = useState('');
  const [weekDays, setWeekDays] = useState<Number[]>([]);

  async function createNewHabit(event: FormEvent) {
    event.preventDefault()

    if (!title || weekDays.length === 0) {
      return
    }

    await api.post('habits', {
      title,
      weekDays
    })

    setTitle('')
    setWeekDays([])

  };

  function handleToglleWeeDay(weekDay: Number) {
    if (weekDays.includes(weekDay)) {
      const weekDaysWithRemoved = weekDays.filter(day => day !== weekDay)

      setWeekDays(weekDaysWithRemoved)
    } else {
      const weekDaysWithAddOne = [...weekDays, weekDay]

      setWeekDays(weekDaysWithAddOne)
    }
  };

  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual seu comprementimento?
      </label>

      <input
        type="text"
        id="title"
        placeholder="ex: Exercícios, Dormir 8 horas. etc..."
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400
          focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-zinc-900"
        autoFocus
        value={title}
        onChange={event => setTitle(event.target.value)}
      />

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual Sua Recorrência
      </label>

      <div className="flex flex-col gap-2 mt-3">
        {availableWeekDays.map((weekDay, index) => {
          return (
            <CheckBox.Root 
              key={weekDay} 
              className="flex items-center gap-3 group focus:outline-none"
              checked={weekDays.includes(index)}
              onCheckedChange={() => handleToglleWeeDay(index)}
            >
              <div 
                className="h-8 w-8 rounded-lg flex items-center justify-center
                bg-zinc-900 border-2 border-zinc-800
                group-data-[state=checked]:bg-green-500
                group-data-[state=checked]:border-green-500
                transition-colors
                group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-background
                ">
                <CheckBox.Indicator>
                  <Check size={20} className="text-white"/>
                </CheckBox.Indicator>
              </div>

              <span className="text-white leading-tight">
                {weekDay}
              </span>
            </CheckBox.Root>
          )
        })}
      </div>

      <button type="submit" 
        className="mt-4 rounded-lg p-4 gap-3 flex justify-center items-center font-semibold
         bg-green-600 hover:bg-green-500
         transition-colors
         focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-zinc-900
         ">
        <Check size={20} weight="bold" />
        Comfirmar
      </button>
    </form>
  )
}