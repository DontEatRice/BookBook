import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLibrariesWithBook } from '../../api/book';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { LibraryViewModelType } from '../../models/LibraryViewModel';
import { Button } from '@mui/material';
import { addToCart } from '../../api/cart';

function LibraryDropdown({
  data,
}: {
  data: { data: LibraryViewModelType[] | undefined; setSelectedLibrary: (libraryId: string) => void };
}) {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleChange = (event: { target: { value: string } }) => {
    setSelectedOption(event.target.value as string);
    data.setSelectedLibrary(event.target.value as string);
  };

  return (
    <FormControl>
      <InputLabel>Select an Option</InputLabel>
      <Select labelId="demo-simple-select-label" value={selectedOption} onChange={handleChange}>
        {data.data &&
          data.data?.length > 0 &&
          data.data.map((library) => (
            <MenuItem key={library.id} value={library.id}>
              {library.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}

export default function AddBookToCart(bookId: string) {
  const [error, setError] = useState<string>('');
  const [selectedLibrary, setSelectedLibrary] = useState<string>('');
  const { data, status } = useQuery(['booksInLibrary', bookId], async (context) => {
    if (context.queryKey[1] != '') {
      const bookId = context.queryKey[1] as string;
      return await getLibrariesWithBook(bookId);
    }
    return [];
  });

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
    <div>
      {status == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
      {status == 'error' && (
        <Typography variant="h3" color={'error'}>
          Błąd!
        </Typography>
      )}

      {status == 'success' && (
        <div>
          <LibraryDropdown data={{ data, setSelectedLibrary }} />
          <Button
            disabled={selectedLibrary == ''}
            variant="contained"
            color="primary"
            onClick={() => handleAddToCart(bookId, selectedLibrary)}>
            Dodaj
          </Button>
          {error && (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
}

