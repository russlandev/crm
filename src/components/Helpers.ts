import {
  DateCalculatorType,
  dropdownsChangeHandlerType,
  setDropdownsLengthType,
  TimetableItem,
  GetStudentsType,
  IsBookedType
} from "../interfaces";
import { days, oneDayMs } from "../constants";
import axios, { AxiosResponse, AxiosError } from "axios";
import { IStudent } from "./../interfaces/index";

export const DateCalculator: DateCalculatorType = (date, amount, timetable) => {
  const dayOfWeek: string = days[new Date(date).getDay()];
  const arrOfDates: number[] = new Array(+amount).fill(date);
  const week: number = oneDayMs * 7;
  let day: number = date + oneDayMs / 2;

  const err: boolean = !timetable.map((item) => item.weekDay).includes(dayOfWeek);
  if (err) return ["Invalid date"];

  const newArr: number[] = arrOfDates.map((date, i) => {
    if (i > 0) {
      const differences: { [propname: string]: number } = {};
      const sortedTimetable = timetable
        .slice()
        .sort((a, b) => days.indexOf(a.weekDay) - days.indexOf(b.weekDay));
      const calcDifference = sortedTimetable.map((item) => {
        return (days.indexOf(item.weekDay) + 1) * oneDayMs;
      });
      for (let i = 0; i < sortedTimetable.length; i++) {
        i === sortedTimetable.length - 1
          ? (differences[sortedTimetable[i].weekDay] = Math.abs(
              week - (calcDifference[i] - calcDifference[0])
            ))
          : (differences[sortedTimetable[i].weekDay] = Math.abs(
              calcDifference[i + 1] - calcDifference[i]
            ));
      }
      return (day += differences[days[new Date(day).getDay()]]);
    }
    return day;
  });

  return newArr.map((item) => new Date(item).toDateString());
};

export const setDropdownsLength: setDropdownsLengthType = (setPerWeek, setDropdowns) => {
  return function setDdLength(selected) {
    setPerWeek(selected);
    setDropdowns(new Array(parseInt(selected)).fill({ weekDay: "Sun", time: "09:00" }));
  };
};

export const dropdownsChangeHandler: dropdownsChangeHandlerType = (dropdowns, setDropdowns) => {
  return function ddChangeHandler(selected, index, key) {
    const newDropdowns = dropdowns.map((item, i) => {
      if (i === index) {
        return { ...item, [key]: selected };
      }
      return item;
    });
    setDropdowns(newDropdowns);
  };
};

export const isBooked: IsBookedType = async (instr, dropdowns, id?) => {
  let error = "";
  try {
    const res: AxiosResponse = await axios.get(`http://localhost:3001/students?q=${instr}`);
    dropdowns.forEach((item: TimetableItem) => {
      (res.data as IStudent[]).forEach((student) => {
          student.timetable.forEach((fetchedTimetable: TimetableItem) => {
            if (fetchedTimetable.weekDay === item.weekDay && fetchedTimetable.time === item.time && student.id !== id) {
              error = "This time is booked. Choose another time.";
            }
         });
      });
    });
  }catch(err) {
    error = (err as AxiosError).message
  }
  return error;
};

export const getStudents: GetStudentsType = async (setLoading, setErr, instr) => {
  setLoading(true);
  try {
    const res: AxiosResponse = await axios.get(`http://localhost:3001/students?q=${instr}`);
    setLoading(false);
    return res.data as IStudent[];
  } catch (err) {
    setErr((err as AxiosError).message);
    setLoading(false);
    return [] as IStudent[]
  }
}