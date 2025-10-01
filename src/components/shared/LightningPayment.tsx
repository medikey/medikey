import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useMediKey, generateId, generateLightningInvoice } from '@/contexts/MediKeyContext';
import { useToast } from '@/hooks/useToast';
import { 
  Zap, 
  Copy, 
  CheckCircle, 
  Clock, 
  XCircle, 
  QrCode,
  CreditCard,
  Wallet,
  ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';
import type { LightningPayment } from '@/types/medikey';

interface LightningPaymentProps {
  trigger?: React.ReactNode;
  amount?: number;
  description?: string;
  onSuccess?: (payment: LightningPayment) => void;
}

export function LightningPaymentComponent({ 
  trigger, 
  amount = 1000, 
  description = "Record verification", 
  onSuccess 
}: LightningPaymentProps) {
  const { state, dispatch } = useMediKey();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState(amount.toString());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<LightningPayment | null>(null);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleGenerateInvoice = async () => {
    if (!state.currentUser) return;

    setIsGenerating(true);

    try {
      const invoice = generateLightningInvoice(Number(customAmount));
      
      const payment: LightningPayment = {
        id: generateId(),
        userId: state.currentUser.publicKey,
        amount: Number(customAmount),
        invoice,
        status: 'pending',
        type: 'record_verification',
        createdAt: new Date()
      };

      dispatch({ type: 'ADD_PAYMENT', payload: payment });
      setCurrentPayment(payment);

      toast({
        title: 'Invoice Generated',
        description: 'Lightning invoice created successfully.',
      });

    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate Lightning invoice.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePayInvoice = async () => {
    if (!currentPayment) return;

    setIsProcessing(true);
    setPaymentProgress(0);

    try {
      // Simulate payment processing with progress
      const progressInterval = setInterval(() => {
        setPaymentProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      // Simulate payment completion
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setPaymentProgress(100);

      // Update payment status
      dispatch({
        type: 'UPDATE_PAYMENT',
        payload: {
          id: currentPayment.id,
          status: 'paid',
          paidAt: new Date()
        }
      });

      // Add activity log
      dispatch({
        type: 'ADD_ACTIVITY',
        payload: {
          id: generateId(),
          userId: currentPayment.userId,
          action: 'payment',
          description: `Lightning payment completed: ${currentPayment.amount} sats`,
          timestamp: new Date(),
          metadata: { paymentId: currentPayment.id, amount: currentPayment.amount }
        }
      });

      toast({
        title: 'Payment Successful',
        description: `${currentPayment.amount} sats paid successfully!`,
      });

      if (onSuccess) {
        onSuccess({ ...currentPayment, status: 'paid', paidAt: new Date() });
      }

      // Close dialog after success
      setTimeout(() => {
        setIsOpen(false);
        setCurrentPayment(null);
        setPaymentProgress(0);
      }, 2000);

    } catch (error) {
      dispatch({
        type: 'UPDATE_PAYMENT',
        payload: {
          id: currentPayment.id,
          status: 'failed'
        }
      });

      toast({
        title: 'Payment Failed',
        description: 'Lightning payment could not be processed.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyInvoice = async () => {
    if (!currentPayment) return;

    try {
      await navigator.clipboard.writeText(currentPayment.invoice);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Copied!',
        description: 'Lightning invoice copied to clipboard.',
      });
    } catch (err) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy invoice to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: LightningPayment['status']) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-orange-600" />;
    }
  };

  const getStatusColor = (status: LightningPayment['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Lightning Payment</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-orange-500" />
            <span>Lightning Payment</span>
          </DialogTitle>
          <DialogDescription>
            {description} • Pay with Bitcoin Lightning Network
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!currentPayment ? (
            <>
              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (sats)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="1000"
                  min="1"
                />
                <p className="text-xs text-muted-foreground">
                  ≈ ${(Number(customAmount) * 0.0004).toFixed(4)} USD
                </p>
              </div>

              <Button
                onClick={handleGenerateInvoice}
                disabled={!customAmount || Number(customAmount) <= 0 || isGenerating}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Invoice'}
              </Button>
            </>
          ) : (
            <>
              {/* Invoice Display */}
              <Card>
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-orange-100 rounded-lg inline-block">
                      <QrCode className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{currentPayment.amount} sats</p>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Invoice String */}
              <div className="space-y-2">
                <Label>Lightning Invoice</Label>
                <div className="flex space-x-2">
                  <Input
                    value={currentPayment.invoice}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyInvoice}
                    className="shrink-0"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Payment Progress */}
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Processing payment...</span>
                    <span>{Math.round(paymentProgress)}%</span>
                  </div>
                  <Progress value={paymentProgress} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClick={handlePayInvoice}
                  disabled={isProcessing || currentPayment.status === 'paid'}
                  className="flex-1"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 
                   currentPayment.status === 'paid' ? 'Paid!' : 'Pay Invoice'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.open(`lightning:${currentPayment.invoice}`, '_blank')}
                  className="shrink-0"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Scan QR code or copy invoice to your Lightning wallet
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Payment History Component
export function PaymentHistory() {
  const { state } = useMediKey();

  const userPayments = state.payments
    .filter(payment => payment.userId === state.currentUser?.publicKey)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const getStatusIcon = (status: LightningPayment['status']) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-orange-600" />;
    }
  };

  const getStatusColor = (status: LightningPayment['status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Payment History</span>
        </CardTitle>
        <CardDescription>
          Your Lightning payment transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userPayments.length === 0 ? (
          <div className="text-center py-8">
            <Wallet className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              No payments yet. Make your first Lightning transaction.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {userPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-muted rounded-lg">
                    {getStatusIcon(payment.status)}
                  </div>
                  <div>
                    <p className="font-medium">{payment.amount} sats</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {payment.type.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(payment.createdAt, 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                </div>
                
                <Badge className={getStatusColor(payment.status)}>
                  {payment.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}