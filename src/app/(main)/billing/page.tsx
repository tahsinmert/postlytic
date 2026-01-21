'use client';

import { useAuth } from '@/hooks/use-auth';
import { 
  Loader2, 
  CreditCard, 
  Sparkles, 
  Check, 
  X, 
  ArrowRight, 
  Calendar,
  TrendingUp,
  BarChart3,
  Download,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Receipt,
  Zap,
  Shield,
  Users,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function BillingPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isLoadingUsage, setIsLoadingUsage] = useState(false);
  const [usage, setUsage] = useState({
    analysesUsed: 0,
    analysesLimit: 10,
    apiCalls: 0,
    storageUsed: 0,
    storageLimit: 100
  });
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  // Fetch usage data from Firestore
  useEffect(() => {
    const fetchUsageData = async () => {
      if (!user) {
        setIsLoadingUsage(false);
        return;
      }

      try {
        setIsLoadingUsage(true);
        
        // Get current month's analyses
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const analysesQuery = query(
          collection(db, 'analyses'),
          where('userId', '==', user.uid)
        );
        
        const analysesSnapshot = await getDocs(analysesQuery);
        
        // Filter by date client-side to avoid index issues
        let currentMonthCount = 0;
        analysesSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.createdAt) {
            try {
              const createdAt = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
              if (createdAt >= startOfMonth) {
                currentMonthCount++;
              }
            } catch (e) {
              // Skip invalid dates
              console.warn('Invalid date in analysis:', doc.id);
            }
          }
        });
        
        setUsage(prev => ({
          ...prev,
          analysesUsed: currentMonthCount,
          apiCalls: currentMonthCount // Using analyses count as API calls for now
        }));
      } catch (error) {
        console.error('Error fetching usage data:', error);
        // Silently fail on initial load - user can retry if needed
      } finally {
        setIsLoadingUsage(false);
      }
    };

    if (user) {
      fetchUsageData();
    } else {
      setIsLoadingUsage(false);
    }
  }, [user]);

  if (loading || isLoadingUsage) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!user) return null;

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Up to 10 analyses per month',
        'Basic analytics dashboard',
        'Email support',
        'Community access',
        'Standard export formats'
      ],
      limitations: [
        'No API access',
        'No custom branding',
        'Limited export options'
      ],
      current: true,
      popular: false
    },
    {
      id: 'pro',
      name: 'PRO Plan',
      price: isAnnual ? '$24' : '$29',
      period: isAnnual ? 'per month (billed annually)' : 'per month',
      description: 'For power users and teams',
      features: [
        'Unlimited analyses',
        'Advanced analytics & insights',
        'Priority support (24/7)',
        'Full API access',
        'Export reports (PDF, CSV, JSON)',
        'Custom branding',
        'Team collaboration',
        'Advanced filters & segments'
      ],
      limitations: [],
      current: false,
      popular: true,
      savings: isAnnual ? 'Save $60/year' : 'Save 20% with annual billing'
    }
  ];

  const usagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const handleUpgrade = () => {
    if (!user) return;
    
    toast({
      title: 'Upgrade to PRO',
      description: 'Please contact support to upgrade your plan. Email: support@linkalyze.com',
      type: 'info'
    });
  };

  const handleCancelSubscription = () => {
    toast({
      title: 'Cancel Subscription',
      description: 'You are currently on the Free Plan. No subscription to cancel.',
      type: 'info'
    });
  };

  const handleAddPayment = () => {
    toast({
      title: 'Add Payment Method',
      description: 'Payment method integration coming soon. Please contact support for upgrades.',
      type: 'info'
    });
  };

  const handleEditPayment = (methodId: string) => {
    toast({
      title: 'Edit Payment Method',
      description: 'Payment method editing coming soon.',
      type: 'info'
    });
  };

  const handleDeletePayment = (methodId: string) => {
    toast({
      title: 'Delete Payment Method',
      description: 'Payment method deletion coming soon.',
      type: 'info'
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: 'Download Invoice',
      description: 'Invoice download coming soon.',
      type: 'info'
    });
  };

  const handleExportAll = () => {
    if (billingHistory.length === 0) {
      toast({
        title: 'No Invoices',
        description: 'You have no invoices to export.',
        type: 'info'
      });
      return;
    }
    toast({
      title: 'Export All',
      description: 'Export functionality coming soon.',
      type: 'info'
    });
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-fg-default">Billing & Subscription</h1>
            <p className="mt-1 text-muted-foreground">Manage your subscription, payment methods, and billing history</p>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-border-default/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-muted-foreground">Analyses</span>
              </div>
              <Badge variant="subtle" className="text-xs">
                {usage.analysesUsed}/{usage.analysesLimit}
              </Badge>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${usagePercentage(usage.analysesUsed, usage.analysesLimit)}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-full ${
                  usagePercentage(usage.analysesUsed, usage.analysesLimit) > 80
                    ? 'bg-red-500'
                    : usagePercentage(usage.analysesUsed, usage.analysesLimit) > 60
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.max(0, usage.analysesLimit - usage.analysesUsed)} analyses remaining this month
            </p>
          </Card>

          <Card className="p-4 border-border-default/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span className="text-sm font-medium text-muted-foreground">API Calls</span>
              </div>
              <Badge variant="subtle" className="text-xs">
                {usage.apiCalls}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-fg-default mt-2">{usage.apiCalls}</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </Card>

          <Card className="p-4 border-border-default/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-muted-foreground">Storage</span>
              </div>
              <Badge variant="subtle" className="text-xs">
                {usage.storageUsed.toFixed(1)} MB
              </Badge>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${usagePercentage(usage.storageUsed, usage.storageLimit)}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-emerald-600"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.max(0, usage.storageLimit - usage.storageUsed).toFixed(1)} MB available
            </p>
          </Card>

          <Card className="p-4 border-border-default/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-muted-foreground">Status</span>
              </div>
              <Badge variant="solid" className="bg-emerald-600 text-white text-xs">
                Active
              </Badge>
            </div>
            <p className="text-sm font-semibold text-fg-default mt-2">Free Plan</p>
            <p className="text-xs text-muted-foreground mt-1">No charges</p>
          </Card>
        </div>

        {/* Current Plan Card */}
        <Card className="p-6 border-border-default/50 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg">
                <CreditCard className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xl font-bold text-fg-default">Free Plan</p>
                  <Badge variant="solid" className="bg-emerald-600 text-white text-xs">
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">No charges • Unlimited access to free features</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Started: {new Date(user.metadata.creationTime || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Next billing: N/A</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancelSubscription}
                disabled
              >
                Cancel Subscription
              </Button>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-500" 
                size="sm"
                onClick={handleUpgrade}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade to PRO
              </Button>
            </div>
          </div>
        </Card>

        {/* Plans Comparison */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-fg-default">Choose Your Plan</h2>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${!isAnnual ? 'font-medium text-fg-default' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? 'bg-emerald-600' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${isAnnual ? 'font-medium text-fg-default' : 'text-muted-foreground'}`}>
                Annual
              </span>
              {isAnnual && (
                <Badge variant="subtle" className="ml-2">Save 20%</Badge>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <Card
                  className={`p-6 border-border-default/50 relative transition-all hover:shadow-lg ${
                    plan.current ? 'ring-2 ring-emerald-500/50' : ''
                  } ${plan.popular ? 'border-emerald-500/50' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge variant="solid" className="bg-emerald-600 text-white text-xs px-3 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  {plan.current && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="solid" className="bg-emerald-600 text-white text-xs">
                        Current
                      </Badge>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-fg-default">{plan.name}</h3>
                      {plan.id === 'pro' && (
                        <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-fg-default">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">/{plan.period}</span>
                    </div>
                    {plan.savings && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{plan.savings}</p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-sm text-fg-default">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, limitIdx) => (
                      <li key={limitIdx} className="flex items-start gap-3 opacity-60">
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.current ? (
                    <Button className="w-full" variant="outline" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-500"
                      onClick={handleUpgrade}
                    >
                      Upgrade to {plan.name}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <Card className="p-6 border-border-default/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-fg-default">Payment Methods</h2>
              <p className="text-sm text-muted-foreground mt-1">Manage your payment methods</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddPayment}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
          
          {paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border-default/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-14 rounded bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-fg-default">
                          {method.brand} •••• {method.last4}
                        </p>
                        {method.isDefault && (
                          <Badge variant="subtle" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditPayment(method.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeletePayment(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-border-default/50 rounded-lg">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium text-fg-default mb-1">No payment methods</p>
              <p className="text-xs text-muted-foreground mb-4">Add a payment method to upgrade to PRO</p>
              <Button variant="outline" size="sm" onClick={handleAddPayment}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          )}
        </Card>

        {/* Billing History */}
        <Card className="p-6 border-border-default/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-fg-default">Billing History</h2>
              <p className="text-sm text-muted-foreground mt-1">View and download your invoices</p>
            </div>
            {billingHistory.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleExportAll}>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            )}
          </div>
          
          {billingHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-default/30">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Invoice</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border-default/20 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 text-sm text-fg-default">
                        {new Date(invoice.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-4 text-sm text-fg-default">{invoice.description}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-fg-default">${invoice.amount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant="solid" 
                          className={`${
                            invoice.status === 'paid' 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-amber-600 text-white'
                          } text-xs`}
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground font-mono">{invoice.invoice}</td>
                      <td className="py-3 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-border-default/50 rounded-lg">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium text-fg-default mb-1">No billing history</p>
              <p className="text-xs text-muted-foreground">Your invoices will appear here once you upgrade</p>
            </div>
          )}
        </Card>

        {/* Security & Trust */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-border-default/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-fg-default">Secure Payments</p>
                <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border-default/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-fg-default">Cancel Anytime</p>
                <p className="text-xs text-muted-foreground">No long-term contracts</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border-default/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-fg-default">30-Day Guarantee</p>
                <p className="text-xs text-muted-foreground">Money-back guarantee</p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
