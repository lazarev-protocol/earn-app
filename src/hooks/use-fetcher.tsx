import { INFURA_API_KEY } from '@/utils/constants';
import type { IAddress, IChainId } from '@augustdigital/sdk';
import { getLendingPool, getLendingPools } from '@augustdigital/sdk';
import type { UndefinedInitialDataOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { isAddress } from 'viem';
import { useChainId } from 'wagmi';

type IFetchTypes = 'lending-pools' | 'lending-pool';

interface IUseFetcher extends UndefinedInitialDataOptions {
  queryKey: (IFetchTypes | string)[];
  initialData?: any;
  disabled?: boolean;
  formatter?: (data: any) => any;
}

export default function useFetcher({
  queryKey,
  formatter,
  ...props
}: IUseFetcher) {
  const chain = useChainId();
  const infuraOptions = {
    chainId: chain as IChainId,
    apiKey: INFURA_API_KEY,
  };

  const type = queryKey?.[0];
  const address = queryKey?.[1];

  async function determineGetter() {
    switch (type) {
      case 'lending-pool': {
        if (!address || !isAddress(address)) {
          console.error('Second query key in array must be an address');
          return null;
        }
        return getLendingPool(address as IAddress, infuraOptions);
      }
      case 'lending-pools': {
        return getLendingPools(infuraOptions);
      }
      default: {
        return getLendingPools(infuraOptions);
      }
    }
  }

  const masterGetter = async () => {
    if (typeof formatter !== 'undefined')
      return formatter(await determineGetter());
    return determineGetter();
  };

  const query = useQuery({
    ...props,
    queryKey,
    queryFn: masterGetter,
  });

  return query;
}
