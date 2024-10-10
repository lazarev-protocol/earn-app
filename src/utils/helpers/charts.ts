import { type IPool, type IPoolLoan } from '@augustdigital/sdk';
import { getTokenSymbol } from './ui';

export function getProtocolExposureData(pool: IPool) {
  const protocolAllocation: { [key: string]: number } = {};

  const loans = pool.loans ? [...pool.loans] : [];

  loans.forEach((loan: IPoolLoan) => {
    if (!loan.positions || loan.positions.length === 0) return;

    // @ts-expect-error
    loan.positions.forEach((position: { label: string; value: string }) => {
      protocolAllocation[position.label] =
        (protocolAllocation[position.label] || 0) + loan.allocation * 100;
    });
  });

  const totalAllocation = Object.values(protocolAllocation).reduce(
    (acc, value) => acc + value,
    0,
  );

  const normalizedProtocolAllocation = { ...protocolAllocation };
  Object.keys(normalizedProtocolAllocation).forEach((key) => {
    const allocation = normalizedProtocolAllocation[key] ?? 0;
    normalizedProtocolAllocation[key] = (allocation / totalAllocation) * 100;
  });

  const labels = Object.keys(normalizedProtocolAllocation);
  const data = Object.values(normalizedProtocolAllocation);

  return {
    labels,
    datasets: [
      {
        label: '',
        data,
        backgroundColor: [
          '#003f5c',
          '#58508d',
          '#bc5090',
          '#ff6361',
          '#ffa600',
        ],
        hoverBackgroundColor: [
          '#003f5c',
          '#58508d',
          '#bc5090',
          '#ff6361',
          '#ffa600',
        ],
      },
    ],
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label(context: any) {
              const label = context.label || '';
              const value = context.raw || 0;
              return `${label}: ${value.toFixed(2)}%`; // Add % sign
            },
          },
        },
      },
    },
  };
}

export function getTokenExposureData(pool: IPool) {
  if (!pool || !Array.isArray(pool.loans)) {
    return {
      labels: [],
      datasets: [],
    };
  }

  const tokenAllocation: { [token: string]: number } = {};

  pool.loans.forEach((loan: IPoolLoan) => {
    // @ts-expect-error
    loan.exposure?.forEach((token: { value: string; label: string }) => {
      let tokenSymbol = getTokenSymbol(token.value, pool.chainId);

      if (tokenSymbol.length > 30) {
        tokenSymbol = token.label;
      }

      if (!tokenSymbol.includes('_')) {
        tokenAllocation[tokenSymbol] =
          (tokenAllocation[tokenSymbol] || 0) + loan.allocation * 100;
      }
    });
  });

  const labels = Object.keys(tokenAllocation);
  const data = Object.values(tokenAllocation);

  return {
    labels,
    datasets: [
      {
        label: '',
        data,
        backgroundColor: [
          '#003f5c',
          '#58508d',
          '#bc5090',
          '#ff6361',
          '#ffa600',
        ],
        hoverBackgroundColor: [
          '#003f5c',
          '#58508d',
          '#bc5090',
          '#ff6361',
          '#ffa600',
        ],
      },
    ],
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label(context: any) {
              const label = context.label || '';
              const value = context.raw || 0;
              return `${label}: ${value.toFixed(2)}%`; // Add % sign
            },
          },
        },
      },
    },
  };
}
