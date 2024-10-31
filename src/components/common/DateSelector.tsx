import React from 'react';

interface DateSelectorProps {
	selectedDate: Date | null;
	onDateSelect: (date: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
	selectedDate,
	onDateSelect,
}) => {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = new Date(event.target.value);

		onDateSelect(newDate);
	};

	return (
		<input
			className="rounded border p-1"
			type="date"
			value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ''}
			onChange={handleChange}
		/>
	);
};
