import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useMediKey } from '@/contexts/MediKeyContext';
import { 
  FileText, 
  Share2, 
  Shield, 
  Zap, 
  ArrowRight, 
  CheckCircle,
  Users,
  Search
} from 'lucide-react';

export function WelcomeTutorial() {
  const { state } = useMediKey();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Show tutorial for new users who just created an account
    if (state.currentUser && state.currentUser.name && state.records.length === 0 && state.activityLog.length <= 1) {
      setIsOpen(true);
    }
  }, [state.currentUser, state.records.length, state.activityLog.length]);

  const isPatient = state.currentUser?.role === 'patient';

  const patientSteps = [
    {
      title: 'Welcome to MediKey!',
      description: 'Your secure healthcare identity has been created. Let\'s get you started.',
      icon: <Shield className="h-8 w-8 text-primary" />,
      content: 'You now have a cryptographic healthcare identity that gives you complete control over your medical records.'
    },
    {
      title: 'Upload Your Records',
      description: 'Start by uploading your medical documents securely to the blockchain.',
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      content: 'Use the "Upload Records" section to add immunization records, lab results, prescriptions, and other medical documents.'
    },
    {
      title: 'Share with Clinicians',
      description: 'Grant specific doctors access to your records when needed.',
      icon: <Share2 className="h-8 w-8 text-green-600" />,
      content: 'In the "Share Access" section, you can grant clinicians permission to view specific records by entering their public key.'
    },
    {
      title: 'Lightning Payments',
      description: 'Use Bitcoin Lightning for instant record verification payments.',
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      content: 'Clinicians can verify your records using Lightning payments, adding an extra layer of authenticity to your medical data.'
    }
  ];

  const clinicianSteps = [
    {
      title: 'Welcome to MediKey!',
      description: 'Your clinical practice identity has been created. Let\'s explore your tools.',
      icon: <Shield className="h-8 w-8 text-primary" />,
      content: 'You now have a secure clinical identity for accessing patient records with proper authorization.'
    },
    {
      title: 'Request Patient Access',
      description: 'Search for patients and request access to their medical records.',
      icon: <Search className="h-8 w-8 text-blue-600" />,
      content: 'Use "Request Access" to find patients by their public key and send authorization requests for record access.'
    },
    {
      title: 'View Patient Records',
      description: 'Access shared medical records from your authorized patients.',
      icon: <Users className="h-8 w-8 text-green-600" />,
      content: 'In "Patient Records", view all medical documents that patients have shared with you, organized and searchable.'
    },
    {
      title: 'Verify Records',
      description: 'Use Lightning payments to verify and authenticate medical records.',
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      content: 'Verify the authenticity of patient records using Bitcoin Lightning payments, ensuring data integrity.'
    }
  ];

  const steps = isPatient ? patientSteps : clinicianSteps;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
  };

  if (!state.currentUser || !isOpen) return null;

  const step = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            {step.icon}
          </div>
          <DialogTitle className="text-center">{step.title}</DialogTitle>
          <DialogDescription className="text-center">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <Card className="border-dashed">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              {step.content}
            </p>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentStep
                  ? 'bg-primary'
                  : index < currentStep
                  ? 'bg-green-500'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleSkip}>
            Skip Tutorial
          </Button>
          
          <Button onClick={handleNext} className="flex items-center space-x-2">
            {currentStep === steps.length - 1 ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Get Started</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>

        {/* Step Counter */}
        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
}