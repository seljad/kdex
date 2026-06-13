# K DEX

> **Note:** This project is incomplete and is no longer actively developed. It is shared for reference and learning purposes only.

A decentralized exchange (DEX) frontend built on top of Uniswap V3 protocol. Supports token swapping, liquidity pool creation, position management, and multi-wallet connectivity.

## Features

- **Token Swap** — Swap ERC-20 tokens with automatic fee-tier selection based on pool liquidity
- **Liquidity Pools** — Create and manage Uniswap V3 liquidity pools
- **Positions** — Add liquidity and manage LP positions with customizable price ranges
- **Token Explorer** — Browse available tokens
- **Wallet Connect** — Multi-wallet support via WalletConnect (Reown AppKit)
- **BSC Testnet** — Deployed and tested on Binance Smart Chain Testnet

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + NextUI |
| Blockchain | Wagmi v2 + Viem + Ethers.js |
| DEX Protocol | Uniswap V3 SDK |
| Wallet | Reown AppKit (WalletConnect) |
| Data Fetching | SWR + Axios |
| Animation | Framer Motion |

## Getting Started

### Prerequisites

- Node.js 18+
- A [WalletConnect Cloud](https://cloud.walletconnect.com) project ID

### Installation

```bash
git clone https://github.com/your-username/kdex.git
cd kdex
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```env
NEXT_PUBLIC_API_ADDRESS=https://your-api-url.com
NEXT_PUBLIC_PROJECT_ID=your-walletconnect-project-id
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

### Build

```bash
npm run build
npm run start
```

## Contract Addresses (BSC Testnet)

| Contract | Address |
|---|---|
| Swap Router | `0xc5b86795810630A21e8C1b5821A01EC246C5cD6d` |
| Quoter | `0xA0fA9aB935bcCA1f5B55B1548a570Cc29d155719` |
| Factory | `0x264C2C935267ce12ADA2a2f57839Ac7424478515` |
| Position Manager | `0xE59C58a6E1B140419cE52A85cf42a138Ef086FA6` |

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable UI components
│   ├── pages/        # Page-specific components
│   ├── swap/         # Swap-related components
│   └── ui/           # Generic UI primitives
├── config/           # App configuration (wagmi, ABIs, contracts)
├── core/             # Utility functions
├── data/             # API client, models, providers
├── hooks/            # Custom React hooks
└── store/            # Global state (Zustand)
```

## Developer

**Sajjad Javadi** — [sajjadev.com](https://www.sajjadev.com)
