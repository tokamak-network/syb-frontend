//components/cards/AccountDetails.tsx

import { FiArrowDownCircle, FiArrowUpCircle } from "react-icons/fi";
import Button from "../Button";

interface AccountDetailsCardProps {
  balance: number;
  address: string;
}

const AccountDetailsCard: React.FC<AccountDetailsCardProps> = ({
  balance,
  address,
}) => {
  return (
    <div className="flex flex-col space-y-8 w-[400px]">
      <div
        className="relative h-[250px] bg-cover bg-center rounded-lg shadow-lg py-3 px-2 space-y-20"
        style={{ backgroundImage: "url('/images/accountinfo-Eth.png')" }}
      >
        <div className="space-y-10 px-8">
          <p className="font-poppins text-2xl">Balance</p>
          <p className="font-roboto text-3xl">{balance}</p>
        </div>
        <p className="text-xs text-center">{address}</p>
      </div>
      <div className="flex justify-between">
        <Button
          leftIcon={FiArrowDownCircle}
          className="text-[#60BC63] border-2 border-[#60BC63] text-xl font-semibold rounded-lg min-w-[33%]"
        >
          Withdraw
        </Button>
        <Button
          leftIcon={FiArrowUpCircle}
          className="text-white border-2 border-[#60BC63] bg-[#60BC63] text-xl font-semibold rounded-lg "
        >
          Deposit
        </Button>
      </div>
    </div>
  );
};

export default AccountDetailsCard;
