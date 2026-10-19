export async function addWatermarkAndCompress(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return reject(new Error("Canvas not supported"));
      }

      // Target max dimensions for compression to save space
      const MAX_WIDTH = 1920;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw original image
      ctx.drawImage(img, 0, 0, width, height);

      // Load watermark logo
      const logoImg = new Image();
      logoImg.src = "/logo.png";

      logoImg.onload = () => {
        // Calculate watermark size (e.g., 25% of image width for good visibility)
        const watermarkWidth = width * 0.25;
        const watermarkHeight = (logoImg.height * watermarkWidth) / logoImg.width;

        // Position watermark at middle center
        const x = (width - watermarkWidth) / 2;
        const y = (height - watermarkHeight) / 2;

        // Make watermark slightly transparent but retain original colors
        ctx.globalAlpha = 1; // 70% opacity for a nice watermark effect without losing details
        // ctx.filter is removed so the original black/3D logo is used
        ctx.filter = "brightness(0) invert(1)";
        ctx.drawImage(logoImg, x, y, watermarkWidth, watermarkHeight);

        // Reset filter for any future operations
        ctx.filter = "none";

        // Convert back to File/Blob (JPEG compression at 80% quality)
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Canvas to Blob failed"));
            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(newFile);
          },
          "image/jpeg",
          0.8
        );
      };

      logoImg.onerror = () => {
        console.warn("Could not load logo for watermark. Proceeding with compression only.");
        // If logo fails to load, just return compressed original
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Canvas to Blob failed"));
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" });
          resolve(newFile);
        }, "image/jpeg", 0.8);
      };
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}
