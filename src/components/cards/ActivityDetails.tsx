import DateDropdownMenu from "../dropdown/DateDropDown";

const ActivityDetailsCard: React.FC = () => {
  return (
    <div className="flex flex-col space-y-8 w-[400px] bg-white rounded-lg p-4">
      <p className="font-poppins text-2xl text-[#3F4765]">Activities</p>
      <div className="flex flex-col gap-2">
        <div>
          <DateDropdownMenu />
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailsCard;
