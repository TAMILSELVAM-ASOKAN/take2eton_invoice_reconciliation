import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Alert,
  Fade,
  Tooltip,
  Avatar,
  ThemeProvider,
  createTheme,
  styled,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
  Divider,
  Collapse
} from '@mui/material';
import {
  CloudUpload,
  Search,
  FilterList,
  CheckCircle,
  Cancel,
  Description,
  ExpandMore,
  CalendarToday,
  LocationOn,
  Receipt,
  Business
} from '@mui/icons-material';
import domo from "ryuu.js";

const theme = createTheme({
  palette: {
    primary: {
      main: '#994b97'
    },
    secondary: {
      main: '#7a3d79'
    },
    background: {
      default: '#f6f8fb',
      paper: '#ffffff'
    },
    text: {
      primary: '#2c2c2c',
      secondary: '#666666'
    }
  },
  typography: {
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      fontSize: '1.5rem'
    },
    h5: {
      fontSize: '1.25rem'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem'
    },
    body1: {
      fontSize: '0.875rem'
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#994b97'
            }
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          fontSize: '0.875rem',
          padding: '6px 16px'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    }
  }
});

const FilterCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #994b97 0%, #7a3d79 100%)',
  color: 'white',
  '& .MuiCardContent-root': {
    padding: theme.spacing(2)
  }
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    borderRadius: 8,
    '& fieldset': {
      borderColor: 'rgba(44,44,44,0.06)'
    },
    '&:hover fieldset': {
      borderColor: 'rgba(153,75,151,0.18)'
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main
    }
  }
}));

const FileSelect = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8
  }
}));

