import { styled, useThemeProps } from '@mui/material/styles';
import * as React from 'react';

export interface StatProps {
  value: number | string;
  unit: string;
  variant?: 'outlined';
}

interface StatOwnerState extends StatProps {
  // …key value pairs for the internal state that you want to style the slot
  // but don't want to expose to the users
}

const StatRoot = styled('div', {
  name: 'MuiStat',
  slot: 'root',
})<{ ownerState: StatOwnerState }>(({ theme, ownerState }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  padding: theme.spacing(3, 4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  letterSpacing: '-0.025em',
  fontWeight: 600,
  ...(ownerState.variant === 'outlined' && {
    border: `2px solid ${theme.palette.divider}`,
    boxShadow: 'none',
  }),
}));

const StatValue = styled('div', {
  name: 'MuiStat',
  slot: 'value',
})<{ ownerState: StatOwnerState }>(({ theme }) => ({
  ...theme.typography.h4,
}));

const StatUnit = styled('div', {
  name: 'MuiStat',
  slot: 'unit',
})<{ ownerState: StatOwnerState }>(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
}));

const StatAtom = React.forwardRef<HTMLDivElement, StatProps>(
  function Stat(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiStat' });
    const { value, unit, variant, ...other } = props;

    const ownerState = { ...props, variant };

    return (
      <StatRoot ref={ref} ownerState={ownerState} {...other}>
        <StatValue ownerState={ownerState} style={{ fontFamily: 'monospace' }}>
          {value}
        </StatValue>
        <StatUnit ownerState={ownerState}>{unit}</StatUnit>
      </StatRoot>
    );
  },
);

export default StatAtom;
