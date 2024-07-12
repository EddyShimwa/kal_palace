import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchOccupiedRooms } from '../../redux/slices/roomsSlice';

import { format } from 'date-fns';

const Report: React.FC = () => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const rooms = useSelector((state: RootState) => state.rooms.rooms);
  const loading = useSelector((state: RootState) => state.rooms.loading);

  const handleGenerateReport = () => {
    if (fromDate && toDate) {
      const startDate = format(fromDate, 'yyyy-MM-dd');
      const endDate = format(toDate, 'yyyy-MM-dd');
      dispatch(fetchOccupiedRooms({ startDate, endDate }));
    } else {
      alert('Please select both dates.');
    }
  };

  const toUndefined = (date: Date | null): Date | undefined => {
    return date === null ? undefined : date;
  };

  const sum = rooms.filter((room) => room.isOccupied === true).reduce((acc, room) => acc + room.price, 0);

  return (
    <div className='w-full p-5'>
      <h1 className='py-5 font-bold'>Choose the date range to generate the report</h1>
      <div className="block md:flex border border-[#159b4647] rounded-lg items-center font-bold justify-between p-5 md:p-2">
        <div className='md:flex p-2 items-center'>
          <label htmlFor="fromDate" className='mr-2'>From: </label>
          <DatePicker
            selected={fromDate}
            onChange={(date: Date | null) => setFromDate(date)}
            selectsStart
            startDate={toUndefined(fromDate)}
            endDate={toUndefined(toDate)}
            placeholderText="Select start date"
            id="fromDate"
            className='p-2 border border-[#159b4647] rounded-lg dark:bg-black'
          />
        </div>
        <div className='md:flex items-center font-bold p-2'>
          <label htmlFor="toDate" className='mr-2'>To: </label>
          <DatePicker
            selected={toDate}
            onChange={(date: Date | null) => setToDate(date)}
            selectsEnd
            startDate={toUndefined(fromDate)}
            endDate={toUndefined(toDate)}
            minDate={toUndefined(fromDate)}
            placeholderText="Select end date"
            id="toDate"
            className='p-2 border border-[#159b4647] rounded-lg dark:bg-black'
          />
        </div>
      </div>
      <div className='flex w-full justify-center'>
        <button className="mt-5 border p-3 rounded-lg border-[#159b4647] hover:bg-green-600 hover:text-black font-bold" onClick={handleGenerateReport}>Generate Report</button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full mt-5 border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Room No</th>
              <th className="border p-2">Occupied</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Check-In Date</th>
              <th className="border p-2">Check-Out Date</th>
            </tr>
          </thead>
          <tbody>
            {rooms.filter((room) => room.isOccupied === true).map(room => (
              <tr key={room._id}>
                <td className="border p-2">{room.roomNumber}</td>
                <td className="border p-2">{room.isOccupied ? 'Yes' : 'No'}</td>
                <td className="border p-2">{room.price}</td>
                <td className="border p-2">{new Date(room.checkInDate).toLocaleString()}</td>
                <td className="border p-2">{new Date(room.checkOutDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
       
      )}
       <div className="flex items-center p-5 font-bold text-green-500 text-2xl">Expected Revenue: {sum} Frw</div>
    </div>
  );
};

export default Report;
