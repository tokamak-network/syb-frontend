'use client';

import React, { useState } from 'react';

import { Tabs } from '@/components/common/Tabs';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { SocialAuth } from '@/components/auth/SocialAuth';

const LoginPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<div className="w-full max-w-md rounded-lg p-6 shadow-md">
				<Tabs
					activeTab={activeTab}
					tabs={[
						{ label: 'Login', value: 'login' },
						{ label: 'Signup', value: 'signup' },
					]}
					onTabChange={(tab) => setActiveTab(tab as 'login' | 'signup')}
				/>
				<div className="mt-6">
					{activeTab === 'login' ? <LoginForm /> : <SignupForm />}
				</div>
				<div className="mt-6">
					<SocialAuth />
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
