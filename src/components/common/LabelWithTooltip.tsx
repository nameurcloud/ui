import React from 'react';
import { Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface LabelWithTooltipProps {
  label: string;
  message: string;
}

const LabelWithTooltip: React.FC<LabelWithTooltipProps> = ({ label, message }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span>{label}</span>
    <Tooltip title={message} arrow>
      <InfoOutlinedIcon fontSize="small" style={{ marginLeft: 4, cursor: 'pointer' }} />
    </Tooltip>
  </div>
);

export default LabelWithTooltip;
