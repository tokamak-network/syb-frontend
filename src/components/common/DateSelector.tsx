import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker.css';
import { MdOutlineCalendarToday } from 'react-icons/md';

interface DateSelectorProps {
	selectedDate: Date | null;
	onDateSelect: (date: Date | null) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
	selectedDate,
	onDateSelect,
}) => {
	return (
		<DatePicker
			calendarClassName="react-datepicker__month-container"
			className="w-full rounded border bg-primary p-1"
			icon={<MdOutlineCalendarToday />}
			selected={selectedDate}
			onChange={(date: Date | null) => onDateSelect(date)}
		/>
	);
};
