import React, { FC, useEffect } from "react";
import { Routes, Route, useLocation, Location } from "react-router-dom";
import Layout from "./components/Layout";
import AddingPage from "./components/AddingPage";
import Calendar from "./components/Calendar";
import List from "./components/List";
import StudentPage from "./components/StudentPage";

const App: FC = () => {
  const location: Location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Calendar />} />
        <Route path='add' element={<AddingPage />} />
        <Route path='list' element={<List />} />
        <Route path='/:id' element={<StudentPage />} />
      </Route>
    </Routes>
  );
};

export default App;
