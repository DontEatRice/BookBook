import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { z } from 'zod';
import Book from '../models/Book';
import Typography from '@mui/material/Typography';

function Examples() {
  type bookType = z.infer<typeof Book>;
  const [book, setBook] = useState<Partial<bookType>>({});
  // type bookType = z.infer<typeof Book>;
  const validationResult = Book.safeParse(book);
  const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
  // https://react-hook-form.com/get-started#IntegratingControlledInputs
  return (
    <>
      <Box sx={{ bgcolor: 'dimgray', width: '80%', mr: 'auto', ml: 'auto' }} p={2}>
        <label htmlFor="bookName">Nazwa książki:</label>
        <TextField
          id="bookName"
          label="Nazwa książki"
          variant="outlined"
          value={book.name}
          onChange={(e) => setBook({ ...book, name: e.target.value })}
        />
        <label htmlFor="bookPrice">Cena książki:</label>
        <input type="number" id="bookPrice" onChange={(e) => setBook({ ...book, price: +e.target.value })} />
        <p>{JSON.stringify(validationResult)}</p>
      </Box>
      <Box mt={2}>
        <Typography>VITE_API_BASE_URL={baseApiUrl}</Typography>
      </Box>
    </>
  );
}

export default Examples;
