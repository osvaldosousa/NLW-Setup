import * as CheckBox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface HabitListProps {
  date: Date,
  onCompletedChanged: (completed: number ) => void, 
}

interface HabitsInfo {
  possibleHabits: Array<{
    id: string;
    title: string;
    created_at: string;
  }>,
  completedHabits: string[]
}

export function HabitList( { date, onCompletedChanged } : HabitListProps) {
  const [habistInfo, setHabitsInfo] = useState<HabitsInfo>()

  useEffect(() => {
    api.get('day', {
      params: {
        date: date.toISOString(),
      }
    }).then(renponse => {
      setHabitsInfo(renponse.data)
    })
  }, [])

  
  async function handleToggleHabit(habitId : string) {
    const isHabitAlreadyCompleted = habistInfo!.completedHabits.includes(habitId)

    let completedHabits: string[] = []

    await api.patch(`/habits/${habitId}/toggle`)

    if (isHabitAlreadyCompleted) {
      completedHabits = habistInfo!.completedHabits.filter(id => id != habitId)

      setHabitsInfo({
        possibleHabits: habistInfo!.possibleHabits,
        completedHabits,
      })

    } else {
      completedHabits = [...habistInfo!.completedHabits, habitId]
    }

    setHabitsInfo({
      possibleHabits: habistInfo!.possibleHabits,
      completedHabits,
    })

    onCompletedChanged(completedHabits.length)
  }

  const isDateInPast = dayjs(date)
    .endOf('day')
    .isBefore(new Date())

   return (
      <div className="mt-6 flex flex-col gap-3">
        {habistInfo?.possibleHabits.map(habit => {
          return (
            <CheckBox.Root
            key={habit.id}
            onCheckedChange={() => handleToggleHabit(habit.id)}
            checked={habistInfo.completedHabits.includes(habit.id)}
            disabled={isDateInPast}
            className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
            >
              <div 
                className="h-8 w-8 rounded-lg flex items-center justify-center
                  bg-zinc-900 border-2 border-zinc-800
                  group-data-[state=checked]:bg-green-500
                  group-data-[state=checked]:border-green-500
                  group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-background
                  ">
                <CheckBox.Indicator>
                  <Check size={20} className="text-white"/>
                </CheckBox.Indicator>
              </div>

              <span
                className="font-semibold text-xl text-white leading-tight
                group-data-[state=checked]:line-through
                group-data-[state=checked]:text-zinc-400
                ">
                {habit.title}
              </span>
            </CheckBox.Root>
          )
        })}

        
      </div>
    )
}