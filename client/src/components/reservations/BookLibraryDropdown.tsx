import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLibrariesWithBook } from '../../api/book';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { LibraryViewModelType } from '../../models/LibraryViewModel';

function LibraryDropdown({
  data,
}: {
  data: { data: LibraryViewModelType[]; setSelectedLibrary: (libraryId: string) => void };
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
        {data.data.map((library) => (
          <MenuItem key={library.id} value={library.id}>
            {library.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function LibrariesWithBook(bookId: string, setSelectedLibrary: (libraryId: string) => void) {
  const { data, status } = useQuery(['booksInLibrary', bookId], async (context) => {
    const bookId = context.queryKey[1] as string;
    return await getLibrariesWithBook(bookId);
  });

  return (
    <div>
      {status == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
      {status == 'error' && (
        <Typography variant="h3" color={'error'}>
          Błąd!
        </Typography>
      )}

      {status == 'success' && <LibraryDropdown data={{ data, setSelectedLibrary }} />}
    </div>
  );
}

