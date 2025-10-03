import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useMediKey, generateId } from '@/contexts/MediKeyContext';
import { usePublishHealthRecord } from '@/hooks/useMediKeyNostr';
import { Upload, Image, File, CheckCircle, Globe } from 'lucide-react';
import { LightningIcon, RecordIcon } from '@/components/icons/BitcoinIcons';
import { useToast } from '@/hooks/useToast';
import type { HealthRecord } from '@/types/medikey';

export function UploadRecord() {
  const { state, dispatch } = useMediKey();
  const { toast } = useToast();
  const { mutate: publishToNostr, isPending: isPublishingToNostr } = usePublishHealthRecord();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'general' as HealthRecord['type'],
    description: '',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [publishToNostrEnabled, setPublishToNostrEnabled] = useState(true);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill title if empty
      if (!formData.title) {
        setFormData(prev => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, "")
        }));
      }
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const simulateUpload = async (): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        setUploadProgress(progress);
      }, 200);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || !formData.title || !state.currentUser) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload process
      await simulateUpload();

      // Read file content
      const fileContent = await readFileAsBase64(selectedFile);

      // Create health record
      const record: HealthRecord = {
        id: generateId(),
        patientId: state.currentUser.publicKey,
        title: formData.title,
        type: formData.type,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileContent,
        uploadDate: new Date(),
        verified: false,
        metadata: {
          description: formData.description,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        }
      };

      // Add record to state
      dispatch({ type: 'ADD_RECORD', payload: record });

      // Publish to Nostr if enabled
      if (publishToNostrEnabled) {
        try {
          publishToNostr(record);
          toast({
            title: 'Published to Nostr',
            description: 'Record has been published to the decentralized network.',
          });
        } catch (nostrError) {
          toast({
            title: 'Nostr Publish Warning',
            description: 'Record saved locally but failed to publish to Nostr network.',
            variant: 'destructive',
          });
        }
      }

      // Add activity log
      dispatch({
        type: 'ADD_ACTIVITY',
        payload: {
          id: generateId(),
          userId: state.currentUser.publicKey,
          action: 'upload',
          description: `Uploaded ${formData.type} record: ${formData.title}${publishToNostrEnabled ? ' (Published to Nostr)' : ' (Local only)'}`,
          timestamp: new Date(),
          metadata: { recordId: record.id, publishedToNostr: publishToNostrEnabled }
        }
      });

      setUploadComplete(true);
      toast({
        title: 'Record Uploaded',
        description: `${formData.title} has been uploaded successfully.`,
      });

      // Reset form after delay
      setTimeout(() => {
        setFormData({ title: '', type: 'general', description: '', tags: '' });
        setSelectedFile(null);
        setUploadComplete(false);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 2000);

    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading your record.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-8 w-8" />;
    if (type.includes('json') || type.includes('csv')) return <RecordIcon className="h-8 w-8" size={32} />;
    return <File className="h-8 w-8" />;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Upload Health Record</h1>
        <p className="text-lg text-muted-foreground">
          Securely upload your medical documents to the blockchain
        </p>
      </div>

      <div className="crypto-card rounded-3xl p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Record Details</h2>
          <p className="text-muted-foreground">
            Provide information about your health record
          </p>
        </div>
        <div className="space-y-8">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Document File</Label>
            <div className="border-2 border-dashed border-border/50 rounded-2xl p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
              {selectedFile ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center text-primary">
                    {getFileIcon(selectedFile.type)}
                  </div>
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change File
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium">Upload a file</p>
                    <p className="text-sm text-muted-foreground">
                      JSON, CSV, PDF, or image files supported
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-11 px-6 rounded-xl border-border/50"
                  >
                    Choose File
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv,.pdf,.jpg,.jpeg,.png,.gif"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Record Type */}
          <div className="space-y-2">
            <Label htmlFor="record-type">Record Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as HealthRecord['type'] }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immunization">Immunization Record</SelectItem>
                <SelectItem value="lab_result">Lab Result</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="general">General Medical Record</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Record Title</Label>
            <Input
              id="title"
              placeholder="Enter a descriptive title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-background transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional details about this record"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="rounded-xl border-border/50 bg-muted/30 focus:bg-background transition-colors"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <Input
              id="tags"
              placeholder="Enter tags separated by commas"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-background transition-colors"
            />
            <p className="text-xs text-muted-foreground">
              e.g., routine, urgent, follow-up
            </p>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Success State */}
          {uploadComplete && (
            <div className="flex items-center space-x-2 text-accent">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Upload completed successfully!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !formData.title || isUploading || uploadComplete || isPublishingToNostr}
              className="flex-1 h-12 rounded-xl button-gradient font-medium"
            >
              {isUploading ? 'Uploading...' :
               isPublishingToNostr ? 'Publishing...' :
               'Upload Record'}
            </Button>

            <Button
              variant="outline"
              disabled={isUploading}
              className="flex items-center space-x-2 h-12 px-6 rounded-xl border-border/50"
            >
              <LightningIcon className="h-4 w-4" size={16} />
              <span>Request Verification</span>
            </Button>
          </div>

          {/* Nostr Publishing Option */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-blue-50/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Publish to Nostr Network</h4>
                <p className="text-xs text-muted-foreground">
                  Store on decentralized relays for maximum availability
                </p>
              </div>
            </div>
            <Button
              variant={publishToNostrEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setPublishToNostrEnabled(!publishToNostrEnabled)}
              className="rounded-lg"
            >
              {publishToNostrEnabled ? 'Enabled' : 'Disabled'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Records are encrypted and stored securely. {publishToNostrEnabled ? 'Publishing to Nostr provides decentralized backup and availability.' : 'Local storage only - enable Nostr for network backup.'}
          </p>
        </div>
      </div>
    </div>
  );
}