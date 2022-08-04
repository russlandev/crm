import React, { FC } from "react";
import { dropdownInstuments } from "../constants";
import { IFilterBarProps } from "../interfaces";

const FilterBar: FC<IFilterBarProps> = ({ instr, setInstr }) => {
  return (
    <div className='flex items-center h-16'>
      {dropdownInstuments.map((item: string) => (
        <div
          onClick={() => setInstr(item)}
          className={`capitalize transition-all select-none text-xl py-2 px-8 mx-2 rounded-full cursor-pointer ${
            instr === item ? "bg-green-200 shadow-lg" : "hover:bg-green-100 shadow-md"
          }`}
          key={item}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default FilterBar;
