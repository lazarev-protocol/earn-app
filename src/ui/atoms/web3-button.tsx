import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { FALLBACK_CHAINID } from '@/utils/constants/web3';
import ConnectWalletMolecule from '../molecules/connect-wallet';

interface IWeb3Button extends ButtonProps {}

export default function Web3Button(props: IWeb3Button) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  if (!address) {
    return (
      <div>
        <ConnectWalletMolecule
          btnFullWidth
          variant="contained"
          color="primary"
        />
      </div>
    );
  }

  if (chainId !== FALLBACK_CHAINID) {
    return (
      <Button
        {...props}
        onClick={(e) => {
          e.preventDefault();
          switchChain({ chainId: FALLBACK_CHAINID });
        }}
        disabled={false}
        variant="contained"
      >
        Switch Network
      </Button>
    );
  }

  return (
    <Button {...props} variant="contained">
      {props.children}
    </Button>
  );
}
