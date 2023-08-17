import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

function AdminPublishers() {
    return (
        <Box mt={1}>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                    <Typography variant="h4">Wydawcy</Typography>
                </Grid>
                <Grid item>
                    <Link to="add">
                        <Button variant="contained">Dodaj wydawcę</Button>
                    </Link>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AdminPublishers;