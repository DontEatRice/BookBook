import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { BookViewModelType } from '../../models/BookViewModel';
import { useQuery } from '@tanstack/react-query';
import { getBooks } from '../../api/book';
import { useState } from 'react';
import LibrariesWithBook from './BookLibraryDropdown';
import { addToCart } from '../../api/cart';

export default function Reservations() {
  const { data, status } = useQuery({ queryKey: ['books'], queryFn: getBooks });
  const [selectedLibrary, setSelectedLibrary] = useState('');

  return (
    <div>
      {status == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
      {status == 'error' && (
        <Typography variant="h3" color={'error'}>
          Błąd!
        </Typography>
      )}
      {status == 'success' && <BooksTable data={data} />}
    </div>
  );

  function BooksTable({ data }: { data: BookViewModelType[] }) {
    const [error, setError] = useState<string>('');

    const handleAddToCart = async (bookId: string, libraryId: string) => {
      try {
        await addToCart({ bookId, libraryId });
        setError('');
      } catch (error) {
        const err = error as Error;
        switch (err.message) {
          case 'BOOK_ALREADY_IN_CART':
            setError('Książka została już dodana do koszyka');
            break;
          case 'BOOK_NOT_FOUND':
            setError('Książka nie została znaleziona');
            break;
          case 'LIBRARY_NOT_FOUND':
            setError('Biblioteka nie została znaleziona');
            break;
          default:
            setError(`Wystąpił nieznany błąd: ${err.message}`);
            break;
        }
      }
    };

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tytuł</TableCell>
              <TableCell>Biblioteka</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{LibrariesWithBook(book.id, setSelectedLibrary)}</TableCell>
                <TableCell>
                  <Button
                    disabled={selectedLibrary == ''}
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(book.id, selectedLibrary)}>
                    Dodaj
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {error && (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        )}
      </TableContainer>
    );
  }
}

