# Score Update Components

This directory contains components for managing user scores in the Sybil system.

## Components

### ScoreManager

A comprehensive component that provides both score proving and updating functionality.

**Props:**

- `currentScore: number` - The current score to display
- `batchNumber: number` - The batch number for Merkle proof verification

**Features:**

- Tabbed interface for switching between "Prove Score" and "Update Score"
- Form validation and error handling
- Integration with smart contract functions
- Success feedback with transaction links

### ScoreUpdateButton

A reusable button component for score operations.

**Props:**

- `userAddress: string` - The address of the user
- `batchNumber: number` - The batch number for Merkle proof verification
- `variant: 'prove' | 'update'` - The type of operation
- `score?: number` - Required for update variant
- `onSuccess?: (txHash: string) => void` - Success callback
- `onError?: (error: string) => void` - Error callback

## Usage

### Basic Usage

```tsx
import { ScoreManager } from '@/components/score';

function MyComponent() {
	return <ScoreManager currentScore={150} batchNumber={1} />;
}
```

### Using ScoreUpdateButton Directly

```tsx
import { ScoreUpdateButton } from '@/components/button';

function MyComponent() {
	return (
		<ScoreUpdateButton
			userAddress="0x1234..."
			batchNumber={1}
			variant="prove"
			onSuccess={(txHash) => console.log('Success:', txHash)}
			onError={(error) => console.error('Error:', error)}
		/>
	);
}
```

## Backend Integration

The components integrate with the following backend endpoints:

- `GET /api/v1/scoremerkleproof/:idx` - Get Merkle proof for score verification
- `GET /api/v1/accounts/address/:address` - Get account information by address

## Smart Contract Functions

The components interact with these smart contract functions:

- `proveScoreMerkleProof` - Verify score using Merkle proof
- `updateScore` - Direct score update (admin function)

## Error Handling

All components include comprehensive error handling:

- Network errors
- Smart contract errors
- Validation errors
- User-friendly error messages

## Styling

Components use Tailwind CSS classes and follow the existing design system patterns.
