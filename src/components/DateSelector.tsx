import React from "react";

interface DateSelectorProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    onDateSelect(newDate);
  };

  return (
    <input
      type="date"
      value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ""}
      onChange={handleChange}
      className="border rounded p-1"
    />
  );
};

export default DateSelector;
