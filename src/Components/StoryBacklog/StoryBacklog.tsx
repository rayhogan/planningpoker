import './StoryBacklog.css';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';


class StoryBacklog extends React.Component {

   createData(name:string, score:number) {
    return { name, score };
  }
  
   rows = [
    this.createData('As a User, I want X, so that Y', 0),
    this.createData('As a User, I want X, so that Y', 0),
    this.createData('As a User, I want X, so that Y', 0),
    this.createData('As a User, I want X, so that Y', 0),
    this.createData('As a User, I want X, so that Y', 0),
  ];

  render() {
    return (
      <div >
        <Paper>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Story</TableCell>
                  <TableCell align="right">Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.rows.map((row) => (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div >
    );
  }
}

export default StoryBacklog;
