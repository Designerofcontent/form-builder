import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { 
  LineChart,
  BarChart,
} from '@mui/x-charts';
import { format, subDays, startOfDay } from 'date-fns';

const timeRanges = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

const PaymentAnalytics = ({ formId }) => {
  const [timeRange, setTimeRange] = useState(7);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const endDate = startOfDay(new Date());
      const startDate = subDays(endDate, timeRange);

      try {
        const response = await fetch(`/api/analytics/${formId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          }),
        });

        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, [formId, timeRange]);

  if (!analytics) {
    return <Typography>Loading analytics...</Typography>;
  }

  const { summary, dailyData } = analytics;

  const chartData = dailyData.map(item => ({
    date: format(new Date(item._id), 'MMM d'),
    amount: item.totalAmount / 100,
    count: item.count,
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Payment Analytics</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Time Range"
          >
            {timeRanges.map(range => (
              <MenuItem key={range.days} value={range.days}>
                {range.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(summary.totalRevenue / 100)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Transactions
              </Typography>
              <Typography variant="h4">
                {summary.totalTransactions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Transaction
              </Typography>
              <Typography variant="h4">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(summary.avgTransactionValue / 100)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Over Time
              </Typography>
              <Box sx={{ height: 300 }}>
                <LineChart
                  series={[
                    {
                      data: chartData.map(d => d.amount),
                      label: 'Revenue',
                    },
                  ]}
                  xAxis={[{
                    scaleType: 'point',
                    data: chartData.map(d => d.date),
                  }]}
                  height={300}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transactions Over Time
              </Typography>
              <Box sx={{ height: 300 }}>
                <BarChart
                  series={[
                    {
                      data: chartData.map(d => d.count),
                      label: 'Transactions',
                    },
                  ]}
                  xAxis={[{
                    scaleType: 'point',
                    data: chartData.map(d => d.date),
                  }]}
                  height={300}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentAnalytics;
