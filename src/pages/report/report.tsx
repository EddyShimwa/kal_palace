import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { fetchOccupancy } from '../../redux/slices/reportSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { format } from 'date-fns';

const Report: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const occupancyData = useSelector((state: RootState) => state.occupancy);
  const occupancyStatus = useSelector((state: RootState) => state.occupancy.status);

  const occData = occupancyData.details;
  const revenue = occupancyData.totalRevenue;
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (fromDate && toDate) {
      const startDate = format(fromDate, 'yyyy-MM-dd');
      const endDate = format(toDate, 'yyyy-MM-dd');
      dispatch(fetchOccupancy({ startDate, endDate }));
    }
  }, [fromDate, toDate, dispatch]);

  console.log(occupancyData);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="mb-2 md:mb-0 md:mr-2">
          <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">From:</label>
          <DatePicker
            selected={fromDate}
            onChange={(date: Date | null) => setFromDate(date || undefined)}
            selectsStart
            startDate={fromDate}
            endDate={toDate}
            placeholderText="Select Start date"
            className="p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>
        <div>
          <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">To:</label>
          <DatePicker
            selected={toDate}
            onChange={(date: Date | null) => setToDate(date || undefined)}
            selectsEnd
            startDate={fromDate}
            endDate={toDate}
            placeholderText="Select End date"
            className="p-2 border border-gray-300 rounded-lg w-full"
          />
        </div>
      </div>

      {occupancyStatus === 'loading' && <div className="text-center">Loading...</div>}
      {occupancyStatus === 'succeeded' && (
        <>
          <table className="w-full mt-5 border-collapse  shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">Room No</th>
                <th className="border p-2 text-left">Price</th>
                <th className="border p-2 text-left">Check-In Date</th>
                <th className="border p-2 text-left">Check-Out Date</th>
              </tr>
            </thead>
            <tbody>
            {occData.map((room: any) => (
                <tr key={room._id} className="border-t">
                  <td className="border p-2">{room.roomNumber}</td>
                  <td className="border p-2">{room.price.toFixed(2)} Frw</td>
                  <td className="border p-2">
                    {new Date(room.checkInDate).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="border p-2">
                    {new Date(room.checkOutDate).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
            <p className="text-lg font-semibold">Expected Revenue: {revenue.toFixed(2)} Frw</p>
          </div>
        </>
      )}

      {occupancyStatus === 'failed' && <div className="text-center text-red-500">Error loading data</div>}
    </div>
  );
};

export default Report;
