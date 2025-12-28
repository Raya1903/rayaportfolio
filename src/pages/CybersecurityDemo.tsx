import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Lock, RotateCcw, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CybersecurityDemo = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [decodedMessage, setDecodedMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleOpenImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.png') && !file.name.toLowerCase().endsWith('.bmp')) {
      toast({
        title: "Invalid file type",
        description: "Please select a PNG or BMP image file.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setImageSrc(event.target?.result as string);
        
        // Draw image to canvas to get pixel data
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(0, 0, img.width, img.height);
            setImageData(data);
          }
        }
        
        toast({
          title: "Image loaded",
          description: "Click 'Decode' to extract the hidden message."
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const getBitValue = (n: number, location: number): number => {
    const v = n & Math.round(Math.pow(2, location));
    return v === 0 ? 0 : 1;
  };

  const setBitValue = (n: number, location: number, bit: number): number => {
    const toggle = Math.pow(2, location);
    const bv = getBitValue(n, location);
    if (bv === bit) return n;
    if (bv === 0 && bit === 1) return n | toggle;
    if (bv === 1 && bit === 0) return n ^ toggle;
    return n;
  };

  const extractInteger = (data: Uint8ClampedArray, width: number, height: number, start: number, storageBit: number): number => {
    const maxX = width;
    const maxY = height;
    const startX = Math.floor(start / maxY);
    const startY = start - startX * maxY;
    let count = 0;
    let length = 0;

    for (let i = startX; i < maxX && count < 32; i++) {
      for (let j = startY; j < maxY && count < 32; j++) {
        const idx = (j * width + i) * 4;
        const rgb = data[idx]; // Red channel
        const bit = getBitValue(rgb, storageBit);
        length = setBitValue(length, count, bit);
        count++;
      }
    }
    return length;
  };

  const extractByte = (data: Uint8ClampedArray, width: number, height: number, start: number, storageBit: number): number => {
    const maxX = width;
    const maxY = height;
    const startX = Math.floor(start / maxY);
    const startY = start - startX * maxY;
    let count = 0;
    let b = 0;

    for (let i = startX; i < maxX && count < 8; i++) {
      for (let j = startY; j < maxY && count < 8; j++) {
        const idx = (j * width + i) * 4;
        const rgb = data[idx]; // Red channel
        const bit = getBitValue(rgb, storageBit);
        b = setBitValue(b, count, bit);
        count++;
      }
    }
    return b;
  };

  const handleDecode = () => {
    if (!image || !imageData) {
      toast({
        title: "No image loaded",
        description: "Please open an image first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;

      // Extract message length (first 32 bits)
      const len = extractInteger(data, width, height, 0, 0);

      if (len <= 0 || len > 10000) {
        toast({
          title: "No hidden message found",
          description: "This image may not contain a steganographic message.",
          variant: "destructive"
        });
        setDecodedMessage("");
        return;
      }

      // Extract message bytes
      const bytes: number[] = [];
      for (let i = 0; i < len; i++) {
        bytes.push(extractByte(data, width, height, i * 8 + 32, 0));
      }

      // Convert bytes to string
      const message = String.fromCharCode(...bytes);
      setDecodedMessage(message);

      toast({
        title: "Message decoded!",
        description: `Found ${len} characters of hidden text.`
      });
    } catch {
      toast({
        title: "Decoding failed",
        description: "Could not extract message from this image.",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    setImage(null);
    setImageData(null);
    setImageSrc(null);
    setDecodedMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "Reset complete",
      description: "Ready to decode a new image."
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/#projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader className="text-center border-b border-border/50">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl md:text-3xl font-bold">
                Steganography Decoder
              </CardTitle>
            </div>
            <p className="text-muted-foreground">
              Extract hidden messages from steganographed images
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Control Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={handleOpenImage}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Upload className="w-4 h-4" />
                Open Image
              </Button>
              <Button
                onClick={handleDecode}
                variant="secondary"
                className="gap-2"
              >
                <Lock className="w-4 h-4" />
                Decode
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".png,.bmp"
              className="hidden"
            />

            {/* Hidden canvas for image processing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Image Display */}
            <Card className="bg-muted/30 border-border/50">
              <CardHeader className="py-3 px-4 border-b border-border/50">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Steganographed Image
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 min-h-[300px] flex items-center justify-center">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt="Loaded steganographed image"
                    className="max-w-full max-h-[400px] object-contain rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Shield className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>No image loaded</p>
                    <p className="text-sm mt-1">Click "Open Image" to select a PNG or BMP file</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Decoded Message */}
            <Card className="bg-muted/30 border-border/50">
              <CardHeader className="py-3 px-4 border-b border-border/50">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Decoded Message
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Textarea
                  value={decodedMessage}
                  readOnly
                  placeholder="Hidden message will appear here after decoding..."
                  className="min-h-[120px] bg-background/50 border-border/50 resize-none font-mono"
                />
              </CardContent>
            </Card>

            {/* Info Section */}
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <h3 className="font-semibold text-primary mb-2">How it works</h3>
              <p className="text-sm text-muted-foreground">
                This tool uses LSB (Least Significant Bit) steganography to extract hidden messages 
                from images. The message is encoded in the least significant bits of pixel values, 
                making it invisible to the naked eye. Load a steganographed PNG or BMP image and 
                click "Decode" to reveal the hidden text.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CybersecurityDemo;