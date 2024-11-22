import Stack from '@mui/material/Stack';
import type { IChainId, IPoolWithUnderlying } from '@augustdigital/sdk';
import useInput from '@/hooks/use-input';
import useDeposit from '@/hooks/use-deposit';
import ModalAtom from '../atoms/modal';
import AssetInputMolecule from '../molecules/asset-input';
import Web3Button from '../atoms/web3-button';
import TxFeesAtom from '../molecules/tx-fees';

export default function DepositModalMolecule(
  props: IPoolWithUnderlying | undefined,
) {
  const inInputProps = useInput(
    props?.underlying?.address,
    props?.chainId as IChainId,
  );
  const { handleDeposit, isSuccess, button, expected } = useDeposit({
    ...inInputProps,
    asset: props?.asset,
    pool: props?.address,
    poolName: props?.name,
    chainId: props?.chainId as IChainId,
  });

  return (
    <ModalAtom
      title="Deposit"
      buttonProps={{
        children: 'Deposit',
        variant: 'outlined',
        disabled: !props?.address,
      }}
      // TODO: leave modal open for 4 seconds
      onClose={inInputProps.clearInput}
      closeWhen={isSuccess}
    >
      <Stack gap={2}>
        <AssetInputMolecule
          {...inInputProps}
          address={props?.underlying?.address}
          type="In"
          chainId={props?.chainId as IChainId}
        />
        <AssetInputMolecule
          address={props?.address}
          type="Out"
          value={expected.loading ? ' ' : expected.out.normalized}
          loading={+expected.loading}
          chainId={props?.chainId as IChainId}
        />
        <TxFeesAtom
          function="deposit"
          in={props?.underlying?.address}
          out={props?.address}
          fee={BigInt(expected.fee.raw)}
          loading={+expected.loading}
          chainId={props?.chainId}
          pool={{
            apy: props?.hardcodedApy || props?.apy,
            collateral: props?.collateral,
          }}
        />
      </Stack>
      <Stack mt={3}>
        <Web3Button
          onClick={handleDeposit}
          size="large"
          variant="contained"
          disabled={button.disabled}
          chainId={props?.chainId}
        >
          {button.text}
        </Web3Button>
      </Stack>
    </ModalAtom>
  );
}
