import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Switch,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Close as CloseIcon,
  Language as WebsiteIcon,
  Store as ShopifyIcon,
  Web as WordPressIcon,
  CropSquare as StandardIcon,
  Launch as PopupIcon,
  ViewSidebar as SidebarIcon,
  ViewAgenda as SideTabIcon,
  PictureInPicture as PopoverIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material';

const EmbedForm = ({ formId }) => {
  const [embedMode, setEmbedMode] = useState('standard');
  const [autoHeight, setAutoHeight] = useState(true);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const integrationOptions = [
    { id: 'website', label: 'Website', icon: WebsiteIcon },
    { id: 'shopify', label: 'Shopify', icon: ShopifyIcon },
    { id: 'wordpress', label: 'WordPress', icon: WordPressIcon },
  ];

  const embedModes = [
    { id: 'standard', label: 'Standard', icon: StandardIcon },
    { id: 'popup', label: 'Popup', icon: PopupIcon },
    { id: 'sidebar', label: 'Sidebar', icon: SidebarIcon },
    { id: 'sidetab', label: 'Side Tab', icon: SideTabIcon },
    { id: 'popover', label: 'Popover', icon: PopoverIcon },
    { id: 'fullscreen', label: 'Fullscreen', icon: FullscreenIcon },
  ];

  const generateEmbedCode = () => {
    const baseUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
    return `<script src="${baseUrl}/widget/standard.js" type="module"></script>
<formester-standard-form
  set-auto-height="${autoHeight}"
  height="100%"
  id="${formId}"
  url="${baseUrl}/f/${formId}"
></formester-standard-form>`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode());
      setShowSnackbar(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Get the code
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Insert the code where you want your form to be displayed
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          {/* Form Preview */}
          <Box sx={{ height: 600, bgcolor: '#f5f5f5', borderRadius: 1, mb: 3 }}>
            <iframe
              src={`${process.env.REACT_APP_FRONTEND_URL}/f/${formId}`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Form Preview"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Integration Options */}
          <Typography variant="subtitle1" gutterBottom>
            Choose Integration
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {integrationOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Grid item key={option.id}>
                  <Card 
                    sx={{ 
                      width: 100,
                      cursor: 'pointer',
                      bgcolor: option.id === 'website' ? 'primary.main' : 'background.paper'
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Icon sx={{ fontSize: 32, color: option.id === 'website' ? 'white' : 'inherit' }} />
                      <Typography 
                        variant="body2"
                        sx={{ 
                          mt: 1,
                          color: option.id === 'website' ? 'white' : 'inherit'
                        }}
                      >
                        {option.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Embed Modes */}
          <Typography variant="subtitle1" gutterBottom>
            Embed Mode
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {embedModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <Grid item xs={4} key={mode.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      bgcolor: mode.id === embedMode ? 'primary.main' : 'background.paper'
                    }}
                    onClick={() => setEmbedMode(mode.id)}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Icon sx={{ 
                        fontSize: 24,
                        color: mode.id === embedMode ? 'white' : 'inherit'
                      }} />
                      <Typography 
                        variant="caption" 
                        display="block"
                        sx={{ 
                          mt: 1,
                          color: mode.id === embedMode ? 'white' : 'inherit'
                        }}
                      >
                        {mode.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Auto Height Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Typography variant="subtitle1">Auto Height</Typography>
            <Switch
              checked={autoHeight}
              onChange={(e) => setAutoHeight(e.target.checked)}
              sx={{ ml: 2 }}
            />
          </Box>

          {/* Get Code Button */}
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => setShowCopyDialog(true)}
            startIcon={<CopyIcon />}
          >
            Get Code
          </Button>
        </Grid>
      </Grid>

      {/* Copy Code Dialog */}
      <Dialog
        open={showCopyDialog}
        onClose={() => setShowCopyDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Copy The Code
            <IconButton onClick={() => setShowCopyDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              bgcolor: '#1a1a2e',
              color: '#00ff00',
              p: 3,
              borderRadius: 1,
              fontFamily: 'monospace',
              position: 'relative',
              mb: 2,
            }}
          >
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {generateEmbedCode()}
            </pre>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCopy}
            startIcon={<CopyIcon />}
            fullWidth
          >
            Copy
          </Button>
        </DialogContent>
      </Dialog>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message="Code copied to clipboard!"
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setShowSnackbar(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default EmbedForm;
