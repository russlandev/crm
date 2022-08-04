export interface IAddingFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  birth: string;
  [propName: string]: string;
}

export interface IDropdownProps {
  options: string[];
  selected: string;
  onSelectedChange: TypeForFunc | TypeForSetState;
  index?: number;
  dropdownKey?: string;
}

export interface IStudent {
  firstName: string;
  lastName: string;
  birth: string;
  phone: string;
  instrument: string;
  lessons: number;
  timetable: { weekDay: string; time: string }[];
  perWeek: number;
  daytable: string[];
  id: number;
}

export interface IFilterBarProps {
  instr: string;
  setInstr: (instr: string) => void;
}

export interface IStudentsToMonth {
  day: string;
  students: {
    name: string;
    id: number;
    time: {
      time: string;
      weekDay: string;
    };
  }[];
}

export type GetStudentsType = (
  setLoading: (arg: boolean) => void,
  setErr: (arg: string) => void,
  instr: string
) => Promise<IStudent[]>;

export type TypeForSetState = (selected: string) => void;

export type TypeForFunc = (selected: string, index: number, key: string) => void;

export type DateCalculatorType = (
  date: number,
  amount: string | number,
  timetable: { weekDay: string; time: string }[]
) => string[];

export type TimetableItem = { weekDay: string; time: string };

export type setDropdownsLengthType = (
  setPerWeek: (arg: string) => void,
  setDropdowns: (arg: TimetableItem[]) => void
) => (selected: string) => void;

export type dropdownsChangeHandlerType = (
  dropdowns: TimetableItem[],
  setDropdowns: (arg: TimetableItem[]) => void
) => (selected: string, index: number, key: string) => void;

export type IsBookedType = (
  instr: string,
  dropdowns: TimetableItem[],
  id?: number
) => Promise<string>