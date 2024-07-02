import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import MuiModal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { TfiClose } from 'react-icons/tfi';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  boxShadow: 12,
};

export default function Modal({
  buttonProps,
  children,
  title,
  closeWhen,
}: {
  title: string;
  buttonProps: ButtonProps;
  children: React.ReactNode;
  closeWhen?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    setOpen(true);
  };
  const handleClose = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    setOpen(false);
  };

  React.useEffect(() => {
    if (typeof closeWhen !== 'undefined') {
      if (closeWhen) handleClose();
    }
  }, [closeWhen]);

  return (
    <div>
      <Button {...buttonProps} onClick={buttonProps?.onClick ?? handleOpen}>
        {buttonProps.children}
      </Button>
      <MuiModal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose as () => void}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Card style={{ padding: '1rem' }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
              >
                <Typography variant="h5" mb={2}>
                  {title}
                </Typography>
                <Button
                  variant="text"
                  onClick={handleClose}
                  style={{
                    borderRadius: '50%',
                    padding: '6px',
                    width: '32px',
                    height: '32px',
                    minWidth: '0',
                    minHeight: '0',
                  }}
                >
                  <TfiClose />
                </Button>
              </Stack>
              {children}
            </Card>
          </Box>
        </Fade>
      </MuiModal>
    </div>
  );
}
