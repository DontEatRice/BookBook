import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useMemo, useState } from 'react';

function ExpandableText({
  value,
  maxChars,
  expandLabel,
  shrinkLabel,
}: {
  value: string;
  maxChars: number;
  expandLabel?: string;
  shrinkLabel?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const shortText = useMemo(() => {
    return value.substring(0, maxChars) + '...';
  }, [maxChars, value]);

  if (value.length <= maxChars) {
    return <span>{value}</span>;
  }
  if (!expanded) {
    return (
      <span>
        {shortText}{' '}
        <Box
          component={'span'}
          onClick={() => setExpanded(!expanded)}
          color={theme.palette.primary.main}
          sx={{ cursor: 'pointer' }}>
          {expandLabel || 'więcej'}
        </Box>
      </span>
    );
  }
  return (
    <span>
      {value}{' '}
      <Box
        component={'span'}
        onClick={() => setExpanded(!expanded)}
        color={theme.palette.primary.main}
        sx={{ cursor: 'pointer' }}>
        {shrinkLabel || 'mniej'}
      </Box>{' '}
    </span>
  );
}

export default ExpandableText;
