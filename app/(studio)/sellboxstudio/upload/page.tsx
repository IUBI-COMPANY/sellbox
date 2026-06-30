"use client";

import { useCallback, useRef, useState } from "react";
import {
  Upload,
  Film,
  MonitorPlay,
  RatioIcon,
  FileVideo,
  CloudUpload,
} from "lucide-react";

export default function StudioUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) setIsDragging(true);
    },
    [isDragging],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      // Files handling will be implemented later
      // const files = e.dataTransfer.files;
    },
    [],
  );

  const handleFileChange = useCallback(
    (_e: React.ChangeEvent<HTMLInputElement>) => {
      // File handling will be implemented later
      // const files = e.target.files;
    },
    [],
  );

  const infoItems = [
    {
      icon: <Film className="w-5 h-5 text-muted-foreground" />,
      title: "Tamaño y duración",
      description: "Tamaño máximo: 30 GB, duración del video: 60 minutos.",
    },
    {
      icon: <FileVideo className="w-5 h-5 text-muted-foreground" />,
      title: "Formatos de archivo",
      description:
        'Recomendado: ".mp4". Otros formatos principales son soportados.',
    },
    {
      icon: <MonitorPlay className="w-5 h-5 text-muted-foreground" />,
      title: "Resoluciones de video",
      description:
        "Alta resolución recomendada: 1080p, 1440p, 4K.",
    },
    {
      icon: <RatioIcon className="w-5 h-5 text-muted-foreground" />,
      title: "Relación de aspecto",
      description:
        "Recomendado: 16:9 para horizontal, 9:16 para vertical.",
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
      {/* Upload Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative rounded-2xl border-2 border-dashed
          transition-all duration-300 ease-out
          flex flex-col items-center justify-center
          min-h-[380px] md:min-h-[420px]
          ${
            isDragging
              ? "border-accent bg-accent/5 scale-[1.005]"
              : "border-border hover:border-border-hover bg-card/40"
          }
        `.trim()}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          id="video-upload-input"
        />

        {/* Cloud icon */}
        <div
          className={`
            mb-4 p-4 rounded-full transition-all duration-300
            ${isDragging ? "bg-accent/10 text-accent" : "bg-card text-muted-foreground"}
          `.trim()}
        >
          <CloudUpload className="w-12 h-12" />
        </div>

        {/* Text */}
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Selecciona un video para subir
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          O arrastra y suelta aquí
        </p>

        {/* Select Button */}
        <button
          onClick={handleSelectClick}
          className="
            px-8 py-3 rounded-lg text-sm font-semibold text-white
            transition-all duration-200
            hover:scale-[1.03] active:scale-[0.98]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background
          "
          style={{
            background: "linear-gradient(135deg, #ff8c00 0%, #ff5100 100%)",
          }}
        >
          Seleccionar video
        </button>
      </div>

      {/* Info bar */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {infoItems.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">{item.icon}</div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
