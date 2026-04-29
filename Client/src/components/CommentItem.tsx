import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Comment } from '../types';

interface Props {
  comment: Comment;
  currentUserId?: string;
  currentUserAvatarUrl?: string;
}

export default function CommentItem({ comment, currentUserId, currentUserAvatarUrl }: Props) {
  const isMe = comment.authorId === currentUserId;

  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
      <Avatar
        src={isMe ? currentUserAvatarUrl : comment.authorAvatar}
        sx={{ width: 34, height: 34, mt: 0.25, flexShrink: 0 }}
      />
      <Box
        sx={{
          flex: 1,
          bgcolor: isMe ? 'rgba(232,99,26,0.07)' : 'grey.100',
          borderRadius: 2.5,
          borderTopLeftRadius: 4,
          px: 1.75,
          py: 1.1,
          borderLeft: isMe ? '3px solid' : 'none',
          borderColor: 'primary.light',
        }}
      >
        <Typography
          variant="caption"
          fontWeight={700}
          display="block"
          color={isMe ? 'primary.dark' : 'text.primary'}
          sx={{ mb: 0.25 }}
        >
          {comment.authorName}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 13.5, lineHeight: 1.5 }}>
          {comment.text}
        </Typography>
      </Box>
    </Box>
  );
}
