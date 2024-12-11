import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

interface Tab {
	label: string;
	value: string;
}

interface TabsProps {
	tabs: Tab[];
	activeTab: string;
	onTabChange: (value: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
	return (
		<TabsPrimitive.Root
			className="flex flex-col"
			value={activeTab}
			onValueChange={onTabChange}
		>
			<TabsPrimitive.List className="flex border-b">
				{tabs.map((tab) => (
					<TabsPrimitive.Trigger
						key={tab.value}
						className={`flex-1 py-2 text-center ${
							activeTab === tab.value
								? 'border-b-2 border-blue-500 text-blue-500'
								: 'text-gray-500'
						}`}
						value={tab.value}
					>
						{tab.label}
					</TabsPrimitive.Trigger>
				))}
			</TabsPrimitive.List>
		</TabsPrimitive.Root>
	);
};
