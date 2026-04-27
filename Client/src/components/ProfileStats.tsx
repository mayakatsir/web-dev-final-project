import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface Props {
  myTotal: number;
  favTotal: number;
}

export default function ProfileStats({ myTotal, favTotal }: Props) {
  const stats = [
    { value: myTotal, label: 'Recipes' },
    { value: favTotal, label: 'Favorites' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        width: 'fit-content',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
        mb: 3,
        mx: 'auto',
      }}
    >
      {stats.map((stat, i) => (
        <Box key={stat.label} sx={{ display: 'flex' }}>
          {i > 0 && <Box sx={{ width: '1px', bgcolor: 'divider' }} />}
          <Box sx={{ px: { xs: 2.5, sm: 3.5 }, py: 1.5, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ lineHeight: 1.2, fontSize: { xs: 18, sm: 20 } }}>
              {stat.value}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}
            >
              {stat.label}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