const InvoiceCard = ({ invoice }) => {
  const [expanded, setExpanded] = useState(false);
  const isMatched = invoice?.flag === "True";

  const InfoItem = ({ icon: Icon, label, value, color = 'text.secondary' }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Icon sx={{ fontSize: 16, color: color, opacity: 0.7 }} />
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem', lineHeight: 1.2 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.3 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        width: '100%',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid',
        borderColor: isMatched ? alpha('#4caf50', 0.15) : alpha('#f44336', 0.15),
        bgcolor: 'background.paper',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${isMatched ? alpha('#4caf50', 0.15) : alpha('#f44336', 0.15)}`,
          borderColor: isMatched ? alpha('#4caf50', 0.3) : alpha('#f44336', 0.3)
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: isMatched
            ? 'linear-gradient(90deg, #4caf50 0%, #81c784 100%)'
            : 'linear-gradient(90deg, #f44336 0%, #ff8a80 100%)'
        }
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          background: isMatched
            ? `linear-gradient(135deg, ${alpha('#4caf50', 0.08)} 0%, ${alpha('#81c784', 0.05)} 100%)`
            : `linear-gradient(135deg, ${alpha('#f44336', 0.08)} 0%, ${alpha('#ff8a80', 0.05)} 100%)`,
          p: 2,
          pb: 1.5
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Receipt sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 800, color: 'primary.main' }}>
                {invoice.invoice_id}
              </Typography>
            </Box>
            <Chip
              icon={isMatched ? <CheckCircle sx={{ fontSize: 16 }} /> : <Cancel sx={{ fontSize: 16 }} />}
              label={isMatched ? 'Matched' : 'Unmatched'}
              size="small"
              variant=''
              sx={{
                fontWeight: 700,
                borderRadius: 0,
                fontSize: '0.7rem',
                height: 24,
                bgcolor: isMatched ? alpha('#4caf50', 0.15) : alpha('#f44336', 0.15),
                color: isMatched ? '#2e7d32' : '#c62828',
                border: '2px solid',
                borderColor: isMatched ? alpha('#4caf50', 0.3) : alpha('#f44336', 0.3)
              }}
            />
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', display: 'block' }}>
              Total Amount
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                fontSize: '1.4rem',
                background: 'linear-gradient(135deg, #994b97 0%, #7a3d79 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2
              }}
            >
              {invoice.currency_code} {invoice.fare.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Box>

        {/* Guest & Hotel Info */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 44,
              height: 44,
              fontSize: '1rem',
              fontWeight: 700,
              boxShadow: `0 4px 12px ${alpha('#994b97', 0.25)}`
            }}
          >
            {invoice.passenger_name.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'text.primary' }}>
              {invoice.passenger_name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {invoice.hotel_name}
            </Typography>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ p: 2, pb: '12px !important' }}>
        {/* Key Details Grid */}
        <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
          <Grid item size={{ xs: 6 }}>
            <InfoItem icon={Business} label="Chain" value={invoice.chain_name} />
          </Grid>
          <Grid item size={{ xs: 6 }}>
            <InfoItem icon={LocationOn} label="City" value={invoice.arrival_city_name} color="primary.main" />
          </Grid>
          <Grid item size={{ xs: 6 }}>
            <InfoItem icon={CalendarToday} label="Check-in" value={invoice.departure_or_checkin_date} />
          </Grid>
          <Grid item size={{ xs: 6 }}>
            <InfoItem icon={CalendarToday} label="Invoice Date" value={invoice.invoice_date} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 1.5 }} />

        {/* Footer Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            <Chip
              label={invoice.arrival_country}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.65rem',
                bgcolor: alpha('#994b97', 0.08),
                color: 'primary.dark',
                fontWeight: 600
              }}
            />
            <Chip
              label={invoice.file_name}
              icon={<Description sx={{ fontSize: 12 }} />}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.65rem',
                bgcolor: alpha('#666', 0.06),
                fontWeight: 600
              }}
            />
          </Box>

          <Tooltip title={expanded ? "Show less" : "Show more"}>
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
                bgcolor: alpha('#994b97', 0.08),
                '&:hover': { bgcolor: alpha('#994b97', 0.15) }
              }}
            >
              <ExpandMore sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Expandable Section */}
        <Collapse in={expanded} timeout="auto">
          <Box
            sx={{
              mt: 1.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha('#994b97', 0.04),
              border: '1px solid',
              borderColor: alpha('#994b97', 0.1)
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
              Notes & Details
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8rem', mb: 1, lineHeight: 1.5 }}>
              {invoice.reason || 'No additional notes available'}
            </Typography>

            <Grid container spacing={1}>
              <Grid item size={{ xs: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                  Booking Date
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  {invoice.booking_date}
                </Typography>
              </Grid>
              <Grid item size={{ xs: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                  Processed
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  {invoice.currentTimestamp.split(' ')[0]}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

const InvoiceReconciliation = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [filterFileName, setFilterFileName] = useState('all');
  const [filterFlag, setFilterFlag] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [fileDetails, setFileDetails] = useState(null);
  const filesetId = "a5b14408-60a2-426c-97f2-fd9e2d305976"

  const [dataset, setDataset] = useState([]);

  const uniqueFileNames = ['all', ...new Set(dataset.map(item => item.file_name))];

  const filteredData = dataset.filter(item => {
    const matchesFile = filterFileName === 'all' || item.file_name === filterFileName;
    const matchesFlag = filterFlag === 'all' ||
      (filterFlag === 'matched' && item.flag === "True") ||
      (filterFlag === 'unmatched' && item.flag === "False");
    const matchesSearch = searchTerm === '' ||
      item.invoice_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.passenger_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hotel_name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFile && matchesFlag && matchesSearch;
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadSuccess(false);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    uploadFileToDomo(selectedFile)
  };

  const uploadFileToDomo = async (file) => {
    try {
      setUploading(true);

      const formdata = new FormData();
      formdata.append(
        'file',
        new File([file], file.name, { type: file.type }),
        file.name
      );
      formdata.append('createFileRequest', JSON.stringify({
        directoryPath: ''
      }));

      console.log('Uploading file to Domo:', file.name);

      const result = await domo.post(
        `/domo/files/v1/filesets/${filesetId}/files`,
        formdata,
        { contentType: "multipart" }
      );

      console.log('File upload response:', result);

      const uploadedFileDetails = {
        type: "FILE",
        id: result.id || result.fileId || "",
        path: result.path || result.filePath || "",
        name: result.name || result.fileName || file.name
      };

      setFileDetails(uploadedFileDetails);

      return uploadedFileDetails;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };
  const fetchInvoiceData = async () => {
    try {
      const response = await domo.get("/data/v1/Invoice_Reconcilation");
      if (Array.isArray(response)) {
        setDataset(response);
      } else {
        console.error("Unexpected response format", response);
        setDataset([]);
      }
    }
    catch (error) {
      console.error("Error While Fetching Invoice Data", error)
    }
  }

  useEffect(() => {
    fetchInvoiceData()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ color: '#2b3553', mb: 0.5 }}>Take2Eton</Typography>
          <Typography variant="body2" color="text.secondary">Invoice reconciliation dashboard</Typography>
        </Box>

        {/* Upload Card */}
        <Card elevation={2} sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: 'background.paper',
          width: '100%'
        }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            <CloudUpload />
          </Avatar>

          <Box flex="1" sx={{ width: '100%' }}>
            <Grid container spacing={1} alignItems="center">
              <Grid item size={{ xs: 12, md: 5 }}>
                <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>Upload Invoice PDF</Typography>
                <Typography variant="caption" color="text.secondary">Only PDF files. Quick processing.</Typography>
              </Grid>

              <Grid item size={{ xs: 12, md: 7 }}>
                <Box display="flex" gap={1} alignItems="center" flexWrap="wrap" sx={{ width: '100%' }}>
                  <input
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outlined" component="span" size="small" startIcon={<Description />} sx={{ borderColor: 'primary.main', color: 'primary.main' }}>
                      Choose
                    </Button>
                  </label>

                  {selectedFile && (
                    <Chip label={selectedFile.name} onDelete={() => setSelectedFile(null)} size="small" icon={<Description />} sx={{ borderColor: 'primary.main' }} />
                  )}

                  <Box sx={{ flex: 1 }} />

                  <Button
                    variant="contained"
                    size="small"
                    disabled={!selectedFile || uploading}
                    onClick={handleUpload}
                    startIcon={<CloudUpload />}
                    sx={{ bgcolor: 'primary.main' }}
                  >
                    {uploading ? 'Processing...' : 'Upload'}
                  </Button>
                </Box>

                {uploading && <Box mt={1} sx={{ width: '100%' }}><LinearProgress sx={{ '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }} /></Box>}
                {uploadSuccess && <Fade in={uploadSuccess}><Alert severity="success" sx={{ mt: 1 }}>Invoice uploaded and processed.</Alert></Fade>}
              </Grid>
            </Grid>
          </Box>
        </Card>

        {/* Filter Card */}
        <FilterCard sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item size={{ xs: 12, md: 4, sm: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterList sx={{ color: 'white' }} />
                <Typography variant="h6" sx={{ color: 'white' }}>Invoice Records</Typography>
                <Chip label={`${filteredData.length} Records`} sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 700, ml: 1 }} />
              </Grid>

              <Grid item size={{ xs: 12, md: 8 }}>
                <Grid container spacing={1}>
                  <Grid item size={{ xs: 12, md: 4, sm: 6 }}>
                    <SearchField
                      fullWidth
                      size="small"
                      placeholder="Search by invoice, passenger or hotel..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Search color="disabled" /></InputAdornment>
                      }}
                    />
                  </Grid>

                  <Grid item size={{ xs: 6, md: 3 }}>
                    <FileSelect select fullWidth value={filterFileName} onChange={(e) => setFilterFileName(e.target.value)} size="small">
                      <MenuItem value="all">All Files</MenuItem>
                      {uniqueFileNames.filter(f => f !== 'all').map((fileName) => (
                        <MenuItem key={fileName} value={fileName}>📄 {fileName}</MenuItem>
                      ))}
                    </FileSelect>
                  </Grid>

                  <Grid item size={{ xs: 6, md: 3 }}>
                    <ToggleButtonGroup
                      value={filterFlag}
                      exclusive
                      color={theme.palette.primary.main}
                      onChange={(e, val) => { if (val !== null) setFilterFlag(val); }}
                      size="small"
                      sx={{borderRadius: 1, backgroundColor: "white"}}
                    >
                      <ToggleButton value="all">All</ToggleButton>
                      <ToggleButton value="matched">Matched</ToggleButton>
                      <ToggleButton value="unmatched">Unmatched</ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </FilterCard>


        <Grid container spacing={2} alignItems="stretch">
          {filteredData.length > 0 ? (
            filteredData.map((inv) => (
              <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={inv.invoice_id} sx={{ display: 'flex' }}>
                <InvoiceCard invoice={inv} />
              </Grid>
            ))
          ) : (
            <Grid item size={{ xs: 12 }}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography>No records found</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

      </Container>
    </ThemeProvider>
  );
};

export default InvoiceReconciliation;