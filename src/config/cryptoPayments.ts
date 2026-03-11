export interface CryptoAddress {
  name: string;
  symbol: string;
  address: string;
  memo?: string;
  network?: string;
  icon: string; // lucide icon name or emoji
}

export const CRYPTO_ADDRESSES: Record<string, CryptoAddress> = {
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    address: '15Z9UvjeLc5zQ1uhemyCeobvpz7Wg2UaYu',
    network: 'Bitcoin (BTC)',
    icon: '₿'
  },
  ethereum: {
    name: 'Ethereum / ERC-20',
    symbol: 'ETH',
    address: '0xc530cfc3a9a4e57cb35183ea1f5436aa1f8fc73c',
    network: 'Ethereum',
    icon: 'Ξ'
  },
  usdt_polkadot: {
    name: 'Tether (USDT)',
    symbol: 'USDT',
    address: '12xM7g2sVoLqrVqZf6CFH82aYA674uEctsEN8sHnUDkS9YPQ',
    network: 'Asset Hub (Polkadot)',
    icon: '₮'
  },
  aptos: {
    name: 'Aptos',
    symbol: 'APT',
    address: '0xa4510c0481a7d0a2983633af029fab9550441554b86393d460d66403e37312fe',
    network: 'Aptos',
    icon: 'Λ'
  },
  tron: {
    name: 'Tron',
    symbol: 'TRX',
    address: 'TMW3RxyTgBXuDp4D2q7BhrDfcimYAqWXsB',
    network: 'Tron (TRX)',
    icon: '⧫'
  },
  bnb: {
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    address: '0xc530cfc3a9a4e57cb35183ea1f5436aa1f8fc73c',
    network: 'BNB Smart Chain (BEP20)',
    icon: '⬡'
  },
  arbitrum: {
    name: 'Arbitrum One',
    symbol: 'ARB',
    address: '0xc530cfc3a9a4e57cb35183ea1f5436aa1f8fc73c',
    network: 'Arbitrum One',
    icon: 'Ⱥ'
  },
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    address: 'CbcWb97K3TEFJZJYLZRqdsMSdVXTFaMaUcF6yPQgY9yS',
    network: 'Solana (SOL)',
    icon: '◎'
  },
  ton: {
    name: 'Toncoin',
    symbol: 'TON',
    address: 'EQD2P3X9U0R8tVH1N2yj_Y7NkD7BH--02HuBEqzkT3XXi3mD',
    memo: '641022568',
    network: 'Toncoin',
    icon: '⟡'
  },
  polygon: {
    name: 'Polygon / Base',
    symbol: 'POLY',
    address: '0xc530cfc3a9a4e57cb35183ea1f5436aa1f8fc73c',
    network: 'Polygon / Kaia / Plasma / Base',
    icon: '◀'
  },
  xrp: {
    name: 'XRP (Ripple)',
    symbol: 'XRP',
    address: 'rpWJmMcPM4ynNfvhaZFYmPhBq5FYfDJBZu',
    memo: '2135060125',
    network: 'Ripple',
    icon: '✕'
  },
  stellar: {
    name: 'Stellar',
    symbol: 'XLM',
    address: 'GCB4QJYFM56UC2UCVIEYMELK6QVCCTF533OMKU4QRUY5MHLP5ZDQXEQU',
    memo: '475001388',
    network: 'Stellar (XLM)',
    icon: '★'
  },
  dogecoin: {
    name: 'Dogecoin',
    symbol: 'DOGE',
    address: 'DJungBB29tYgcuUXnXUpParVN9BTwKj4kH',
    network: 'Dogecoin (DOGE)',
    icon: '🐕'
  },
  cardano: {
    name: 'Cardano',
    symbol: 'ADA',
    address: 'addr1vxs8l5cw4vczt00m4va5yqy3ygtgu6rdequn82ncq3umn3stg67g2',
    network: 'Cardano',
    icon: '◆'
  },
  bitcoincash: {
    name: 'Bitcoin Cash',
    symbol: 'BCH',
    address: '1C9hSv7WGZ3LBWaam6QFvXmPzyHDrVJnxr',
    network: 'Bitcoin Cash (BCH)',
    icon: '฿'
  },
  hype: {
    name: 'Hyperliquid',
    symbol: 'HYPE',
    address: '0xc530cfc3a9a4e57cb35183ea1f5436aa1f8fc73c',
    network: 'Hyperliquid',
    icon: '⚡'
  },
  litecoin: {
    name: 'Litecoin',
    symbol: 'LTC',
    address: 'LcwH9ny5ykyuhX83xQ86j8FqM3ut2dKvJ6',
    network: 'Litecoin (LTC)',
    icon: 'Ł'
  },
  sui: {
    name: 'Sui',
    symbol: 'SUI',
    address: '0x5522950a29882692e38949a1da2bad51e676058a9caf76f7edf1f02ed73f20bb',
    network: 'Sui',
    icon: '◈'
  },
  hedera: {
    name: 'Hedera',
    symbol: 'HBAR',
    address: '0.0.9932322',
    memo: '2102701194',
    network: 'Hedera',
    icon: '⬟'
  },
  worldchain: {
    name: 'World Chain',
    symbol: 'WLD',
    address: '0xc530cfc3a9a4e57cb35183ea1f5436aa1f8fc73c',
    network: 'World Chain (WLD)',
    icon: '🌍'
  }
};

export const CRYPTO_OPTIONS = Object.entries(CRYPTO_ADDRESSES).map(([key, value]) => ({
  key,
  ...value
}));

export const PRIMARY_CRYPTOS = ['bitcoin', 'ethereum', 'solana', 'tron', 'dogecoin'];
