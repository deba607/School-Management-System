import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called');
    
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    console.log('Files received:', files.length);
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedFiles: Array<{
      originalName: string;
      mimeType: string;
      size: number;
      base64Data: string;
    }> = [];

    for (const file of files) {
      console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: 'Only image files are allowed' },
          { status: 400 }
        );
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'File size must be less than 5MB' },
          { status: 400 }
        );
      }

      try {
        // Read file data
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        console.log('File read successfully, size:', buffer.length);
        
        // Convert to base64
        const base64Data = buffer.toString('base64');
        
        console.log('File converted to base64 successfully');
        
        uploadedFiles.push({
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          base64Data
        });
      } catch (fileError: unknown) {
        console.error('Error processing file:', file.name, fileError);
        const errorMessage = fileError instanceof Error ? fileError.message : 'Unknown file processing error';
        return NextResponse.json(
          { success: false, error: `Failed to process file: ${file.name} - ${errorMessage}` },
          { status: 500 }
        );
      }
    }

    console.log('All files processed successfully:', uploadedFiles.length);

    return NextResponse.json(
      { 
        success: true, 
        data: uploadedFiles,
        message: `Successfully converted ${uploadedFiles.length} file(s) to base64` 
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
    return NextResponse.json(
      { success: false, error: `Failed to upload files: ${errorMessage}` },
      { status: 500 }
    );
  }
} 