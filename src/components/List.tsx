import React, { FC, useState, useEffect } from "react";
import { IStudent } from "../interfaces";
import FilterBar from "./FilterBar";
import Loader from "./Loader";
import { oneDayMs, dropdownInstuments } from "../constants";
import { Link } from "react-router-dom";
import { getStudents } from "./Helpers";

const List: FC = () => {
  const [err, setErr] = useState<string>("");
  const [instr, setInstr] = useState<string>(dropdownInstuments[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [students, setStudents] = useState<IStudent[]>([]);
  const getTime = (arg: IStudent): number =>
    new Date(arg.daytable[arg.daytable.length - 1]).getTime();

  const color = (student: IStudent): string => {
    if (getTime(student) - Date.now() < oneDayMs * 7) {
      return "text-orange-600";
    } else if (getTime(student) < Date.now()) {
      return "text-red-500";
    } else {
      return "";
    }
  };

  useEffect(() => {
    (async (): Promise<void> => {
      setStudents(
        (await getStudents(setLoading, setErr, instr)).sort((a, b) => getTime(a) - getTime(b))
      );
    })();
  }, [instr]);

  return (
    <>
      <FilterBar instr={instr} setInstr={setInstr} />
      <div className='flex h-16 border-t-[2px] items-center px-5 mx-10'>
        <div className='w-96'>Name</div>
        <div className='w-96 text-center'>Timetable</div>
        <div className='w-96 text-center'>Ending date</div>
        <div className='w-36 text-center'>Phone</div>
      </div>
      {loading ? (
        <Loader />
      ) : err ? (
        <div className='text-red-600 text-xl my-20 text-center -ml-20'>{err}</div>
      ) : (
        <ul className='mx-10'>
          {students.map((student) => (
            <li key={student.id} className='flex h-16 border-t-[2px] items-center px-5 text-center'>
              <div className='w-96 text-left'>{`${student.firstName} ${student.lastName}`}</div>
              <div className='w-96 flex'>
                {student.timetable.map((item, i) => (
                  <div className='w-32 text-center' key={i}>
                    <div>{item.weekDay}</div>
                    <div>{item.time}</div>
                  </div>
                ))}
              </div>
              <div className={`w-96 ${color(student)}`}>
                {student.daytable[student.daytable.length - 1]}
              </div>
              <div className='w-36'>{student.phone}</div>
              <Link
                to={`/${student.id}`}
                className={`text-2xl w-20 cursor-pointer hover:text-green-700 ${color(student)}`}>
                <i className='edit icon'></i>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default List;
