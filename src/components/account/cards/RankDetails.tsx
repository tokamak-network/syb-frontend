//components/cards/RankDetails.tsx

import { Button } from '@/components';

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
		<div className="flex w-[400px] flex-col space-y-8">
			<div
				className="relative h-[250px] space-y-10 rounded-lg bg-cover bg-center px-2 py-3 shadow-lg"
				style={{ backgroundImage: "url('/images/accountinfo-score.png')" }}
			>
				<div className="space-y-10 px-8">
					<p className="font-poppins text-2xl">Uniqueness score</p>
					<p className="font-roboto text-2xl">
						<span className="font-bold text-[#FFDA56]">{score}</span> score
					</p>
				</div>
				<p className="text-md px-8">
					<span className="text-4xl font-bold text-[#FF0F3A]">{rank}</span>/
					{totalUsers} users
				</p>
			</div>
			<div className="flex justify-between">
				<Button className="w-full rounded-lg bg-rank-card-gradient-to-r text-xl font-semibold">
					More Details
				</Button>
			</div>
		</div>
	);
};
