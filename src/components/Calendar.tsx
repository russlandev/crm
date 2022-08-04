import React, { FC, useEffect, useState } from "react";
import { IStudent, IStudentsToMonth, TimetableItem } from "./../interfaces/index";
import { oneDayMs, days, timeOptions, dropdownInstuments } from "../constants";
import FilterBar from "./FilterBar";
import Loader from "./Loader";
import { Link } from "react-router-dom";
import { getStudents } from "./Helpers";

const fillMonthArr = (): string[] => {
  const firstDay = Date.now() - new Date(Date.now()).getDay() * oneDayMs;
  return new Array(28).fill(1).map((item, i) => new Date(firstDay + oneDayMs * i).toDateString());
};

const matchStudentsToMonth = (
  students: IStudent[],
  setStudentsToMonth: React.Dispatch<React.SetStateAction<IStudentsToMonth[]>>
): void => {
  const parseTime = (time: TimetableItem): number => {
    return parseInt(time.time.slice(0, 2));
  };
  const month: string[] = fillMonthArr();
  const newStudentsToMonth: IStudentsToMonth[] = month
    .map((item: string) => {
      const matchStudents: IStudent[] = students.filter((student) =>
        student.daytable.includes(item)
      );
      return matchStudents
        .map((student: IStudent) => {
          return {
            name: student.lastName,
            id: student.id,
            time: student.timetable.find(
              (obj) => obj.weekDay === days[new Date(item).getDay()]
            ) as TimetableItem,
          };
        })
        .sort((a, b) => parseTime(a.time) - parseTime(b.time));
    })
    .map((students, i) => {
      return {
        day: month[i],
        students: students,
      };
    });
  setStudentsToMonth(newStudentsToMonth as IStudentsToMonth[]);
};

const Calendar: FC = () => {
  const [err, setErr] = useState<string>("");
  const [instr, setInstr] = useState<string>(dropdownInstuments[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [studentsToMonth, setStudentsToMonth] = useState<IStudentsToMonth[]>([]);

  useEffect(() => {
    (async (): Promise<void> => {
      setStudents(await getStudents(setLoading, setErr, instr));
    })();
  }, [instr]);

  useEffect(() => {
    matchStudentsToMonth(students, setStudentsToMonth);
  }, [students]);

  return (
    <>
      <FilterBar instr={instr} setInstr={setInstr} />
      {loading ? (
        <Loader />
      ) : err ? (
        <div className='text-red-600 text-xl my-20 text-center -ml-20'>{err}</div>
      ) : (
        <div className='flex flex-wrap justify-around'>
          {studentsToMonth.map((day: IStudentsToMonth) => (
            <div className='w-[14%] p-5 pb-1 tracking-wide mb-1 border-[1px]' key={day.day}>
              <div
                className={`mb-2 text-lg ${
                  new Date(Date.now()).toDateString() === day.day
                    ? "text-green-600 font-bold underline underline-offset-2"
                    : "font-semibold"
                }`}>
                {day.day}
              </div>
              {timeOptions.map((time: string) => (
                <div className='flex items-center justify-between border-t-[1px] h-9 ' key={time}>
                  <div className='mr-2 text-lg'>{time}</div>
                  <Link
                    to={`/${day.students.find((student) => student.time.time === time)?.id}`}
                    className='mr-2 text-lg hover:underline'>
                    {day.students.find((student) => student.time.time === time)?.name || ""}
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Calendar;
