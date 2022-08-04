import React, { FC, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { IAddingFormValues, TimetableItem } from "../interfaces";
import Dropdown from "./Dropdown";
import { DateCalculator, setDropdownsLength, dropdownsChangeHandler, isBooked } from "./Helpers";
import axios, { AxiosError } from "axios";
import { dropdownInstuments, amountOptions, perWeekOptions, days, timeOptions } from "../constants";

const AddingPage: FC = () => {
  const [err, setErr] = useState<string>("");
  const [instrument, setInstrument] = useState<string>(dropdownInstuments[0]);
  const [amount, setAmount] = useState<string>(amountOptions[0]);
  const [date, setDate] = useState<string>("");
  const [perWeek, setPerWeek] = useState<string>(perWeekOptions[0]);
  const [dropdowns, setDropdowns] = useState<TimetableItem[]>(
    new Array(parseInt(perWeek)).fill({ weekDay: "Sun", time: "09:00" })
  );
  const navigate: NavigateFunction = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IAddingFormValues>({ mode: "onBlur" });

  const onFormSubmit: SubmitHandler<IAddingFormValues> = async (data): Promise<void> => {
    let error: string = "";
    setErr(error);
    const daytable: string[] = DateCalculator(new Date(date).getTime(), amount, dropdowns);
    if (daytable.includes("Invalid date")) {
      setErr("Wrong date. Please enter correct date.");
      return;
    }

    error = await isBooked(instrument, dropdowns);
    if (error) {
      setErr(error);
      return;
    }

    try {
      await axios.post("http://localhost:3001/students", {
        ...data,
        instrument,
        lessons: parseInt(amount),
        timetable: dropdowns,
        perWeek: parseInt(perWeek),
        daytable: daytable,
      });
      navigate("/", { replace: true });
      reset();
    } catch (err) {
      setErr((err as AxiosError).message);
    }
  };

  return (
    <form
      autoComplete='off'
      className='flex flex-wrap justify-around min-h-screen mt-10'
      onSubmit={handleSubmit(onFormSubmit)}>
      <div className='flex flex-col w-2/5'>
        <label>{`First name${
          errors?.firstName?.message ? `: ${errors.firstName.message.toLowerCase()}` : ""
        }`}</label>
        <input
          className='w-full border-2 rounded-md text-base h-10 my-3 border-gray-200 px-2 focus:outline-none focus:border-gray-400'
          {...register("firstName", {
            required: "This field is required",
          })}
        />
        <label>{`Last name${
          errors?.lastName?.message ? `: ${errors.lastName.message.toLowerCase()}` : ""
        }`}</label>
        <input
          className='w-full border-2 rounded-md text-base h-10 my-3 border-gray-200 px-2 focus:outline-none focus:border-gray-400'
          {...register("lastName", {
            required: "This field is required",
          })}
        />
        <label>{`Birth date${
          errors?.birth?.message ? `: ${errors.birth.message.toLowerCase()}` : ""
        }`}</label>
        <input
          className='w-full border-2 rounded-md text-base h-10 my-3 border-gray-200 px-2 focus:outline-none focus:border-gray-400'
          {...register("birth", {
            required: "This field is required",
            pattern: {
              value: /^\d{2}([./-])\d{2}\1\d{4}$/,
              message: "Plese enter valid birth date",
            },
          })}
          placeholder='XX-XX-XXXX'
        />
        <label>{`Telephone${
          errors?.phone?.message ? `: ${errors.phone.message.toLowerCase()}` : ""
        }`}</label>
        <input
          className='w-full border-2 rounded-md text-base h-10 my-3 border-gray-200 px-2 focus:outline-none focus:border-gray-400'
          {...register("phone", {
            required: "This field is required",
            pattern: {
              value: /(?:\+|\d)[\d\-\(\) ]{5,}\d/g,
              message: "Plese enter valid phone number",
            },
          })}
          placeholder='+380XXXXXXXXX'
        />
      </div>
      <div className='flex flex-col w-1/3'>
        <label>Amount of lessons</label>
        <div className='my-5'>
          <Dropdown options={amountOptions} selected={amount} onSelectedChange={setAmount} />
        </div>
        <label>Lessons per week</label>
        <div className='my-5'>
          <Dropdown
            options={perWeekOptions}
            selected={perWeek}
            onSelectedChange={setDropdownsLength(setPerWeek, setDropdowns)}
          />
        </div>
        <label>Starting day</label>
        <div className='mb-5'>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className='w-full border-2 rounded-md text-base h-10 my-3 border-gray-200 px-2 focus:outline-none focus:border-gray-400'
            type='date'
          />
        </div>
        <div className='flex'>
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
        <label>Instrument</label>
        <div className='my-5'>
          <Dropdown
            options={dropdownInstuments}
            selected={instrument}
            onSelectedChange={setInstrument}
          />
        </div>
        {err ? <label className='text-red-600 text-2xl'>{` Error: ${err}`}</label> : ""}
      </div>
      <div className='w-screen flex justify-center items-start'>
        <button
          className='-ml-20  w-1/3 border-2 rounded-md text-base h-10 my-3 border-green-200 px-2 shadow-sm hover:bg-green-200 active:bg-green-300'
          type='submit'>
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddingPage;
