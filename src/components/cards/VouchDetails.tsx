//components/cards/VouchDetails.tsx

import Button from "../Button";

interface VouchDetailsCardProps {
  vouches: number;
}

const VouchDetailsCard: React.FC<VouchDetailsCardProps> = ({ vouches }) => {
  return (
    <div className="flex flex-col space-y-8 w-[400px]">
      <div
        className="relative h-[250px] bg-cover bg-center rounded-lg shadow-lg py-3 px-2 space-y-20"
        style={{ backgroundImage: "url('/images/accountinfo-vouches.png')" }}
      >
        <div className="space-y-10 px-8">
          <p className="font-poppins text-2xl">Vouches</p>
          <p className="font-roboto text-2xl">
            <span className="text-3xl text-[#873304] font-roboto font-semibold">
              {vouches}
            </span>{" "}
            vouches received
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <Button className="text-xl font-semibold rounded-lg w-full bg-gradient-to-r">
          See Vouches
        </Button>
      </div>
    </div>
  );
};

export default VouchDetailsCard;
