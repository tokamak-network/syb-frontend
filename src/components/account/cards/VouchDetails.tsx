//components/cards/VouchDetails.tsx

import { Button } from '@/components';

interface VouchDetailsCardProps {
	vouches: number;
}

export const VouchDetailsCard: React.FC<VouchDetailsCardProps> = ({
	vouches,
}) => {
	return (
		<div className="flex w-[400px] flex-col space-y-8">
			<div
				className="relative h-[250px] space-y-20 rounded-lg bg-cover bg-center px-2 py-3 shadow-lg"
				style={{ backgroundImage: "url('/images/accountinfo-vouches.png')" }}
			>
				<div className="space-y-10 px-8">
					<p className="font-poppins text-2xl">Vouches</p>
					<p className="font-roboto text-2xl">
						<span className="font-roboto text-3xl font-semibold text-[#873304]">
							{vouches}
						</span>{' '}
						vouches received
					</p>
				</div>
			</div>
			<div className="flex justify-between">
				<Button className="w-full rounded-lg bg-gradient-to-r text-xl font-semibold">
					See Vouches
				</Button>
			</div>
		</div>
	);
};
