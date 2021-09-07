import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import './AdminControls.css';

class AdminControls extends React.Component {

  submitScore(e: any) {
    console.log(e);
  }

  render() {
    return (
      <div className="Admin-controls">
        <fieldset>
          <legend>Admin Controls</legend>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item>
              <Button variant="contained" color="primary">
                Start Vote
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary">
                Finish Vote
              </Button>
            </Grid>
          </Grid>
        </fieldset>

      </div>
    );
  }
}

export default AdminControls;
