import React, { useEffect, useState, useRef, FC } from "react";
import { IDropdownProps, TypeForFunc, TypeForSetState } from "../interfaces";

const Dropdown: FC<IDropdownProps> = ({
  options,
  selected,
  onSelectedChange,
  dropdownKey,
  index,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLButtonElement>(null);

  const handleSelect = (option: string): void => {
    index !== undefined && dropdownKey
      ? (onSelectedChange as TypeForFunc)(option, index, dropdownKey)
      : (onSelectedChange as TypeForSetState)(option);

    setOpen(false);
  };

  useEffect(() => {
    const onBodyClick = (e: MouseEvent): void => {
      if (ref?.current?.contains(e.target as HTMLElement)) {
        return;
      }
      setOpen(false);
    };
    document.body.addEventListener("click", onBodyClick, { capture: true });

    return () => {
      document.body.removeEventListener("click", onBodyClick, { capture: true });
    };
  }, []);

  return (
    <div className='relative'>
      <button
        ref={ref}
        onClick={() => setOpen(!open)}
        className='dropdown-toggle px-6 py-2.5 font-medium text-xs leading-tight capitalize rounded shadow-md hover:bg-gray-100 hover:shadow-lg focus:bg-blue-100 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-200 active:shadow-lg transition duration-150 ease-in-out flex items-center whitespace-nowrap'
        type='button'
        id='dropdownMenuButton1'
        data-bs-toggle='dropdown'
        aria-expanded='false'>
        {selected}
        <svg
          aria-hidden='true'
          focusable='false'
          data-prefix='fas'
          data-icon='caret-down'
          className='w-2 ml-2'
          role='img'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 320 512'>
          <path
            fill='currentColor'
            d='M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z'></path>
        </svg>
      </button>
      <ul
        className={` dropdown-menu min-w-max absolute bg-white text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 m-0 bg-clip-padding border-none ${
          open ? "" : "hidden"
        }`}
        aria-labelledby='dropdownMenuButton1'>
        {options.map((option) =>
          option !== selected ? (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className='capitalize cursor-pointer text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100'>
              {option}
            </li>
          ) : (
            ""
          )
        )}
      </ul>
    </div>
  );
};

export default Dropdown;
