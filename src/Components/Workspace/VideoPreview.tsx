import React from 'react';

interface VideoPreviewProps {
  videoData: string | null;
}

export default function VideoPreview({ videoData }: VideoPreviewProps) {
  return (
    <video
      className="w-full h-full object-contain"
      controls
      style={{ display: videoData ? 'block' : 'none' }}
      src={videoData || undefined}
    />
  );
}