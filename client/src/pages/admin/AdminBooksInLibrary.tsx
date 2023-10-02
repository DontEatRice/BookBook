import { useTheme } from "@mui/material/styles";
import { BookViewModelType } from "../../models/BookViewModel";
import { useQuery } from "react-query";
import { Box, Button, Grid, Typography } from "@mui/material";
import { getBooks } from "../../api/book";
import { Link } from "react-router-dom";

function BooksInLibrary({ data }: { data: BookViewModelType[] }) {
    return (
        <h1>Ksiazki w bibliotece</h1>
    );
}

function AdminBooksInLibrary() {
    const theme = useTheme();
    const { data, status } = useQuery({ queryKey: ['books'], queryFn: getBooks })

    return (
        <Box mt={1}>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                    <Typography variant="h4">Oferta książek</Typography>
                </Grid>
                <Grid item>
                    <Link to="add">
                        <Button variant="contained">Dodaj książkę do oferty</Button>
                    </Link>
                </Grid>
            </Grid>
            {status == 'loading' && <Typography variant="h3">Ładowanie...</Typography>}
            {status == 'error' && (
                <Typography variant="h3" color={theme.palette.error.main}>
                    Błąd!
                </Typography>
            )}
            {status == 'success' && <BooksInLibrary data={data} />}
        </Box>
    )
}

export default AdminBooksInLibrary;