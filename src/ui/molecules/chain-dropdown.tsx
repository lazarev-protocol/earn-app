'use client';

import { augustSdk } from '@/config/august-sdk';
import { FALLBACK_CHAINID } from '@/utils/constants/web3';
import { formatChainForImg } from '@/utils/helpers/ui';
import { type IChainId } from '@augustdigital/sdk';
import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useChainId, useChains, useSwitchChain } from 'wagmi';

const ChainDropdown = () => {
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const chains = useChains();
  const [activeChain, setActiveChain] = useState<string>(
    String(chainId || FALLBACK_CHAINID),
  );

  function renderer(_value?: string) {
    const value = chains?.find((chain) => chain.id === Number(_value))?.name;
    if (!value) return 'Unknown';
    return (
      <Stack justifyContent={'center'} alignItems={'center'}>
        <Image
          src={formatChainForImg(Number(_value), chains).formatted}
          alt={value}
          height={20}
          width={20}
        />
      </Stack>
    );
  }

  const handleChange = async (event: SelectChangeEvent) => {
    const changeChainId = Number(event.target.value);
    const foundChain = chains.find(({ id }) => id === Number(changeChainId));
    if (foundChain) switchChain({ chainId: changeChainId });
  };

  useEffect(() => {
    const foundChain = chains.find(({ id }) => id === chainId);
    if (foundChain) {
      setActiveChain(String(foundChain.id));
      augustSdk.switchNetwork(foundChain.id as IChainId);
    }
  }, [chainId, chains?.length]);

  return (
    <Box>
      <FormControl fullWidth>
        <Select
          value={activeChain}
          renderValue={renderer}
          onChange={handleChange}
          size="small"
          variant="outlined"
          color="primary"
          placeholder="Select Network"
        >
          {chains?.map((chain, i) => (
            <MenuItem key={`chain-dropdown-${i}`} value={chain.id}>
              <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
                <Image
                  src={formatChainForImg(Number(chain.id), chains).formatted}
                  alt={chain.name}
                  height={20}
                  width={20}
                />
                <Typography> {chain.name} </Typography>
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ChainDropdown;
