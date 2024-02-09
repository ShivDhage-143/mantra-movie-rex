import React, { useState } from "react";

const DateFilter = ({ startDate, setStartDate, endDate, setEndDate, handleSubmit }) => {
    const handleStartDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const year = selectedDate.getFullYear();
        let month = selectedDate.getMonth() + 1;
        let day = selectedDate.getDate();

        // Ensure month and day are two digits
        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;

        // Construct the yyyy/mm/dd format
        const formattedDate = `${year}-${month}-${day}`;

        setStartDate(formattedDate);
    };

    const handleEndDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const year = selectedDate.getFullYear();
        let month = selectedDate.getMonth() + 1;
        let day = selectedDate.getDate();

        // Ensure month and day are two digits
        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;

        // Construct the yyyy/mm/dd format
        const formattedDate = `${year}-${month}-${day}`;

        setEndDate(formattedDate);
    };

    return (
        <div className="dateFilters">
            <input
                type="date"
                value={startDate ? startDate : ""}
                onChange={handleStartDateChange}
            />

            <input
                type="date"
                value={endDate ? endDate : ""}
                onChange={handleEndDateChange}
            />

            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default DateFilter;
