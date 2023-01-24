import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { generateDatesFromYearsbeggin } from "../utils/generate-dates-from-years-begging"
import { HabitDay } from "./HabitDay"

const weekDays = [
  'D',
  'S',
  'T',
  'Q',
  'Q',
  'S',
  'S',
]

const summaryDates = generateDatesFromYearsbeggin();

const minimumSummaryDatesSize = 18 * 7 // 18 weeks
const amountDaysOfToFill = minimumSummaryDatesSize - summaryDates.length 

type Summary = {
  id: string,
  date: string,
  amount: number,
  completed: number,
}[]

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary>([])

  useEffect(() => {
    api.get('/summary').then(response => {
      console.log(response.data)
      setSummary(response.data)
    })
  }, [])

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, i) => {
          return (
            <div 
            key={`${weekDay}-${i}`}
            className="text-zinc-400 text-lg h-10 w-10 font-bold flex items-center justify-center">
              {weekDay}
            </div>
          )
        })}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 && summaryDates.map( date => {
          const dayInSummery = summary.find(day => {
            return dayjs(date).isSame(day.date, 'day')
          })
          return ( 
            <HabitDay 
              key={date.toString()} 
              date={date}
              amount={dayInSummery?.amount} 
              defaultCompleted={dayInSummery?.completed} 
            />
          )
        })}

        {amountDaysOfToFill > 0 && Array.from({length: amountDaysOfToFill}).map((_, i) => {
          return (
            <div
            key={i}
            className="bg-zinc-900 w-10 h-10 border-2 border-zinc-800 rounded-lg opacity-40        cursor-not-allowed"
            />
          )
        })}

      </div>

    </div>
  )
}