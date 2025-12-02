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
  CircularProgress,
  Menu,
  ListItemIcon,
  ListItemText,
  MenuItem as MenuItemComponent
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
  CheckCircleOutline,
  Visibility,
  Edit,
  Link as LinkIcon
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
    width: "100%",
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
      fontWeight: 500,
      overflowWrap: 'break-word',
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
    severity: 'success',
    duration: 4000
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [showMatchesDialog, setShowMatchesDialog] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedMenuRowId, setSelectedMenuRowId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState(null);

  const filesetId = "a5b14408-60a2-426c-97f2-fd9e2d305976";
  const [dataset, setDataset] = useState([]);

  const [customFieldsConfig, setCustomFieldsConfig] = useState({});
  const [showCustomFieldDialog, setShowCustomFieldDialog] = useState(false);
  const [selectedCustomerForField, setSelectedCustomerForField] = useState('');
  const [selectedCustomField, setSelectedCustomField] = useState('');
  const [customColumnName, setCustomColumnName] = useState('');
  const [loadingCustomField, setLoadingCustomField] = useState(false);

  // Add this constant to define available customers
  const availableCustomers = ['all', ...new Set(dataset.map(item => item.Customer_Group_Code).filter(Boolean))];

  // Add this function to fetch custom field data
  const fetchCustomFieldData = async (invoiceIds, sqlColumn) => {
    try {
      setLoadingCustomField(true);

      const response = await domo.post('/sql/v1/Customer_Data',
        `SELECT "Invoice Number", "${sqlColumn}" FROM Customer_Data WHERE "Invoice Number" IN (${invoiceIds.map(id => `'${id}'`).join(',')})`,
        { contentType: 'text/plain' }
      );

      console.log('Custom field data response:', response);

      const customFieldMap = {};
      response.rows.forEach((row) => {
        customFieldMap[row[0]] = row[1]; // Map Invoice Number to Custom Field Value
      });

      return customFieldMap;
    } catch (error) {
      console.error('Error fetching custom field data:', error);
      showNotification('Failed to fetch custom field data. Check column name and try again.', 'error');
      return {};
    } finally {
      setLoadingCustomField(false);
    }
  };

  // Add this function to apply custom field to matched records
  const applyCustomFieldToMatched = async () => {
    try {
      if (!selectedCustomerForField || !customColumnName.trim()) {
        showNotification('Please select customer and enter column name', 'warning');
        return;
      }

      setLoadingCustomField(true);

      // Get all matched records for selected customer
      const matchedRecords = dataset.filter(item =>
        item.Customer_Group_Code === selectedCustomerForField &&
        (item.flag === "True" || item.flag === true)
      );

      if (matchedRecords.length === 0) {
        showNotification('No matched records found for selected customer', 'warning');
        setLoadingCustomField(false);
        return;
      }

      const invoiceNumbers = matchedRecords.map(r => r.invoice_number);

      // Fetch custom field data from SQL using the column name entered by user
      const customFieldData = await fetchCustomFieldData(invoiceNumbers, customColumnName.trim());

      if (Object.keys(customFieldData).length === 0) {
        showNotification('No data found for the specified column', 'warning');
        setLoadingCustomField(false);
        return;
      }

      // Update each matched record with custom field
      const updatePromises = matchedRecords.map(record => {
        const customValue = customFieldData[record.invoice_number];

        if (customValue !== undefined && customValue !== null) {
          const updateContent = {
            ...record,
            [customColumnName]: customValue,
            [`${customColumnName}_applied_date`]: new Date()
          };

          return domo.put(
            `/domo/datastores/v1/collections/Invoice_Reconciliation_Output/documents/${record.id}`,
            { content: updateContent }
          );
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);

      const appliedCount = Object.keys(customFieldData).length;
      showNotification(
        `Custom field "${customColumnName}" applied to ${appliedCount} records successfully!`,
        'success'
      );

      setShowCustomFieldDialog(false);
      setSelectedCustomerForField('');
      setCustomColumnName('');
      fetchInvoiceData();
    } catch (error) {
      console.error('Error applying custom field:', error);
      showNotification('Failed to apply custom field', 'error');
    } finally {
      setLoadingCustomField(false);
    }
  };

  const [filterCustomer, setFilterCustomer] = useState('all');

  const essentialColumns = [
    { id: 'invoice_number', label: 'Invoice ID', width: '12%' },
    // { id: 'passenger_name', label: 'Passenger', width: '15%' },
    { id: 'Customer_Group_Code', label: 'Customer Group', width: '15%' },
    { id: 'hotel_name', label: 'Hotel', width: '20%' },
    { id: 'invoice_date', label: 'Invoice Date', width: '12%' },
    { id: 'fare', label: 'Amount', width: '12%' },
    { id: 'flag', label: 'Status', width: '10%' },
    { id: 'action', label: '', width: '10%' }
  ];

  const allColumns = [
    { id: 'invoice_number', label: 'Invoice ID' },
    { id: 'Customer_Group_Code', label: 'Customer Group Code' },
    { id: 'passenger_name', label: 'Passenger Name' },
    { id: 'hotel_name', label: 'Hotel Name' },
    { id: 'hotel_address', label: 'Hotel Address' },
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

  const uniqueCustomerNames = ['all', ...new Set(dataset.map(item => item.Customer_Group_Code).filter(Boolean))];

  const filteredData = dataset.filter(item => {
    if (filterCustomer !== 'all' && item.Customer_Group_Code !== filterCustomer) {
      return false;
    }

    if (filterFileName !== 'all' && item.file_name !== filterFileName) {
      return false;
    }
    if (filterFlag === 'matched' && item.flag !== "True" && item.flag !== true) {
      return false;
    }
    if (filterFlag === 'unmatched' && (item.flag === "True" || item.flag === true)) {
      return false;
    }
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

      const workflowData = { "Invoice_Path": uploadedFileDetails.path };
      const workflowResponse = await domo.post(
        `/domo/workflow/v1/models/Invoice Reconciliation/start`,
        workflowData
      );

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

      if (filterCustomer !== 'all') {
        conditions.push({ 'content.Customer_Group_Code': { $eq: filterCustomer } });
      }

      if (filterFlag === 'matched') {
        conditions.push({ 'content.flag': { $eq: true } });
      } else if (filterFlag === 'unmatched') {
        conditions.push({ 'content.flag': { $eq: false } });
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
        ? response.map(item => ({
          ...item.content,
          id: item.id
        }))
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

  const fetchPotentialMatches = async (potentialIds) => {
    try {
      setLoadingMatches(true);

      const response = await domo.post('/sql/v1/Customer_Data',
        `SELECT "Customer Group Code","Product Type","Invoice Number","Passenger Name", "Hotel Name", "Hotel Address", "Chain Name", "Invoice Date", "Departure/ Checkin Date", "Booking Date", "Arrival City Name", "Arrival Country", "Fare", "Currency Code" FROM Customer_Data WHERE "Product Type"='HOTEL' AND "Invoice Number" IN (${potentialIds.map(id => `'${id}'`).join(',')})`,
        { contentType: 'text/plain' }
      );

      console.log('Potential matches response:', response);

      const formattedMatches = response.rows.map(row => {
        const matchObject = {};
        response.columns.forEach((column, index) => {
          matchObject[column] = row[index];
        });
        return matchObject;
      });

      console.log('Formatted matches:', formattedMatches);
      return formattedMatches || [];
    } catch (error) {
      console.error('Error fetching potential matches:', error);
      showNotification('Failed to fetch potential matches', 'error');
      return [];
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setMenuRow(null);
  };

  const handleViewDetails = () => {
    setSelectedRow(menuRow);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteTarget(menuRow);
    setShowDeleteConfirm(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    try {
      if (!deleteTarget || !deleteTarget.id) {
        showNotification('Cannot delete: Document ID not found', 'error');
        return;
      }

      await domo.delete(
        `/domo/datastores/v1/collections/Invoice_Reconciliation_Output/documents/${deleteTarget.id}`
      );

      showNotification('Record deleted successfully!', 'success');
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      fetchInvoiceData();
    } catch (error) {
      console.error('Error deleting record:', error);
      showNotification('Failed to delete record', 'error');
    }
  };

  const handleStatusClick = () => {
    setStatusUpdate({
      row: menuRow,
      currentFlag: menuRow.flag === "True" || menuRow.flag === true
    });
    setShowStatusDialog(true);
    handleMenuClose();
  };

  const handleConfirmStatusUpdate = async () => {
    try {
      if (!statusUpdate || !statusUpdate.row || !statusUpdate.row.id) {
        showNotification('Cannot update: Document ID not found', 'error');
        return;
      }

      const updateContent = {
        ...statusUpdate.row,
        flag: !statusUpdate.currentFlag,
        reason: statusUpdate.currentFlag ? 'Status changed to Unmatched' : 'Status changed to Matched'
      };

      await domo.put(
        `/domo/datastores/v1/collections/Invoice_Reconciliation_Output/documents/${statusUpdate.row.id}`,
        { content: updateContent }
      );

      showNotification(
        `Record marked as ${!statusUpdate.currentFlag ? 'Matched' : 'Unmatched'} successfully!`,
        'success'
      );
      setShowStatusDialog(false);
      setStatusUpdate(null);
      fetchInvoiceData();
    } catch (error) {
      console.error('Error updating status:', error);
      showNotification('Failed to update record status', 'error');
    }
  };

  const handleFindMatches = async () => {
    if (!menuRow || !menuRow.potential_invoice_ids) {
      showNotification('No potential matches available for this record', 'warning');
      handleMenuClose();
      return;
    }

    setSelectedMenuRowId(menuRow.id);

    let potentialIds = menuRow.potential_invoice_ids;
    if (typeof potentialIds === 'string') {
      potentialIds = potentialIds.split(',').map(id => id.trim());
    }

    if (potentialIds.length == 0) {
      showNotification('No potential matches available for this record', 'warning');
      handleMenuClose();
      return;
    }

    const matches = await fetchPotentialMatches(potentialIds);
    setPotentialMatches(matches);
    setShowMatchesDialog(true);
    handleMenuClose();
  };

  const handleSelectMatch = (match) => {
    setEditingMatch(match);
    setShowEditDialog(true);
  };

  const handleConfirmMatch = async () => {
    try {
      // if (!menuRow || !editingMatch) {
      //   showNotification('Missing required data', 'error');
      //   return;
      // }

      const updateContent = {
        // Changed fields from editingMatch
        Customer_Group_Code : editingMatch['Customer Group Code'],
        invoice_number: editingMatch['Invoice Number'],
        passenger_name: editingMatch['Passenger Name'],
        hotel_name: editingMatch['Hotel Name'],
        hotel_address: editingMatch['Hotel Address'],
        chain_name: editingMatch['Chain Name'],
        invoice_date: editingMatch['Invoice Date'],
        departure_or_checkin_date: editingMatch['Departure/Check-in Date'] || editingMatch['Departure/ Checkin Date'],
        booking_date: editingMatch['Booking Date'],
        arrival_city_name: editingMatch['Arrival City Name'],
        arrival_country: editingMatch['Arrival Country'],
        fare: editingMatch['Fare'],
        currency_code: editingMatch['Currency Code'],
        potential_invoice_ids: menuRow.potential_invoice_ids || '',
        file_name: menuRow.file_name || '',
        flag: true,
        reason: 'Manually matched',
        currentTimestamp: new Date()
      };

      const documentId = menuRow.id || selectedMenuRowId;

      if (!documentId) {
        showNotification('Cannot update: Document ID not found', 'error');
        return;
      }

      await domo.put(
        `/domo/datastores/v1/collections/Invoice_Reconciliation_Output/documents/${documentId}`,
        { content: updateContent }
      );

      showNotification('Record matched and updated successfully!', 'success');
      setShowEditDialog(false);
      setShowMatchesDialog(false);
      setMenuRow(null);
      setEditingMatch(null);
      fetchInvoiceData();

    } catch (error) {
      console.error('Error updating record:', error);
      showNotification('Failed to update record', 'error');
    }
  };

  // const handleRowClick = (row) => {
  //   setSelectedRow(row);
  //   setOpenDialog(true);
  // };

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
  }, [searchTerm, filterFileName, filterFlag, filterCustomer]);

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

        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <img src={logo} style={{ height: '40px', width: 'auto', objectFit: 'contain' }} alt='Logo' />
        </Box>

        <Card
          elevation={0}
          sx={{
            p: 1,
            mb: 3,
            borderRadius: 3,
            textAlign: "center",
            background: "#faf6fb",
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
                  e.stopPropagation();
                  handleUpload();
                }}
                startIcon={!uploading && <CloudUpload />}
                sx={{ bgcolor: theme.palette.primary.main, minWidth: 120 }}
              >
                {uploading ? "Processing..." : "Upload"}
              </Button>
            </Box>
          )}

          {uploading && (
            <Box mt={2} sx={{ width: "100%" }} onClick={(e) => e.stopPropagation()}>
              <LinearProgress
                sx={{ "& .MuiLinearProgress-bar": { bgcolor: theme.palette.primary.main } }}
              />
            </Box>
          )}
        </Card>

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
                  <Grid item size={{ xs: 12, md: 4, sm: 6 }}>
                    <FileSelect
                      select
                      fullWidth
                      value={filterCustomer}
                      onChange={(e) => setFilterCustomer(e.target.value)}
                      size="small"
                      disabled={loadingData}
                    >
                      <MenuItem value="all">All Customers</MenuItem>
                      {uniqueCustomerNames.filter(c => c !== 'all').map((customer) => (
                        <MenuItem key={customer} value={customer}>👤 {customer}</MenuItem>
                      ))}
                    </FileSelect>
                  </Grid>

                  <Grid item size={{ xs: 12, md: 4, sm: 6 }}>
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

                  <Grid item size={{ xs: 12, md: 4, sm: 6 }}>
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
                  <Grid item size={{ xs: 12, md: 12 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        fontWeight: 700,
                        '&:hover': {
                          bgcolor: alpha('#fffff', 0.9)
                        }
                      }}
                      onClick={() => setShowCustomFieldDialog(true)}
                    >
                      📋 Custom Fields
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </FilterCard>

        <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2, height: 400, overflow: 'auto', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)' }}>
          <Table size="small" role="table" stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
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
                      key={inv.id}
                      isMatched={inv.flag === "True" || inv.flag === true}
                    >
                      <TableCell sx={{ fontWeight: 600, color: '#2c2c2c', padding: '12px 8px' }}>
                        {inv.invoice_number}
                      </TableCell>
                      <TableCell sx={{ padding: '12px 8px', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Tooltip title={inv['Customer_Group_Code']}>
                          <span>{inv['Customer_Group_Code']}</span>
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
                      {/* <TableCell sx={{ padding: '12px 8px', textAlign: 'center' }}>
                        {(inv.flag === "False" || inv.flag === false) ? (
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, inv)}
                            sx={{ color: 'primary.main' }}
                          >
                            <MoreHoriz fontSize="small" />
                          </IconButton>
                        ) : (
                          <IconButton
                            size="small"
                            onClick={() => handleRowClick(inv)}
                            sx={{ color: 'primary.main' }}
                          >
                            <MoreHoriz fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell> */}
                      <TableCell sx={{ padding: '12px 8px', textAlign: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, inv)}
                          sx={{ color: 'primary.main' }}
                        >
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

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <MenuItemComponent onClick={handleViewDetails}>
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItemComponent>
          <MenuItemComponent
            onClick={handleFindMatches}
            disabled={loadingMatches}
          >
            <ListItemIcon>
              {loadingMatches ? (
                <CircularProgress size={20} />
              ) : (
                <LinkIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText>
              {loadingMatches ? 'Finding Matches...' : 'Find & Match'}
            </ListItemText>
          </MenuItemComponent>
          <MenuItemComponent onClick={handleStatusClick}>
            <ListItemIcon>
              {menuRow?.flag === "True" || menuRow?.flag === true ? <Cancel fontSize="small" /> : <CheckCircle fontSize="small" />}
            </ListItemIcon>
            <ListItemText>
              {menuRow?.flag === "True" || menuRow?.flag === true ? 'Mark as Unmatched' : 'Mark as Matched'}
            </ListItemText>
          </MenuItemComponent>
          <MenuItemComponent onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Cancel fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItemComponent>
        </Menu>

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

        {/* Potential Matches Dialog */}
        <Dialog
          open={showMatchesDialog}
          onClose={() => setShowMatchesDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #994b97 0%, #7a3d79 100%)',
            color: 'white',
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinkIcon />
              Potential Matches
            </Box>
            <IconButton
              onClick={() => setShowMatchesDialog(false)}
              sx={{ color: '#ffffff', '&:hover': { bgcolor: alpha('#ffffff', 0.2) } }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            {loadingMatches ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
                <CircularProgress size={40} />
              </Box>
            ) : potentialMatches.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Receipt sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                <Typography color="text.secondary">No potential matches found</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: alpha('#994b97', 0.1) }}>
                      <TableCell sx={{ fontWeight: 700, color: '#994b97' }}>Invoice Number</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#994b97' }}>Passenger</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#994b97' }}>Hotel</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#994b97' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {potentialMatches.map((match, idx) => (
                      <TableRow key={idx} hover sx={{ cursor: 'pointer' }}>
                        <TableCell>{match['Invoice Number']}</TableCell>
                        <TableCell>{match['Passenger Name']}</TableCell>
                        <TableCell>{match['Hotel Name']}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{ bgcolor: 'primary.main' }}
                            onClick={() => handleSelectMatch(match)}
                          >
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit/Confirm Match Dialog */}
        <Dialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
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
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle />
              Confirm Match
            </Box>
            <IconButton
              onClick={() => setShowEditDialog(false)}
              sx={{ color: '#ffffff', '&:hover': { bgcolor: alpha('#ffffff', 0.2) } }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            {editingMatch && (
              <DetailGrid container spacing={2}>
                <Grid item size={{ xs: 12 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#994b97', mb: 1 }}>
                    Selected Invoice Details:
                  </Typography>
                </Grid>
                {[
                  { label: 'Invoice Number', id: 'Invoice Number' },
                  { label: 'Customer Group', id: 'Customer Group Code' },
                  { label: 'Passenger Name', id: 'Passenger Name' },
                  { label: 'Hotel Name', id: 'Hotel Name' },
                  { label: 'Hotel Address', id: 'Hotel Address' },
                  { label: 'Chain Name', id: 'Chain Name' },
                  { label: 'Invoice Date', id: 'Invoice Date' },
                  { label: 'Check-in Date', id: 'Departure/Check-in Date' },
                  { label: 'Fare', id: 'Fare' },
                  { label: 'Currency', id: 'Currency Code' }
                ].map((col) => (
                  <Grid item size={{ xs: 12, sm: 6 }} key={col.id}>
                    <Box className="detail-item">
                      <Typography className="detail-label">{col.label}</Typography>
                      <Typography className="detail-value">
                        {editingMatch[col.id] || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </DetailGrid>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2, borderTop: '1px solid #e5e7eb' }}>
            <Button onClick={() => setShowEditDialog(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleConfirmMatch} variant="contained" sx={{ bgcolor: 'success.main' }}>
              Confirm Match
            </Button>
          </DialogActions>
        </Dialog>

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
                {/* Render fields in the order specified in allColumns */}
                {allColumns
                  .filter(column =>
                    selectedRow.hasOwnProperty(column.id) &&
                    !['reason', 'id', 'flag', 'potential_invoice_ids'].includes(column.id)
                  )
                  .map(column => {
                    const value = selectedRow[column.id];
                    return (
                      <Grid item size={{ xs: 12, sm: 6 }} key={column.id}>
                        <Box className="detail-item">
                          <Typography className="detail-label" sx={{ fontWeight: 700 }}>
                            {column.label.toUpperCase()}
                          </Typography>
                          <Typography className="detail-value">
                            {column.id === 'fare' ? (
                              `${selectedRow.currency_code} ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                            ) : column.id === 'currentTimestamp' ? (
                              formatedDate(value) || 'N/A'
                            ) : column.id === 'arrival_country' ? (
                              String(value).toUpperCase()
                            ) : value === null || value === undefined ? (
                              'N/A'
                            ) : (
                              String(value)
                            )}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}

                {/* Render remaining fields not in allColumns */}
                {Object.entries(selectedRow)
                  .filter(([key]) =>
                    !['reason', 'id', 'flag', 'potential_invoice_ids'].includes(key) &&
                    !allColumns.some(column => column.id === key)
                  )
                  .map(([key, value]) => (
                    <Grid item size={{ xs: 12, sm: 6 }} key={key}>
                      <Box className="detail-item">
                        <Typography className="detail-label" sx={{ fontWeight: 700 }}>
                          {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').toUpperCase()}
                        </Typography>
                        <Typography className="detail-value">
                          {key === 'fare' ? (
                            `${selectedRow.currency_code} ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                          ) : key === 'currentTimestamp' ? (
                            formatedDate(value) || 'N/A'
                          ) : key === 'arrival_country' ? (
                            String(value).toUpperCase()
                          ) : value === null || value === undefined ? (
                            'N/A'
                          ) : (
                            String(value)
                          )}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}

                {/* Render 'reason' separately as full width */}
                {selectedRow.reason && (
                  <Grid item xs={12}>
                    <Box className="detail-item">
                      <Typography className="detail-label" sx={{ fontWeight: 700 }}>
                        REASON
                      </Typography>
                      <Typography className="detail-value">
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

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ErrorIcon />
              Delete Record
            </Box>
            <IconButton
              onClick={() => setShowDeleteConfirm(false)}
              sx={{ color: '#ffffff', '&:hover': { bgcolor: alpha('#ffffff', 0.2) } }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to delete this record?
            </Typography>
            {deleteTarget && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <strong>Invoice:</strong> {deleteTarget.invoice_number} - {deleteTarget.hotel_name}
              </Alert>
            )}
            <Typography variant="body2" color="text.secondary">
              This action cannot be undone.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2, borderTop: '1px solid #e5e7eb' }}>
            <Button onClick={() => setShowDeleteConfirm(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} variant="contained" sx={{ bgcolor: 'error.main' }}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog
          open={showStatusDialog}
          onClose={() => setShowStatusDialog(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Edit />
              Update Status
            </Box>
            <IconButton
              onClick={() => setShowStatusDialog(false)}
              sx={{ color: '#ffffff', '&:hover': { bgcolor: alpha('#ffffff', 0.2) } }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to mark this record as{' '}
              <strong>{statusUpdate?.currentFlag ? 'Unmatched' : 'Matched'}</strong>?
            </Typography>
            {statusUpdate?.row && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>Invoice:</strong> {statusUpdate.row.invoice_number}
              </Alert>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2, borderTop: '1px solid #e5e7eb' }}>
            <Button onClick={() => setShowStatusDialog(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleConfirmStatusUpdate} variant="contained" sx={{ bgcolor: '#3b82f6' }}>
              Update Status
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={showCustomFieldDialog}
          onClose={() => setShowCustomFieldDialog(false)}
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
            background: 'linear-gradient(135deg, #994b97 0%, #7a3d79 100%)',
            color: 'white',
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Edit />
              Apply Custom Fields
            </Box>
            <IconButton
              onClick={() => {
                setShowCustomFieldDialog(false);
                setSelectedCustomerForField('');
                setCustomColumnName('');
              }}
              sx={{ color: '#ffffff', '&:hover': { bgcolor: alpha('#ffffff', 0.2) } }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Typography variant="body2" color="text.secondary">
                Select a customer and specify the column name to fetch and apply to all their matched records.
              </Typography>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#994b97', mb: 1 }}>
                  Step 1: Select Customer
                </Typography>
                <FileSelect
                  select
                  fullWidth
                  label="Select Customer"
                  value={selectedCustomerForField}
                  onChange={(e) => setSelectedCustomerForField(e.target.value)}
                  disabled={loadingCustomField}
                  size="small"
                >
                  <MenuItem value="">-- Choose Customer --</MenuItem>
                  {availableCustomers.filter(c => c !== 'all').map((customer) => (
                    <MenuItem key={customer} value={customer}>
                      👤 {customer}
                    </MenuItem>
                  ))}
                </FileSelect>
              </Box>

              {selectedCustomerForField && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#994b97', mb: 1 }}>
                    Step 2: Enter Column Name
                  </Typography>
                  <SearchField
                    fullWidth
                    label="Column Name (e.g., Ref, ProjectCode, CustomField)"
                    value={customColumnName}
                    onChange={(e) => setCustomColumnName(e.target.value)}
                    disabled={loadingCustomField}
                    placeholder="Enter the exact column name from Customer_Data table"
                    size="small"
                    helperText="This is case-sensitive and must match the column name in Customer_Data"
                  />
                </Box>
              )}

              {selectedCustomerForField && customColumnName && (
                <Alert severity="info" icon={<Visibility fontSize="small" />}>
                  This will apply the column <strong>"{customColumnName}"</strong> to all <strong>matched records</strong> for <strong>{selectedCustomerForField}</strong>.
                </Alert>
              )}

              {selectedCustomerForField && customColumnName && (
                <Alert severity="warning" icon={<ErrorIcon fontSize="small" />}>
                  Make sure the column name is spelled correctly. Incorrect column names will cause errors.
                </Alert>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2, borderTop: '1px solid #e5e7eb' }}>
            <Button
              onClick={() => {
                setShowCustomFieldDialog(false);
                setSelectedCustomerForField('');
                setCustomColumnName('');
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={applyCustomFieldToMatched}
              variant="contained"
              sx={{ bgcolor: 'primary.main' }}
              disabled={!selectedCustomerForField || !customColumnName.trim() || loadingCustomField}
            >
              {loadingCustomField ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  Processing...
                </>
              ) : (
                'Apply Field'
              )}
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