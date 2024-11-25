//components/cards/VouchDetails.tsx

import { Button } from '@/components';

interface VouchDetailsCardProps {
	vouches: number;
}

export const VouchDetailsCard: React.FC<VouchDetailsCardProps> = ({
	vouches,
}) => {
	return (
		<div
			className="flex h-96 min-w-[500px] flex-col justify-between space-y-8 rounded-3xl border-2 border-white border-opacity-50 bg-cover p-4"
			style={{
				backgroundImage: 'url(/images/accountinfo.png)',
			}}
		>
			<div className="w-full rounded-lg border-2 border-white border-opacity-60 bg-primary bg-opacity-30 p-3 shadow-md duration-200 hover:cursor-default hover:bg-secondary">
				<h3 className="text-xl font-semibold text-white">Vouches</h3>
				<p className="font-anekDevanagari text-2xl">
					<span className="font-roboto text-3xl font-semibold text-[#873304]">
						{vouches}
					</span>{' '}
					vouches received
				</p>
			</div>
			<div className="w-full rounded-lg border-2 border-white border-opacity-60 bg-primary bg-opacity-30 p-3 shadow-md duration-200 hover:cursor-default hover:bg-secondary">
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
