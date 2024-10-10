import useFetcher from '@/hooks/use-fetcher';
import Base from '@/ui/skeletons/base';
import Section from '@/ui/skeletons/section';
import type {
  IAddress,
  IChainId,
  IPoolWithUnderlying,
} from '@augustdigital/sdk';
import AssetDisplay from '@/ui/atoms/asset-display';
import VaultInfo from '@/ui/organisms/vault-info';
import VaultAllocation from '@/ui/organisms/table-loans';
import Stack from '@mui/material/Stack';
import DepositModalMolecule from '@/ui/organisms/modal-deposit';
import WithdrawModalMolecule from '@/ui/organisms/modal-withdraw';
import type { UseQueryResult } from '@tanstack/react-query';
import MyPositionsTableOrganism from '@/ui/organisms/table-positions';
import { useAccount } from 'wagmi';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { augustSdk } from '@/config/august-sdk';
import { Collapse, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FALLBACK_TOKEN_IMG } from '@/utils/constants/ui';
import PieChart from '@/ui/organisms/pie-charts';
import {
  getProtocolExposureData,
  getTokenExposureData,
} from '@/utils/helpers/charts';

export async function getStaticPaths() {
  const paths = await Promise.all(
    Object.keys(augustSdk.providers).map(async (chain) => {
      augustSdk.switchNetwork(Number(chain) as IChainId);
      const res = await augustSdk.pools.getPools();
      return res.map((p) => ({
        params: { address: p.address, chain_id: chain },
      }));
    }),
  );
  const flattenedPaths = paths.flat();
  return { paths: flattenedPaths, fallback: false };
}

export const getStaticProps = (async (context) => {
  return {
    props: {
      chain_id: Number(context?.params?.chain_id) as IChainId,
      pool: context?.params?.address as IAddress,
    },
  };
}) satisfies GetStaticProps<{
  pool: string | undefined;
  chain_id: IChainId | undefined;
}>;

const PoolPage = (params: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { address } = useAccount();
  const [walletConnected, setWalletConnected] = useState(false);
  const [protocolData, setProtocolData] = useState<any>(null);
  const [tokenData, setTokenData] = useState<any>(null);

  const { data: pool, isLoading: poolLoading } = useFetcher({
    queryKey: ['lending-pool', params.pool, String(params.chain_id)],
  }) as UseQueryResult<any>;

  const { data: positions, isLoading: positionsLoading } = useFetcher({
    queryKey: ['my-positions', params.pool],
    wallet: address,
    enabled: walletConnected && !!pool?.address,
    initialData: [],
    formatter(data) {
      return data?.filter(
        (p: IPoolWithUnderlying) => p.address === pool?.address,
      );
    },
  }) as UseQueryResult<any>;

  useEffect(() => {
    if (address) setWalletConnected(true);
    else setWalletConnected(false);
  }, [address]);

  useEffect(() => {
    if (pool) {
      const protocolExposureData = getProtocolExposureData(pool);
      const tokenExposureData = getTokenExposureData(pool);

      setProtocolData(protocolExposureData);
      setTokenData(tokenExposureData);
    }
  }, [pool]);

  return (
    <Base>
      <Section
        id="earn-table"
        title={pool?.name ?? ' '}
        description={
          pool?.description ||
          `${pool?.name} vault aims to optimize ${
            pool?.underlying?.symbol || 'its underlying deposit token'
          } yield by providing liquidity to blue chip DeFi protocols and maximizing future airdrop potential.`
        }
        loading={+poolLoading}
        chainId={pool?.chainId}
        action={
          <Stack direction="column" alignItems={'end'} gap={2}>
            <AssetDisplay
              symbol={pool?.underlying?.symbol}
              img={
                pool?.underlying?.symbol
                  ? `/assets/tokens/${pool?.underlying?.symbol}.png`
                  : FALLBACK_TOKEN_IMG
              }
              variant="glass"
              address={pool?.underlying?.address}
              loading={poolLoading}
            />
            <Stack direction={'row'} gap={1}>
              <DepositModalMolecule {...pool} chainId={params?.chain_id} />
              <WithdrawModalMolecule {...pool} chainId={params?.chain_id} />
            </Stack>
          </Stack>
        }
      >
        <Stack gap={3}>
          <Stack direction="column" gap={6} mt={2}>
            <VaultInfo {...pool} loading={+poolLoading} />

            <Collapse in={walletConnected && Boolean(positions?.length)}>
              <MyPositionsTableOrganism
                title="My Positions"
                data={positions}
                loading={+positionsLoading}
              />
            </Collapse>

            {protocolData && tokenData && (
              <Grid
                container
                spacing={4}
                my={{
                  xs: 2,
                  md: 4,
                }}
                justifyContent="space-around"
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  style={{
                    height: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <PieChart data={protocolData} />
                  <Typography variant="h6" mt={2} mb={{ xs: 0, md: 1 }}>
                    Protocol Exposure
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  style={{
                    height: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <PieChart data={tokenData} />
                  <Typography variant="h6" mt={2} mb={{ xs: 0, md: 1 }}>
                    Token Exposure
                  </Typography>
                </Grid>
              </Grid>
            )}

            <VaultAllocation {...pool} loading={poolLoading} />
          </Stack>
        </Stack>
      </Section>
    </Base>
  );
};

export default PoolPage;
