import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import './VotingControls.css';



class VotingControls extends React.Component {

  submitScore(e: any) {
    console.log(e);
  }

  render() {
    return (
      <div className="Voting-controls">
        <Grid container className="" spacing={2}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2}>
              {[1, 2, 3, 5, 8, 13, 21, 34].map((value) => (
                <Grid key={value} item>
                  <Paper className="Paper-card" onClick={this.submitScore} elevation={3}>
                    <div>{value}</div>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default VotingControls;
