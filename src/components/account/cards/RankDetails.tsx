//components/cards/RankDetails.tsx

import { Button } from "@/components";

interface RankDetailsCardProps {
  score: number;
  rank: number;
  totalUsers: number;
}

export const RankDetailsCard: React.FC<RankDetailsCardProps> = ({
  score,
  rank,
  totalUsers,
}) => {
  return (
    <div className="flex flex-col space-y-8 w-[400px]">
      <div
        className="relative h-[250px] bg-cover bg-center rounded-lg shadow-lg py-3 px-2 space-y-10"
        style={{ backgroundImage: "url('/images/accountinfo-score.png')" }}
      >
        <div className="space-y-10 px-8">
          <p className="font-poppins text-2xl">Uniqueness score</p>
          <p className="font-roboto text-2xl">
            <span className="text-[#FFDA56] font-bold">{score}</span> score
          </p>
        </div>
        <p className="text-md px-8">
          <span className="text-[#FF0F3A] font-bold text-4xl">{rank}</span>/
          {totalUsers} users
        </p>
      </div>
      <div className="flex justify-between">
        <Button className="text-xl font-semibold rounded-lg w-full bg-rank-card-gradient-to-r">
          More Details
        </Button>
      </div>
    </div>
  );
};
