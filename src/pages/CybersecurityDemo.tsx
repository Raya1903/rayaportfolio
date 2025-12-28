import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, Lock, Unlock, RotateCcw, Shield, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CybersecurityDemo = () => {
  // Decode state
  const [decodeImage, setDecodeImage] = useState<HTMLImageElement | null>(null);
  const [decodeImageData, setDecodeImageData] = useState<ImageData | null>(null);
  const [decodeImageSrc, setDecodeImageSrc] = useState<string | null>(null);
  const [decodedMessage, setDecodedMessage] = useState("");
  const decodeFileInputRef = useRef<HTMLInputElement>(null);
  const decodeCanvasRef = useRef<HTMLCanvasElement>(null);

  // Encode state
  const [encodeImage, setEncodeImage] = useState<HTMLImageElement | null>(null);
  const [encodeImageData, setEncodeImageData] = useState<ImageData | null>(null);
  const [encodeImageSrc, setEncodeImageSrc] = useState<string | null>(null);
  const [messageToEncode, setMessageToEncode] = useState("");
  const [encodedImageUrl, setEncodedImageUrl] = useState<string | null>(null);
  const encodeFileInputRef = useRef<HTMLInputElement>(null);
  const encodeCanvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();

  // Bit manipulation helpers
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

  // ============ DECODE FUNCTIONS ============
  const handleOpenDecodeImage = () => {
    decodeFileInputRef.current?.click();
  };

  const handleDecodeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setDecodeImage(img);
        setDecodeImageSrc(event.target?.result as string);
        
        const canvas = decodeCanvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(0, 0, img.width, img.height);
            setDecodeImageData(data);
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
        const rgb = data[idx];
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
        const rgb = data[idx];
        const bit = getBitValue(rgb, storageBit);
        b = setBitValue(b, count, bit);
        count++;
      }
    }
    return b;
  };

  const handleDecode = () => {
    if (!decodeImage || !decodeImageData) {
      toast({
        title: "No image loaded",
        description: "Please open an image first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const data = decodeImageData.data;
      const width = decodeImageData.width;
      const height = decodeImageData.height;

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

      const bytes: number[] = [];
      for (let i = 0; i < len; i++) {
        bytes.push(extractByte(data, width, height, i * 8 + 32, 0));
      }

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

  const handleDecodeReset = () => {
    setDecodeImage(null);
    setDecodeImageData(null);
    setDecodeImageSrc(null);
    setDecodedMessage("");
    if (decodeFileInputRef.current) {
      decodeFileInputRef.current.value = "";
    }
    toast({
      title: "Reset complete",
      description: "Ready to decode a new image."
    });
  };

  // ============ ENCODE FUNCTIONS ============
  const handleOpenEncodeImage = () => {
    encodeFileInputRef.current?.click();
  };

  const handleEncodeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setEncodeImage(img);
        setEncodeImageSrc(event.target?.result as string);
        
        const canvas = encodeCanvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(0, 0, img.width, img.height);
            setEncodeImageData(data);
          }
        }
        
        setEncodedImageUrl(null);
        toast({
          title: "Image loaded",
          description: "Enter your message and click 'Encode' to hide it."
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const embedInteger = (data: Uint8ClampedArray, width: number, height: number, start: number, storageBit: number, value: number): void => {
    const maxX = width;
    const maxY = height;
    const startX = Math.floor(start / maxY);
    const startY = start - startX * maxY;
    let count = 0;

    for (let i = startX; i < maxX && count < 32; i++) {
      for (let j = startY; j < maxY && count < 32; j++) {
        const idx = (j * width + i) * 4;
        const bit = getBitValue(value, count);
        data[idx] = setBitValue(data[idx], storageBit, bit);
        count++;
      }
    }
  };

  const embedByte = (data: Uint8ClampedArray, width: number, height: number, start: number, storageBit: number, value: number): void => {
    const maxX = width;
    const maxY = height;
    const startX = Math.floor(start / maxY);
    const startY = start - startX * maxY;
    let count = 0;

    for (let i = startX; i < maxX && count < 8; i++) {
      for (let j = startY; j < maxY && count < 8; j++) {
        const idx = (j * width + i) * 4;
        const bit = getBitValue(value, count);
        data[idx] = setBitValue(data[idx], storageBit, bit);
        count++;
      }
    }
  };

  const handleEncode = () => {
    if (!encodeImage || !encodeImageData) {
      toast({
        title: "No image loaded",
        description: "Please open an image first.",
        variant: "destructive"
      });
      return;
    }

    if (!messageToEncode.trim()) {
      toast({
        title: "No message",
        description: "Please enter a message to hide.",
        variant: "destructive"
      });
      return;
    }

    const maxCapacity = Math.floor((encodeImageData.width * encodeImageData.height - 32) / 8);
    if (messageToEncode.length > maxCapacity) {
      toast({
        title: "Message too long",
        description: `This image can only hold ${maxCapacity} characters. Your message has ${messageToEncode.length}.`,
        variant: "destructive"
      });
      return;
    }

    try {
      const canvas = encodeCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Get fresh image data
      ctx.drawImage(encodeImage, 0, 0);
      const newImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = newImageData.data;
      const width = newImageData.width;
      const height = newImageData.height;

      // Embed message length (32 bits)
      embedInteger(data, width, height, 0, 0, messageToEncode.length);

      // Embed each character
      for (let i = 0; i < messageToEncode.length; i++) {
        embedByte(data, width, height, i * 8 + 32, 0, messageToEncode.charCodeAt(i));
      }

      // Put modified data back to canvas
      ctx.putImageData(newImageData, 0, 0);

      // Generate download URL
      const url = canvas.toDataURL('image/png');
      setEncodedImageUrl(url);

      toast({
        title: "Message encoded!",
        description: "Your message has been hidden in the image. Click 'Download' to save it."
      });
    } catch {
      toast({
        title: "Encoding failed",
        description: "Could not encode message into this image.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    if (!encodedImageUrl) return;

    const link = document.createElement('a');
    link.href = encodedImageUrl;
    link.download = 'steganographed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: "Your steganographed image is being downloaded."
    });
  };

  const handleEncodeReset = () => {
    setEncodeImage(null);
    setEncodeImageData(null);
    setEncodeImageSrc(null);
    setMessageToEncode("");
    setEncodedImageUrl(null);
    if (encodeFileInputRef.current) {
      encodeFileInputRef.current.value = "";
    }
    toast({
      title: "Reset complete",
      description: "Ready to encode a new image."
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
                Steganography Tool
              </CardTitle>
            </div>
            <p className="text-muted-foreground">
              Hide and extract secret messages in images
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs defaultValue="encode" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="encode" className="gap-2">
                  <Lock className="w-4 h-4" />
                  Encode
                </TabsTrigger>
                <TabsTrigger value="decode" className="gap-2">
                  <Unlock className="w-4 h-4" />
                  Decode
                </TabsTrigger>
              </TabsList>

              {/* ENCODE TAB */}
              <TabsContent value="encode" className="space-y-6">
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button onClick={handleOpenEncodeImage} className="gap-2 bg-primary hover:bg-primary/90">
                    <Upload className="w-4 h-4" />
                    Open Image
                  </Button>
                  <Button onClick={handleEncode} variant="secondary" className="gap-2">
                    <Lock className="w-4 h-4" />
                    Encode
                  </Button>
                  {encodedImageUrl && (
                    <Button onClick={handleDownload} variant="secondary" className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  )}
                  <Button onClick={handleEncodeReset} variant="outline" className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>

                <input
                  type="file"
                  ref={encodeFileInputRef}
                  onChange={handleEncodeFileChange}
                  accept=".png,.bmp"
                  className="hidden"
                />
                <canvas ref={encodeCanvasRef} className="hidden" />

                {/* Message Input */}
                <Card className="bg-muted/30 border-border/50">
                  <CardHeader className="py-3 px-4 border-b border-border/50">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Secret Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Textarea
                      value={messageToEncode}
                      onChange={(e) => setMessageToEncode(e.target.value)}
                      placeholder="Enter the message you want to hide..."
                      className="min-h-[120px] bg-background/50 border-border/50 resize-none font-mono"
                    />
                    {encodeImageData && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Capacity: {messageToEncode.length} / {Math.floor((encodeImageData.width * encodeImageData.height - 32) / 8)} characters
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Image Display */}
                <Card className="bg-muted/30 border-border/50">
                  <CardHeader className="py-3 px-4 border-b border-border/50">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {encodedImageUrl ? "Encoded Image (Ready to Download)" : "Source Image"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 min-h-[250px] flex items-center justify-center">
                    {encodedImageUrl ? (
                      <img
                        src={encodedImageUrl}
                        alt="Encoded steganographed image"
                        className="max-w-full max-h-[350px] object-contain rounded-lg shadow-lg border-2 border-green-500/50"
                      />
                    ) : encodeImageSrc ? (
                      <img
                        src={encodeImageSrc}
                        alt="Source image for encoding"
                        className="max-w-full max-h-[350px] object-contain rounded-lg shadow-lg"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Lock className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>No image loaded</p>
                        <p className="text-sm mt-1">Click "Open Image" to select a PNG or BMP file</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* DECODE TAB */}
              <TabsContent value="decode" className="space-y-6">
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button onClick={handleOpenDecodeImage} className="gap-2 bg-primary hover:bg-primary/90">
                    <Upload className="w-4 h-4" />
                    Open Image
                  </Button>
                  <Button onClick={handleDecode} variant="secondary" className="gap-2">
                    <Unlock className="w-4 h-4" />
                    Decode
                  </Button>
                  <Button onClick={handleDecodeReset} variant="outline" className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>

                <input
                  type="file"
                  ref={decodeFileInputRef}
                  onChange={handleDecodeFileChange}
                  accept=".png,.bmp"
                  className="hidden"
                />
                <canvas ref={decodeCanvasRef} className="hidden" />

                {/* Image Display */}
                <Card className="bg-muted/30 border-border/50">
                  <CardHeader className="py-3 px-4 border-b border-border/50">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Steganographed Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 min-h-[250px] flex items-center justify-center">
                    {decodeImageSrc ? (
                      <img
                        src={decodeImageSrc}
                        alt="Loaded steganographed image"
                        className="max-w-full max-h-[350px] object-contain rounded-lg shadow-lg"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Unlock className="w-16 h-16 mx-auto mb-4 opacity-30" />
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
              </TabsContent>
            </Tabs>

            {/* Info Section */}
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 mt-6">
              <h3 className="font-semibold text-primary mb-2">How it works</h3>
              <p className="text-sm text-muted-foreground">
                This tool uses LSB (Least Significant Bit) steganography to hide and extract messages 
                in images. The message is encoded in the least significant bits of pixel values, 
                making it invisible to the naked eye. Use the <strong>Encode</strong> tab to hide a message, 
                then share the image. The recipient can use the <strong>Decode</strong> tab to reveal it.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CybersecurityDemo;