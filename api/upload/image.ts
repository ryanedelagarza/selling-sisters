import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

// Allowed file types
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for file uploads
  },
};

// Helper to parse multipart form data
async function parseMultipartForm(req: VercelRequest): Promise<{ file: Buffer; contentType: string; filename: string } | null> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalSize = 0;

    req.on('data', (chunk: Buffer) => {
      totalSize += chunk.length;
      if (totalSize > MAX_SIZE_BYTES) {
        req.destroy();
        reject(new Error(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`));
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const body = Buffer.concat(chunks);
        const contentType = req.headers['content-type'] || '';
        
        if (!contentType.includes('multipart/form-data')) {
          reject(new Error('Expected multipart/form-data'));
          return;
        }

        // Extract boundary
        const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
        if (!boundaryMatch) {
          reject(new Error('No boundary found in content-type'));
          return;
        }
        const boundary = boundaryMatch[1] || boundaryMatch[2];

        // Parse the multipart data
        const bodyStr = body.toString('latin1');
        const parts = bodyStr.split(`--${boundary}`);
        
        for (const part of parts) {
          if (part.includes('Content-Disposition') && part.includes('filename=')) {
            // Extract filename
            const filenameMatch = part.match(/filename="([^"]+)"/);
            const filename = filenameMatch ? filenameMatch[1] : 'upload.jpg';
            
            // Extract content type
            const typeMatch = part.match(/Content-Type:\s*([^\r\n]+)/i);
            const fileContentType = typeMatch ? typeMatch[1].trim() : 'image/jpeg';
            
            // Extract file data (after double CRLF)
            const dataStart = part.indexOf('\r\n\r\n');
            if (dataStart === -1) continue;
            
            // Remove trailing boundary markers
            let fileData = part.slice(dataStart + 4);
            if (fileData.endsWith('\r\n')) {
              fileData = fileData.slice(0, -2);
            }
            if (fileData.endsWith('--')) {
              fileData = fileData.slice(0, -2);
            }
            if (fileData.endsWith('\r\n')) {
              fileData = fileData.slice(0, -2);
            }
            
            resolve({
              file: Buffer.from(fileData, 'latin1'),
              contentType: fileContentType,
              filename,
            });
            return;
          }
        }
        
        reject(new Error('No file found in request'));
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Blob storage is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // Development mode - return a placeholder URL
      console.log('BLOB_READ_WRITE_TOKEN not configured - using placeholder');
      
      const timestamp = Date.now();
      const placeholderUrl = `https://placehold.co/400x400/EDE9FE/A78BFA?text=Reference+${timestamp}`;
      
      return res.status(200).json({
        success: true,
        url: placeholderUrl,
        filename: `reference-${timestamp}.jpg`,
        message: 'Development mode - using placeholder image',
      });
    }

    // Parse the multipart form data
    const parsed = await parseMultipartForm(req);
    
    if (!parsed) {
      return res.status(400).json({
        success: false,
        error: 'No file provided',
      });
    }

    const { file, contentType, filename } = parsed;

    // Validate file type
    if (!ALLOWED_TYPES.includes(contentType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`,
      });
    }

    // Validate file size
    if (file.length > MAX_SIZE_BYTES) {
      return res.status(400).json({
        success: false,
        error: `File too large. Maximum size is ${MAX_SIZE_MB}MB.`,
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = contentType === 'image/png' ? 'png' : 'jpg';
    const uniqueFilename = `reference-${timestamp}-${randomStr}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: 'public',
      contentType,
    });

    console.log(`Image uploaded: ${blob.url}`);

    return res.status(200).json({
      success: true,
      url: blob.url,
      filename: uniqueFilename,
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    if (message.includes('too large')) {
      return res.status(400).json({
        success: false,
        error: message,
      });
    }

    return res.status(500).json({
      success: false,
      error: "We couldn't upload your photo. Please try a different image or try again.",
    });
  }
}
