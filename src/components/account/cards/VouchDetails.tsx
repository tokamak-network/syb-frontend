//components/cards/VouchDetails.tsx

import { Button } from '@/components';

interface VouchDetailsCardProps {
	vouches: number;
}

export const VouchDetailsCard: React.FC<VouchDetailsCardProps> = ({
	vouches,
}) => {
	return (
		<div className="flex flex-col space-y-8 rounded-3xl border-2 border-white border-opacity-50 p-4">
			<div className="w-full rounded-lg border-2 border-white border-opacity-60 bg-primary bg-opacity-30 p-3 shadow-md">
				<h3 className="text-xl font-semibold text-white">Vouches</h3>
				<p className="font-roboto text-2xl">
					<span className="font-roboto text-3xl font-semibold text-[#873304]">
						{vouches}
					</span>{' '}
					vouches received
				</p>
			</div>
			<Button className="rounded-lg border-2 border-white border-opacity-50 text-xl font-semibold">
				See Vouches
			</Button>
		</div>
	);
};
