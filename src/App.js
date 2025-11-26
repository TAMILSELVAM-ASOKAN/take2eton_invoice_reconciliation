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
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Alert,
  Tooltip,
  Avatar,
  ThemeProvider,
  createTheme,
  styled,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Skeleton,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  CloudUpload,
  Search,
  FilterList,
  CheckCircle,
  Cancel,
  Description,
  Receipt,
  MoreHoriz,
  Close,
  Error as ErrorIcon,
  CheckCircleOutline
} from '@mui/icons-material';
import domo from "ryuu.js";
import logo from './assets/logo/Take2Eton_Group_with_strapline.png'

const theme = createTheme({
  palette: {
    primary: {
      main: '#994b97'
    },
    secondary: {
      main: '#7a3d79'
    },
    success: {
      main: '#10b981'
    },
    error: {
      main: '#ef4444'
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

const StyledTableRow = styled(TableRow)(({ theme, isMatched }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: isMatched ? alpha('#10b981', 0.08) : alpha('#ef4444', 0.08),
    transform: 'translateX(4px)',
    boxShadow: `0 2px 8px ${isMatched ? alpha('#10b981', 0.2) : alpha('#ef4444', 0.2)}`
  }
}));

const DetailGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  '& .detail-item': {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    '& .detail-label': {
      fontSize: '0.75rem',
      fontWeight: 700,
      color: '#994b97',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    '& .detail-value': {
      fontSize: '0.95rem',
      color: '#2c2c2c',
      fontWeight: 500
    }
  }
}));

