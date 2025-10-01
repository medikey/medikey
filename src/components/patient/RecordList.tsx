import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMediKey } from '@/contexts/MediKeyContext';
import { 
  FileText, 
  Image, 
  File, 
  Search, 
  Filter, 
  Calendar,
  Share2,
  CheckCircle,
  Clock,
  Eye,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import type { HealthRecord } from '@/types/medikey';

export function RecordList() {
  const { state } = useMediKey();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);

  const userRecords = state.records.filter(record => 
    record.patientId === state.currentUser?.publicKey
  );

  const filteredRecords = userRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.metadata.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesType;
  });

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (type.includes('json') || type.includes('csv')) return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const getTypeColor = (type: HealthRecord['type']) => {
    switch (type) {
      case 'immunization': return 'bg-green-100 text-green-800';
      case 'lab_result': return 'bg-blue-100 text-blue-800';
      case 'prescription': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: HealthRecord['type']) => {
    switch (type) {
      case 'immunization': return 'Immunization';
      case 'lab_result': return 'Lab Result';
      case 'prescription': return 'Prescription';
      default: return 'General';
    }
  };

  const downloadRecord = (record: HealthRecord) => {
    // Create download link for the file content
    const link = document.createElement('a');
    link.href = record.fileContent;
    link.download = record.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Health Records</h1>
        <p className="text-muted-foreground">
          View and manage your uploaded medical documents
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="immunization">Immunization</SelectItem>
                  <SelectItem value="lab_result">Lab Result</SelectItem>
                  <SelectItem value="prescription">Prescription</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No records found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by uploading your first health record'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRecords.map((record) => {
            const sharedCount = state.accessGrants.filter(
              grant => grant.recordId === record.id && grant.isActive
            ).length;

            return (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-2 bg-muted rounded-lg">
                      {getFileIcon(record.fileType)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg truncate">{record.title}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <Badge className={getTypeColor(record.type)}>
                              {getTypeLabel(record.type)}
                            </Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(record.uploadDate, 'MMM d, yyyy')}
                            </div>
                          </div>
                          
                          {record.metadata.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {record.metadata.description}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center text-sm">
                              {record.verified ? (
                                <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                              ) : (
                                <Clock className="h-4 w-4 text-orange-600 mr-1" />
                              )}
                              <span className={record.verified ? 'text-green-600' : 'text-orange-600'}>
                                {record.verified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                            
                            {sharedCount > 0 && (
                              <div className="flex items-center text-sm text-blue-600">
                                <Share2 className="h-4 w-4 mr-1" />
                                <span>Shared with {sharedCount} clinician{sharedCount !== 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedRecord(record)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{record.title}</DialogTitle>
                                <DialogDescription>
                                  {getTypeLabel(record.type)} • Uploaded {format(record.uploadDate, 'MMMM d, yyyy')}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">File:</span> {record.fileName}
                                  </div>
                                  <div>
                                    <span className="font-medium">Type:</span> {record.fileType}
                                  </div>
                                  <div>
                                    <span className="font-medium">Status:</span>{' '}
                                    <span className={record.verified ? 'text-green-600' : 'text-orange-600'}>
                                      {record.verified ? 'Verified' : 'Pending'}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Shared:</span> {sharedCount} time{sharedCount !== 1 ? 's' : ''}
                                  </div>
                                </div>
                                
                                {record.metadata.description && (
                                  <div>
                                    <span className="font-medium text-sm">Description:</span>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {record.metadata.description}
                                    </p>
                                  </div>
                                )}
                                
                                {record.metadata.tags && record.metadata.tags.length > 0 && (
                                  <div>
                                    <span className="font-medium text-sm">Tags:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {record.metadata.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadRecord(record)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}