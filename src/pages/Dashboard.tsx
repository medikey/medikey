import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useMediKey } from '@/contexts/MediKeyContext';
import { useIsMobile } from '@/hooks/useIsMobile';

// Patient Components
import { PatientProfile } from '@/components/patient/PatientProfile';
import { UploadRecord } from '@/components/patient/UploadRecord';
import { RecordList } from '@/components/patient/RecordList';
import { ShareAccess } from '@/components/patient/ShareAccess';
import { PatientSettings } from '@/components/patient/PatientSettings';

// Clinician Components
import { ClinicianProfile } from '@/components/clinician/ClinicianProfile';
import { RequestAccess } from '@/components/clinician/RequestAccess';
import { PatientRecords } from '@/components/clinician/PatientRecords';
import { ClinicianSettings } from '@/components/clinician/ClinicianSettings';

// Shared Components
import { ActivityHistory } from '@/components/shared/ActivityHistory';
import { Analytics } from '@/components/shared/Analytics';
import { PaymentHistory } from '@/components/shared/LightningPayment';
import { WelcomeTutorial } from '@/components/WelcomeTutorial';

export function Dashboard() {
  const { state } = useMediKey();
  const isMobile = useIsMobile();
  const [currentView, setCurrentView] = useState('profile');

  if (!state.currentUser) return null;

  const isPatient = state.currentUser.role === 'patient';

  const renderContent = () => {
    if (isPatient) {
      switch (currentView) {
        case 'profile':
          return <PatientProfile />;
        case 'upload':
          return <UploadRecord />;
        case 'records':
          return <RecordList />;
        case 'share':
          return <ShareAccess />;
        case 'history':
          return <ActivityHistory />;
        case 'analytics':
          return <Analytics />;
        case 'settings':
          return <PatientSettings />;
        default:
          return <PatientProfile />;
      }
    } else {
      switch (currentView) {
        case 'profile':
          return <ClinicianProfile />;
        case 'request':
          return <RequestAccess />;
        case 'records':
          return <PatientRecords />;
        case 'analytics':
          return <Analytics />;
        case 'settings':
          return <ClinicianSettings />;
        default:
          return <ClinicianProfile />;
      }
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="flex">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />

        <main className={`flex-1 ${!isMobile ? 'lg:ml-72' : ''}`}>
          <div className={`p-6 lg:p-10 ${isMobile ? 'pt-20' : ''}`}>
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>

      <WelcomeTutorial />
    </div>
  );
}