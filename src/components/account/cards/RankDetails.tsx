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
		<div className="flex flex-col space-y-8 rounded-3xl border-2 border-white border-opacity-50 p-4">
			<div className="border-3 relative h-[250px] space-y-8 rounded-lg border-white/40 py-3 shadow-lg">
				<div className="w-full rounded-lg border-2 border-white border-opacity-60 bg-primary bg-opacity-30 p-3 shadow-md">
					<h3 className="text-xl font-semibold text-white">Uniqueness Score</h3>
					<p className="text-lg text-white">{score}</p>
				</div>
				<div className="w-full rounded-lg border-2 border-white border-opacity-60 bg-primary bg-opacity-30 p-3 shadow-md">
					<h3 className="text-xl font-semibold text-white">Rank</h3>
					<p className="text-lg text-white">
						<span className="text-4xl font-bold text-[#FF0F3A]">{rank}</span>/
						{totalUsers} users
					</p>
				</div>
			</div>
			<Button className="min-w-[33%] rounded-lg border-2 border-white border-opacity-50 text-xl font-semibold">
				More Details
			</Button>
		</div>
	);
};
