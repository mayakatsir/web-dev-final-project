import { Router, Request, Response } from 'express';
import { getGridFSFileMeta, openGridFSDownloadStream } from '../services/gridfs';

const uploadsRouter = Router();

uploadsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const meta = await getGridFSFileMeta(req.params.id);
    if (!meta) {
      res.status(404).json({ message: 'File not found' });
      return;
    }
    res.set('Content-Type', (meta as any).contentType ?? 'image/jpeg');
    openGridFSDownloadStream(req.params.id).pipe(res);
  } catch {
    res.status(400).json({ message: 'Invalid file id' });
  }
});

export default uploadsRouter;
