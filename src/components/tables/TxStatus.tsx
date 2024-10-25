import {
  AiOutlineCloseCircle,
  AiOutlineCheckCircle,
  AiOutlineMinusCircle,
} from "react-icons/ai";
import { ActionStatus } from "@/types";

interface TxStatusProps {
  status: ActionStatus;
}

const TxStatus: React.FC<TxStatusProps> = ({ status }) => {
  const statusStyles =
    status === ActionStatus.SUCCESS
      ? "bg-[#29543C] text-[#C1F6D4]"
      : status === ActionStatus.PENDING
      ? "bg-[#353025] text-[#BDB9B7]"
      : "bg-[#7D2625] text-[#F7CFD1]";

  return (
    <div
      className={`flex rounded-md ${statusStyles} items-center text-center space-x-2 px-2 py-1 max-w-[120px]`}
    >
      {status === ActionStatus.SUCCESS && <AiOutlineCheckCircle />}
      {status === ActionStatus.FAILED && <AiOutlineCloseCircle />}
      {status === ActionStatus.PENDING && <AiOutlineMinusCircle />}
      <p>{status}</p>
    </div>
  );
};

export default TxStatus;
