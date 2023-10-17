import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import BookTile from '../../components/BookTile';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { BookViewModelType } from '../../models/BookViewModel';
import { useParams } from 'react-router';
import { AuthorViewModelType } from '../../models/AuthorViewModel';
import { getBook } from '../../api/book';
import { useQuery } from '@tanstack/react-query';

function AuthorsTable({ authors }: { authors: AuthorViewModelType[] }) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Autorzy</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {authors.map((author) => (
                <TableRow key={author.id}>
                <TableCell>{author.firstName + " " + author.lastName}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    )
}

function BookDetails() {
    const params = useParams();
    const { data, status } = useQuery({ queryKey: ['books', params.bookId], queryFn: () => getBook(params.bookId+"") });

    return (
        <Box mt={2}>
            {status == 'loading' && 'Ładowanie...'}
            {status == 'error' && (
              'Błąd!'
            )}
            {status == 'success' && <div>essa</div> && (
                <Grid container spacing={2} direction="column">
                    <Grid item><FilledComponent label="ISBN" value={data.isbn}/></Grid>
                    <Grid item><FilledComponent label="Tytuł" value={data.title}/></Grid>
                    <Grid item><FilledComponent label="Wydawca" value={data.publisher?.name+""} /></Grid>
                    <AuthorsTable authors = {data.authors}/>
                </Grid>
            )}
        </Box>
    );
}

function FilledComponent({ label, value }: { label: string; value: string }) {
    return (
        <TextField id={label + "Id"} label={label}  variant="filled" value={value} InputProps={{readOnly: true}}/>
    );
  }

export default BookDetails;