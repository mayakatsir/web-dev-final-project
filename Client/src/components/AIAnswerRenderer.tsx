import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface Props {
  answer: string;
}

export default function AIAnswerRenderer({ answer }: Props) {
  return (
    <>
      {answer.split('\n').map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <Box key={i} sx={{ height: 6 }} />;

        if (/^#{1,3} /.test(trimmed)) {
          return (
            <Typography
              key={i}
              sx={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: 18,
                color: 'primary.main',
                mt: 1.5,
                mb: 0.5,
              }}
            >
              {trimmed.replace(/^#{1,3}\s+/, '')}
            </Typography>
          );
        }

        const baseText = /^\d+\./.test(trimmed)
          ? trimmed.replace(/^\d+\.\s*/, '')
          : trimmed.startsWith('- ') || trimmed.startsWith('* ')
            ? trimmed.slice(2)
            : trimmed;

        const parts = baseText.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <Box key={j} component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {part.slice(2, -2)}
            </Box>
          ) : (
            part
          ),
        );

        if (/^\d+\./.test(trimmed)) {
          return (
            <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  minWidth: 22,
                  height: 22,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: '2px',
                  flexShrink: 0,
                }}
              >
                {trimmed.match(/^(\d+)/)?.[1]}
              </Box>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                {rendered}
              </Typography>
            </Box>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <Box key={i} sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 700, mt: '1px' }}>
                •
              </Box>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                {rendered}
              </Typography>
            </Box>
          );
        }

        return (
          <Typography key={i} variant="body2" sx={{ lineHeight: 1.7, mb: 0.25 }}>
            {rendered}
          </Typography>
        );
      })}
    </>
  );
}
