# Sybil Guard Project

A Next.js web application for the Tokamak Sybil-Resistance system, creating an identity-proving algorithm and zk-rollup network for user identification.

## Project Overview

Sybil Guard is a blockchain security project focused on:

- **ZK-RollUp**: A layer 2 scaling solution with enhanced security features
- **Proof of Liquidity**: LP to pools of your choice, engaging in PoL in exchange for blobspace
- **Interoperability**: Seamless integration with various blockchain networks
- **Flexible Gas Fees**: Support for using various tokens as gas fees

### Core Components

- **Sequencer**: Initially the zk-rollup will have just one operator (sequencer) that stores state (accounts, vouches, scores) as a Merkle tree
- **Smart Contract**: Receives batches from the sequencer, verifies snark proofs, and updates state root
- **Circuit**: Contains the logic for applying transactions and updating the state tree, written in circom language

## Technologies

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS, Framer Motion
- **Authentication**: NextAuth.js with Prisma adapter
- **Blockchain Integration**: ethers.js, wagmi, viem
- **State Management**: Zustand
- **Data Visualization**: Chart.js, React Flow
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm
- PostgreSQL database (for Prisma)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/syb-frontend.git
   cd syb-frontend
   ```

2. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/sybil_guard"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   # Add any other required environment variables
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:

   ```bash
   yarn dev
   # or
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/app`: Next.js app router pages and API routes
- `src/components`: Reusable React components
- `src/blockchain`: Blockchain integration services
- `src/context`: React context providers
- `src/hooks`: Custom React hooks
- `src/utils`: Utility functions
- `src/types`: TypeScript type definitions
- `prisma`: Database schema and migrations

## Testing

Run tests with:

```bash
yarn test
# or
npm test
```

## Deployment

The project can be deployed on Vercel or any other platform that supports Next.js applications.

## License

All rights reserved. © SYB 2025
