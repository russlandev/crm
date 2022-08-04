import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { IStudent, TimetableItem } from "../interfaces";
import { oneDayMs } from "../constants";
import axios, { AxiosResponse, AxiosError } from "axios";
import { perWeekOptions, timeOptions, days, amountOptions } from "../constants";
import Dropdown from "./Dropdown";
import { setDropdownsLength, dropdownsChangeHandler, DateCalculator, isBooked } from "./Helpers";
import Loader from "./Loader";

const StudentPage: FC = () => {
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams();
  const [date, setDate] = useState<string>("");
  const [amount, setAmount] = useState<string>(amountOptions[0]);
  const [student, setStudent] = useState<IStudent>();
  const [perWeek, setPerWeek] = useState<string>(perWeekOptions[0]);
  const [dropdowns, setDropdowns] = useState<TimetableItem[]>([]);
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    setLoading(true);
    (async (): Promise<void> => {
      try {
        const res: AxiosResponse = await axios.get(
          `http://localhost:3001/students?id=${id as string}`
        );
        setStudent((res.data as IStudent[]).find((item) => item.id === parseInt(id as string)));
      } catch (err) {
        setErr((err as AxiosError).message);
      }
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (student) {
      setDropdowns(student?.timetable as TimetableItem[]);
      setPerWeek(student?.perWeek.toString());
      setDate(student.daytable[0]);
      setAmount(student.daytable.length.toString());
      const correctDate = new Date(student.daytable[0]).getTime() + oneDayMs;
      setDate(new Date(correctDate).toISOString().slice(0, 10));
      setErr("");
    }
  }, [student]);

  const color = (time: string): string => {
    return new Date(time).getTime() < Date.now()
      ? "bg-green-500 shadow-lg text-white"
      : "shadow-md";
  };

  const handleEdit = async (date: string): Promise<void> => {
    setErr("");
    const booked: string = await isBooked(student?.instrument as string, dropdowns, student?.id);
    if (booked) {
      setErr(booked);
      return;
    }
    const daytable: string[] = DateCalculator(new Date(date).getTime(), amount, dropdowns);
    if (daytable.includes("Invalid date")) {
      setErr("Wrong date. Please enter correct date.");
    } else {
      setStudent({ ...(student as IStudent), daytable: daytable, timetable: dropdowns });
    }
  };

  const handleUpdate = (): void => {
    const getNewStartingDate: string[] = DateCalculator(
      new Date(student?.daytable[0] as string).getTime(),
      (+amount + 1).toString(),
      dropdowns
    );
    const updatedStartingDate: string = getNewStartingDate[getNewStartingDate.length - 1];
    handleEdit(updatedStartingDate);
  };

  const patch = async (): Promise<void> => {
    setLoading(true);
    try {
      await axios.patch(`http://localhost:3001/students/${(student as IStudent).id}`, student);
    } catch (err) {
      setErr((err as AxiosError).message);
    }
    setLoading(false);
  };

  const remove = async (): Promise<void> => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3001/students/${(student as IStudent).id}`);
      navigate("/", { replace: true });
    } catch (err) {
      setErr((err as AxiosError).message);
    }
    setLoading(false);
  };

  return loading ? (
    <Loader />
  ) : (
    <div className='min-h-screen pt-20 flex flex-wrap justify-around'>
      <div className='w-full fixed top-0 flex justify-end px-24'>
        <div
          onClick={patch}
          className='my-5 mr-10 w-40 h-min text-center transition-all rounded-full py-1 cursor-pointer shadow-md hover:bg-green-500'>
          Save
        </div>
        <div
          onClick={remove}
          className='my-5 w-40 h-min text-center transition-all rounded-full py-1 cursor-pointer shadow-md hover:bg-red-500'>
          Remove
        </div>
      </div>
      <div className='w-2/6'>
        {err && <label className='text-xl text-red-600'>{err}</label>}
          <>
            <div className='flex items-center my-3'>
              <Dropdown
                options={perWeekOptions}
                selected={perWeek}
                onSelectedChange={setDropdownsLength(setPerWeek, setDropdowns)}
              />
              <span className='ml-2'>Lessons per week</span>
            </div>
            <div className='flex items-center my-10'>
              <Dropdown options={amountOptions} selected={amount} onSelectedChange={setAmount} />
              <span className='ml-2'>Amount of lessons</span>
            </div>{" "}
            <label>Starting day</label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='w-full border-2 rounded-md text-base h-10 my-3 border-gray-200 px-2 focus:outline-none focus:border-gray-400'
              type='date'
            />
            <div className='flex mt-5'>
              {dropdowns.map((dropdown, i) => (
                <div key={i}>
                  <div className='mb-3 mr-7'>
                    <Dropdown
                      options={days}
                      selected={dropdowns[i].weekDay}
                      onSelectedChange={dropdownsChangeHandler(dropdowns, setDropdowns)}
                      index={i}
                      dropdownKey={"weekDay"}
                    />
                  </div>
                  <div className='my-5'>
                    <Dropdown
                      options={timeOptions}
                      selected={dropdowns[i].time}
                      onSelectedChange={dropdownsChangeHandler(dropdowns, setDropdowns)}
                      index={i}
                      dropdownKey={"time"}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div
              onClick={() => handleEdit(date)}
              className='my-5 w-40 text-center transition-all rounded-full py-1 cursor-pointer shadow-md hover:bg-green-300'>
              Save
            </div>
          </>
      </div>
      <div className='w-3/6'>
        <div className='pl-5 my-3'>
          <div className='text-xl pb-3 mb-3 border-b-[1px]'>{`${student?.firstName} ${student?.lastName}`}</div>
          <div className='text-xl pb-3 mb-3 border-b-[1px]'>{student?.birth}</div>
          <div className='text-xl pb-3 mb-3 border-b-[1px]'>{student?.phone}</div>
          <div className='text-xl pb-3 mb-3 border-b-[1px] capitalize'>{student?.instrument}</div>
        </div>
        <div className=' flex flex-wrap h-min'>
          {student?.daytable.map((item) => (
            <div
              key={item}
              className={`w-40 text-center rounded-full mr-5 py-3 m-3 ${color(item)}`}>
              {item}
            </div>
          ))}
        </div>
        {student &&
          new Date(student?.daytable[student.daytable.length - 1]).getTime() < Date.now() && (
            <div
              onClick={handleUpdate}
              className='my-5 w-40 text-center transition-all rounded-full py-1 cursor-pointer shadow-md hover:bg-green-300'>
              Renew timetable
            </div>
          )}
      </div>
    </div>
  );
};

export default StudentPage;
