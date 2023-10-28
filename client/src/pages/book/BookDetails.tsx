import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router';
import { AuthorViewModelType } from '../../models/AuthorViewModel';
import { getBook } from '../../api/book';
import { useQuery } from '@tanstack/react-query';
import { BookCategoryViewModelType } from '../../models/BookCategoryViewModel';
import AddBookToCart from '../../components/reservations/BookLibraryDropdown';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import FilledField from '../../components/FilledField';

function AuthorsTable({ authors }: { authors: AuthorViewModelType[] }) {
  const authorNames = authors.map((author) => `${author.firstName} ${author.lastName}`).join(', ');

  return <FilledField label={authors.length > 1 ? 'autorzy' : 'autor'} value={authorNames} />;
}

function CategoryTable({ categories }: { categories: BookCategoryViewModelType[] }) {
  const categoriesNames = categories.map((category) => category.name).join(', ');

  return <FilledField label={categories.length > 1 ? 'kategorie' : 'kategoria'} value={categoriesNames} />;
}

function BookDetails() {
  const params = useParams();
  const [bookId, setBookId] = useState<string>('');

  const { data, status } = useQuery({
    queryKey: ['books', params.bookId],
    queryFn: () => getBook(params.bookId + ''),
  });

  useEffect(() => {
    if (status === 'success' && data?.id) {
      setBookId(data.id);
    }
  }, [data?.id, status]);

  const item = { img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e', title: 'hardcodedImg' };

  return (
    <div>
      <Box m={4}>
        {status == 'loading' && 'Ładowanie...'}
        {status == 'error' && 'Błąd!'}
        {status == 'success' && (
          <div>
            <Typography variant="h4" padding={2} marginTop={8} marginBottom={4}>
              {data.title}
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} md={5}>
                <img
                  srcSet={`${item.img}`}
                  src={`${item.img}`}
                  alt={item.title}
                  width="300px"
                  height="400px"
                  loading="lazy"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', padding: 1 }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <FilledField label="ISBN" value={data.isbn} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <FilledField label="Rok wydania" value={data.yearPublished + ''} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <FilledField label="Wydawca" value={data.publisher?.name + ''} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <AuthorsTable authors={data.authors} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <CategoryTable categories={data.bookCategories} />
                  </div>
                </Box>
              </Grid>
              <Grid></Grid>
            </Grid>
          </div>
        )}
      </Box>
      {AddBookToCart(bookId)}
    </div>
  );
}

export default BookDetails;