const InvoiceReconciliation = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [filterFileName, setFilterFileName] = useState('all');
  const [filterFlag, setFilterFlag] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [fileDetails, setFileDetails] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success', 'error', 'warning', 'info'
    duration: 4000
  });
  const filesetId = "a5b14408-60a2-426c-97f2-fd9e2d305976";

  const [dataset, setDataset] = useState([]);

  const essentialColumns = [
    { id: 'invoice_number', label: 'Invoice ID', width: '12%' },
    { id: 'passenger_name', label: 'Passenger', width: '15%' },
    { id: 'hotel_name', label: 'Hotel', width: '20%' },
    { id: 'invoice_date', label: 'Invoice Date', width: '12%' },
    { id: 'fare', label: 'Amount', width: '12%' },
    { id: 'flag', label: 'Status', width: '10%' },
    { id: 'action', label: '', width: '10%' }
  ];

  const allColumns = [
    { id: 'invoice_number', label: 'Invoice ID' },
    { id: 'passenger_name', label: 'Passenger Name' },
    { id: 'hotel_name', label: 'Hotel Name' },
    { id: 'chain_name', label: 'Hotel Chain' },
    { id: 'invoice_date', label: 'Invoice Date' },
    { id: 'departure_or_checkin_date', label: 'Check-in Date' },
    { id: 'booking_date', label: 'Booking Date' },
    { id: 'arrival_city_name', label: 'City' },
    { id: 'arrival_country', label: 'Country' },
    { id: 'currency_code', label: 'Currency' },
    { id: 'fare', label: 'Amount' },
    { id: 'currentTimestamp', label: 'Processed Date' },
    { id: 'file_name', label: 'File Name' }
  ];

  const showNotification = (message, severity = 'success', duration = 4000) => {
    setNotification({
      open: true,
      message,
      severity,
      duration
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };

  const formatedDate = (date) => {
    try {
      const dateObject = new Date(date);

      if (isNaN(dateObject.getTime())) {
        return 'Invalid Date';
      }

      const dateOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      };

      const timeOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };

      const formattedDate = dateObject.toLocaleDateString('en-GB', dateOptions).toUpperCase();
      const formattedTime = dateObject.toLocaleTimeString('en-US', timeOptions);

      return `${formattedDate} ${formattedTime}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const renderStatus = (flag) => {
    const isMatched = flag === "True" || flag === true;
    return (
      <Chip
        label={isMatched ? 'Matched' : 'Unmatched'}
        size="small"
        icon={isMatched ? <CheckCircle /> : <Cancel />}
        sx={{
          bgcolor: isMatched ? alpha('#10b981', 0.15) : alpha('#ef4444', 0.15),
          color: isMatched ? '#10b981' : '#ef4444',
          borderRadius: 1,
          padding: 0.5,
          fontWeight: 700,
          fontSize: '0.75rem',
          '& .MuiChip-icon': {
            fontSize: '0.9rem',
            color: isMatched ? 'green' : 'red',
          }
        }}
      />
    );
  };

  const uniqueFileNames = ['all', ...new Set(dataset.map(item => item.file_name).filter(Boolean))];

  const filteredData = dataset.filter(item => {
    // File name filter
    if (filterFileName !== 'all' && item.file_name !== filterFileName) {
      return false;
    }
    // Flag filter
    if (filterFlag === 'matched' && item.flag !== "True" && item.flag !== true) {
      return false;
    }
    if (filterFlag === 'unmatched' && (item.flag === "True" || item.flag === true)) {
      return false;
    }
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (item.hotel_name?.toLowerCase().includes(searchLower)) ||
        (item.passenger_name?.toLowerCase().includes(searchLower)) ||
        (item.invoice_number?.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      showNotification('Please select a valid PDF file', 'error');
      event.target.value = '';
    }
  };

  const uploadFileToDomo = async (file) => {
    try {
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
      throw new Error('Failed to upload file to Domo');
    }
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        showNotification('Please select a file first', 'warning');
        return;
      }

      setUploading(true);

      const uploadedFileDetails = await uploadFileToDomo(selectedFile);

      if (!uploadedFileDetails || !uploadedFileDetails.path) {
        showNotification('File upload failed. Path not received.', 'error');
        setUploading(false);
        return;
      }

      // Trigger workflow
      const workflowData = { "Invoice_Path": uploadedFileDetails.path };
      const workflowResponse = await domo.post(
        `/domo/workflow/v1/models/Invoice Reconciliation/start`,
        workflowData
      );

      // Show processing message with loader
      showNotification('Invoice uploaded successfully!', 'success');
      setGlobalLoading(true);
      setUploading(false);
      setSelectedFile(null);

    } catch (error) {
      console.error('Upload error:', error);
      setGlobalLoading(false);
      setUploading(false);
      showNotification(
        error.message || 'Error uploading file. Please try again.',
        'error'
      );
    }
  };

  const fetchInvoiceData = async () => {
    try {
      setLoadingData(true);

      let query = {};

      const conditions = [];

      if (filterFlag === 'matched') {
        conditions.push({ 'content.flag': { $eq: "True" } });
      } else if (filterFlag === 'unmatched') {
        conditions.push({ 'content.flag': { $eq: "False" } });
      }

      if (filterFileName !== 'all') {
        conditions.push({ 'content.file_name': { $eq: filterFileName } });
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        conditions.push({
          $or: [
            { 'content.hotel_name': { $regex: searchTerm, $options: 'i' } },
            { 'content.passenger_name': { $regex: searchTerm, $options: 'i' } },
            { 'content.invoice_number': { $regex: searchTerm, $options: 'i' } }
          ]
        });
      }

      if (conditions.length > 0) {
        if (conditions.length === 1) {
          query = conditions[0];
        } else {
          query = { $and: conditions };
        }
      }

      console.log('Query:', JSON.stringify(query));

      const response = await domo.post(
        `/domo/datastores/v1/collections/Invoice_Reconciliation_Output/documents/query`,
        query
      );

      const contentValues = Array.isArray(response)
        ? response.map(item => item.content)
        : [];

      if (Array.isArray(contentValues) && contentValues.length > 0) {
        setDataset(contentValues);
      } else if (contentValues.length === 0) {
        showNotification('No records found', 'info');
        setDataset([]);
      } else {
        console.error("Unexpected response format", response);
        setDataset([]);
        showNotification('Error loading data', 'error');
      }
    } catch (error) {
      console.error("Error while fetching invoice data:", error);
      showNotification(
        'Failed to load invoice data. Please try again.',
        'error'
      );
      setDataset([]);
    } finally {
      setLoadingData(false);
    }
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    document.querySelector('[role="table"]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchInvoiceData();
  }, [searchTerm, filterFileName, filterFlag]);

  // Skeleton loader component
  const TableSkeleton = () => (
    <TableBody>
      {[...Array(5)].map((_, idx) => (
        <TableRow key={idx}>
          {essentialColumns.map((col) => (
            <TableCell key={col.id} sx={{ padding: '12px 8px' }}>
              <Skeleton variant="text" width="80%" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 2 }}>

        {globalLoading && (
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: 1400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.45)',
            }}
          >
            <Paper
              elevation={24}
              sx={{
                p: 3,
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                borderRadius: 2,
                bgcolor: 'transparent',
                color: 'common.white',
              }}
            >
              <CircularProgress color="inherit" />
              <Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  Workflow processing...
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                  This may take a few moments — results will appear in Processing Results.
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Header */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* <Typography variant="h4" sx={{ color: '#2b3553', mb: 0.5 }}>Take2Eton</Typography> */}
          <img src={logo} style={{ height: '40px', width: 'auto', objectFit: 'contain' }} alt='Logo' />
          {/* <Typography variant="body2" color="text.secondary">Invoice reconciliation dashboard</Typography> */}
        </Box>

        {/* Upload Card */}
        <Card
          elevation={0}
          sx={{
            p: 1,
            mb: 3,
            borderRadius: 3, // larger rounded corners like the image
            textAlign: "center",
            background: "#faf6fb", // subtle background similar to the image
            border: "2px dashed",
            borderColor: theme.palette.primary.main,
            cursor: "pointer",
            transition: "all 0.18s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 120,
            "&:hover": {
              borderColor: alpha(theme.palette.primary.main, 0.9),
              backgroundColor: alpha(theme.palette.primary.main, 0.03),
            },
          }}
          component="label"
          htmlFor="file-upload"
        >
          {/* Hidden input (clicking the card opens file dialog) */}
          <input
            accept="application/pdf, .pdf"
            style={{ display: "none" }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
          />

          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 44,
              height: 44,
              mb: 1.5,
            }}
          >
            <CloudUpload />
          </Avatar>

          <Typography
            sx={{ fontWeight: 700, color: theme.palette.primary.main }}
            variant="subtitle1"
          >
            Click to upload
          </Typography>

          {/* Subtext */}
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 0.5 }}
          >
            Accepted formats: PDF only
          </Typography>

          {selectedFile && (
            <Box
              mt={2}
              width="100%"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Chip
                label={selectedFile.name}
                onDelete={() => setSelectedFile(null)}
                size="small"
                icon={<Description />}
                disabled={uploading}
                sx={{ borderColor: theme.palette.primary.main }}
              />

              <Button
                variant="contained"
                size="small"
                disabled={!selectedFile || uploading}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // prevent label click
                  handleUpload();
                }}
                startIcon={!uploading && <CloudUpload />}
                sx={{ bgcolor: theme.palette.primary.main, minWidth: 120 }}
              >
                {uploading ? "Processing..." : "Upload"}
              </Button>
            </Box>
          )}

          {/* Linear progress when uploading */}
          {uploading && (
            <Box mt={2} sx={{ width: "100%" }} onClick={(e) => e.stopPropagation()}>
              <LinearProgress
                sx={{ "& .MuiLinearProgress-bar": { bgcolor: theme.palette.primary.main } }}
              />
            </Box>
          )}
        </Card>

        {/* Filter Card */}
        <FilterCard sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item size={{ xs: 12, md: 3, sm: 6 }} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <FilterList sx={{ color: 'white' }} />
                <Typography variant="h6" sx={{ color: 'white' }}>Invoice Records</Typography>
                <Chip label={`${filteredData.length} Records`} sx={{ bgcolor: 'white', borderRadius: 1, color: 'primary.main', fontWeight: 700, ml: 1 }} />
              </Grid>

              <Grid item size={{ xs: 12, md: 9 }}>
                <Grid container spacing={1}>
                  <Grid item size={{ xs: 12, md: 6, sm: 6 }}>
                    <FileSelect
                      select
                      fullWidth
                      value={filterFileName}
                      onChange={(e) => setFilterFileName(e.target.value)}
                      size="small"
                      disabled={loadingData}
                    >
                      <MenuItem value="all">All Files</MenuItem>
                      {uniqueFileNames.filter(f => f !== 'all').map((fileName) => (
                        <MenuItem key={fileName} value={fileName}>📄 {fileName}</MenuItem>
                      ))}
                    </FileSelect>
                  </Grid>

                  <Grid item size={{ xs: 12, md: 6, sm: 6 }}>
                    <ToggleButtonGroup
                      value={filterFlag}
                      fullWidth
                      exclusive
                      onChange={(e, val) => { if (val !== null) setFilterFlag(val); }}
                      size="small"
                      disabled={loadingData}
                      sx={{ borderRadius: 1, backgroundColor: "white" }}
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

        {/* Professional Table */}
        <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2, overflow: 'auto', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)' }}>
          <Table size="small" role="table">
            <TableHead>
              <TableRow>
                {essentialColumns.map((col) => (
                  <TableCell
                    key={col.id}
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      width: col.width,
                      padding: '12px 8px',
                      background: 'linear-gradient(135deg, #994b97 0%, #7a3d79 100%)'
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {loadingData ? (
              <TableSkeleton />
            ) : (
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={essentialColumns.length} align="center" sx={{ py: 6 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Receipt sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                        <Typography color="text.secondary">No records found</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((inv) => (
                    <StyledTableRow
                      key={inv.invoice_number}
                      isMatched={inv.flag === "True" || inv.flag === true}
                      onClick={() => handleRowClick(inv)}
                    >
                      <TableCell sx={{ fontWeight: 600, color: '#2c2c2c', padding: '12px 8px' }}>
                        {inv.invoice_number}
                      </TableCell>
                      <TableCell sx={{ padding: '12px 8px', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Tooltip title={inv.passenger_name}>
                          <span>{inv.passenger_name}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 8px', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Tooltip title={inv.hotel_name}>
                          <span>{inv.hotel_name}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 8px' }}>{inv.invoice_date}</TableCell>
                      <TableCell sx={{ padding: '12px 8px', fontWeight: 600, color: '#994b97' }}>
                        {inv.currency_code} {Number(inv.fare).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell sx={{ padding: '12px 8px' }}>
                        {renderStatus(inv.flag)}
                      </TableCell>
                      <TableCell sx={{ padding: '12px 8px', textAlign: 'center' }}>
                        <IconButton size="small" sx={{ color: 'primary.main' }}>
                          <MoreHoriz fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            color="primary"
            size="medium"
            siblingCount={1}
            boundaryCount={1}
            disabled={loadingData}
            sx={{
              '& .MuiPaginationItem-root': {
                borderColor: 'primary.main',
                color: 'primary.main',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: alpha('#994b97', 0.08)
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#7a3d79'
                  }
                }
              }
            }}
          />
        </Box>

        {/* Detail Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <DialogTitle sx={{
            background: `linear-gradient(135deg, ${selectedRow?.flag === "True" || selectedRow?.flag === true ? '#10b981' : '#ef4444'} 0%, ${selectedRow?.flag === "True" || selectedRow?.flag === true ? '#059669' : '#dc2626'} 100%)`,
            color: 'white',
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {selectedRow?.flag === "True" || selectedRow?.flag === true ? <CheckCircle /> : <Cancel />}
              {selectedRow?.flag === "True" || selectedRow?.flag === true ? "Matched" : "UnMatched"}
            </Box>
            <IconButton
              onClick={handleCloseDialog}
              sx={{ color: '#ffffff', '&:hover': { bgcolor: alpha('#ffffff', 0.2) } }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            {selectedRow && (
              <DetailGrid container spacing={2}>
                {allColumns.map((col) => (
                  <Grid item size={{ xs: 12, sm: 6 }} key={col.id}>
                    <Box className="detail-item">
                      <Typography className="detail-label" sx={{ fontWeight: 700 }}>{col.label}</Typography>
                      <Typography className="detail-value">
                        {col.id === 'fare' ? (
                          `${selectedRow.currency_code} ${Number(selectedRow[col.id]).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        ) : col.id === 'currentTimestamp' ? (
                          formatedDate(selectedRow[col.id]) || 'N/A'
                        ) :
                          col.id === 'arrival_country' ? (selectedRow[col?.id]?.toUpperCase()) :
                            (
                              selectedRow[col.id] || 'N/A'
                            )}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
                {selectedRow.reason && (
                  <Grid item size={{ xs: 12 }}>
                    <Box className="detail-item">
                      <Typography className="detail-label" sx={{ fontWeight: 700 }}>Reason</Typography>
                      <Typography className="detail-value" sx={{ color: selectedRow.flag === "True" || selectedRow.flag === true ? '#10b981' : '#ef4444' }}>
                        {selectedRow.reason}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </DetailGrid>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2, borderTop: '1px solid #e5e7eb' }}>
            <Button onClick={handleCloseDialog} variant="contained" sx={{ bgcolor: 'primary.main' }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={notification.duration}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            variant="filled"
            icon={
              notification.severity === 'success' ? <CheckCircleOutline /> :
                notification.severity === 'error' ? <ErrorIcon /> :
                  undefined
            }
            sx={{
              width: '100%',
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default InvoiceReconciliation;