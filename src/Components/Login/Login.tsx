import './Login.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';


function App() {
  return (
    <div className="Login-box">
      <Paper elevation={3} className="Paper-box">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <span className="Paper-title"> Create Session </span>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField id="outlined-basic" label="Display Name" variant="outlined" />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Button variant="contained" color="primary">
                Create
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </div >
  );
}

export default App;
