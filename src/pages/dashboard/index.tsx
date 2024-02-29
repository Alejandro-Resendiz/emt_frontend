import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Grid from "@mui/system/Unstable_Grid";

import { useCallback, useState } from "react";

const API_URL = "https://rtrouptlxh.execute-api.us-east-2.amazonaws.com/v1";

const getKpis = async () => {
  const response = await fetch(`${API_URL}/email`, {
    method: "GET",
  });

  return await response.json();
};

export const EmtDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clickedCount, setClickedCount] = useState(0);
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [openedCount, setOpenedCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [spamCount, setSpamCount] = useState(0);

  const onGetKpis = useCallback(async () => {
    setIsLoading(true);

    const { data } = await getKpis();
    setClickedCount(Number(data["clicked"]["Rows"][0]["Values"][0]["Value"]));
    setDeliveredCount(
      Number(data["delivered"]["Rows"][0]["Values"][0]["Value"])
    );
    setOpenedCount(Number(data["opened"]["Rows"][0]["Values"][0]["Value"]));
    setSentCount(Number(data["sent"]["Rows"][0]["Values"][0]["Value"]));
    setSpamCount(Number(data["spam"]["Rows"][0]["Values"][0]["Value"]));

    console.log(data);
    setIsLoading(false);
  }, [isLoading]);

  return (
    <>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid xs={12}>
            <Box sx={{ display: "flex", flexDirection: "column", pl: 2 }}>
              <Typography variant="h4" gutterBottom>
                Email Tracker
              </Typography>
              <Typography variant="h6" gutterBottom>
                Dashboard
              </Typography>
              <Typography variant="body1" gutterBottom>
                Here you can find the KPIs regarding transactional emails sent
                through this channel for the last 90 days. Please hit the button
                to retrieve KPIs.
              </Typography>
            </Box>
            <Divider />
          </Grid>

          <Grid
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 auto",
            }}
          >
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>KPI</TableCell>
                    <TableCell align="right">Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    key="clicked"
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Clicked Link
                    </TableCell>
                    <TableCell align="right">{clickedCount}</TableCell>
                  </TableRow>
                  <TableRow
                    key="delivered"
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Delivered
                    </TableCell>
                    <TableCell align="right">{deliveredCount}</TableCell>
                  </TableRow>
                  <TableRow
                    key="opened"
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Opened
                    </TableCell>
                    <TableCell align="right">{openedCount}</TableCell>
                  </TableRow>
                  <TableRow
                    key="sent"
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Sent
                    </TableCell>
                    <TableCell align="right">{sentCount}</TableCell>
                  </TableRow>
                  <TableRow
                    key="spam"
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Marked as Spam
                    </TableCell>
                    <TableCell align="right">{spamCount}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid
            container
            xs={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: 2,
            }}
          >
            <Button
              disabled={isLoading}
              variant="contained"
              onClick={onGetKpis}
            >
              Get KPIs
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
