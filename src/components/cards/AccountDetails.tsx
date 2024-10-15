//components/cards/AccountDetails.tsx

interface AccountDetailsCardProps {
  balance: number;
  address: string;
}

const AccountDetailsCard: React.FC<AccountDetailsCardProps> = ({
  balance,
  address,
}) => {
  return (
    <div
      className="relative w-[400px] h-[250px] bg-cover bg-center rounded-lg shadow-lg py-3 px-2 space-y-20"
      style={{ backgroundImage: "url('/images/accountinfo-Eth.png')" }}
    >
      <div className="space-y-10 px-8">
        <p className="font-poppins text-2xl">Balance</p>
        <p className="font-roboto text-3xl">{balance}</p>
      </div>
      <p className="text-sm text-center">{address}</p>
    </div>
  );
};

export default AccountDetailsCard;
