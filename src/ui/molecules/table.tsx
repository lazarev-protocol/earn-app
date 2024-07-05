import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { IColumn } from '@/utils/types';
import { isAddress } from 'viem';
import { truncate } from '@/utils/helpers';
import { Skeleton } from '@mui/material';
import LinkAtom from '../atoms/Link';

export type ITableType = 'pools' | 'custom';

type ITableItem = Record<string, string | number>;

type ITable = {
  columns: readonly IColumn[];
  data: ITableItem[];
  uidKey: string;
  action?: ReactNode;
  loading?: boolean;
};

export default function TableMolecule({
  data,
  columns,
  uidKey,
  action,
  loading,
}: ITable) {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (e: React.SyntheticEvent, index: number) => {
    e.preventDefault();
    const uid = data?.[index]?.[uidKey];
    if (!uid) {
      console.error('uid not found');
      return;
    }
    router.push(`/pools/${uid}`);
  };

  const extractData = (value: any) => {
    const extractor = () => {
      if (value?.normalized) return value?.normalized;
      return value;
    };
    const extracted = extractor();
    if (isAddress(extracted)) {
      return <LinkAtom href="#">{truncate(extracted)}</LinkAtom>;
    }
    return extracted;
  };

  const rows = useMemo(() => {
    if (loading) {
      const mockOb = columns.reduce(
        (acc, curr) => {
          acc[curr.id] = 'loading';
          return acc;
        },
        {} as Record<string, string>,
      );
      return Array(1).fill(mockOb);
    }
    if (!data) return [];

    const sliced = data?.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
    return sliced;
  }, [JSON.stringify(data), page, rowsPerPage]);

  return (
    <Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.value}
                </TableCell>
              ))}
              {action ? <TableCell /> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.name}
                  onClick={(e) => handleRowClick(e, i)}
                  style={{ cursor: 'pointer' }}
                >
                  {columns.map((column) => {
                    let value = row[column.id as keyof ITableItem];
                    value = extractData(value);
                    value =
                      column.format && typeof value === 'number'
                        ? column.format(value)
                        : value;
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {loading ? (
                          <Skeleton variant="text" height={36} />
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                  {action ? (
                    <TableCell align={'right'}>{action}</TableCell>
                  ) : null}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
