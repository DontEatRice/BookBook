import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLibrariesWithBook } from '../../api/book';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { LibraryViewModelType } from '../../models/LibraryViewModel';
import { Box, Button } from '@mui/material';
import { addToCart } from '../../api/cart';
import { useCartStore } from '../../store';
import { translateErrorCode } from '../../utils/functions/utilFunctions';

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
    <FormControl sx={{ minWidth: 120 }}>
      <InputLabel>Wybierz</InputLabel>
      <Select
        label="biblioteka"
        labelId="demo-simple-select-label"
        value={selectedOption}
        onChange={handleChange}>
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

export default function AddBookToCart({ bookId }: { bookId: string }) {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const cartStore = useCartStore();
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
      setSuccess('Dodano do koszyka!');
      cartStore.toggleIsChanged();
    } catch (error) {
      const err = error as Error;
      setSuccess('');
      setError(translateErrorCode(err.message));
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
          <Box sx={{ display: 'flex', flex: 'column', padding: 2, margin: 2 }}>
            <LibraryDropdown data={{ data, setSelectedLibrary }} />
            <Button
              disabled={selectedLibrary == ''}
              variant="contained"
              color="primary"
              onClick={() => handleAddToCart(bookId, selectedLibrary)}
              sx={{ marginLeft: 2 }}>
              Dodaj do koszyka
            </Button>
          </Box>
          {success && (
            <Typography variant="h5" color="green" marginBottom={4}>
              {success}
            </Typography>
          )}
        </div>
      )}
      {error && (
        <Typography marginLeft={4} marginBottom={4} variant="body1" color="error">
          {error}
        </Typography>
      )}
    </div>
  );
}

