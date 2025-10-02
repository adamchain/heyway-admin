// Generated TypeScript interfaces for MongoDB collections
// Generated on: 2025-09-21T21:36:48.584Z

import { ObjectId } from 'mongodb';

export interface VerifiedNumbers {
  _id: Record<string, any>; // 100.0% of documents
  userId: Record<string, any>; // 100.0% of documents
  phoneNumber: string; // 100.0% of documents
  verified: boolean; // 100.0% of documents
  createdAt: Record<string, any>; // 100.0% of documents
  updatedAt: Record<string, any>; // 100.0% of documents
}

export interface Calls {
  _id: Record<string, any>; // 100.0% of documents
  userId: Record<string, any>; // 100.0% of documents
  sessionId: string; // 100.0% of documents
  status: string; // 100.0% of documents
  callMode: string; // 100.0% of documents
  participants: Record<string, any>[]; // 100.0% of documents
  transcription: Record<string, any>[]; // 100.0% of documents
  aiConfig: Record<string, any>; // 100.0% of documents
  startedAt: Record<string, any>; // 100.0% of documents
  isInbound: boolean; // 100.0% of documents
  inboundData: Record<string, any>; // 100.0% of documents
  createdAt: Record<string, any>; // 100.0% of documents
  updatedAt: Record<string, any>; // 100.0% of documents
  __v: number; // 100.0% of documents
  twilioCallSid?: string; // 29.0% of documents
  endedAt?: Record<string, any>; // 29.0% of documents
  metrics?: Record<string, any>; // 29.0% of documents
  analysis?: Record<string, any>; // 94.0% of documents
}

export interface Scheduledcalls {
  _id: Record<string, any>; // 100.0% of documents
  userId: Record<string, any>; // 100.0% of documents
  recipients: string[]; // 100.0% of documents
  notes: string; // 100.0% of documents
  scheduledTime: Record<string, any>; // 100.0% of documents
  status: string; // 100.0% of documents
  retryCount: number; // 100.0% of documents
  callMode: string; // 100.0% of documents
  automationId: Record<string, any>; // 100.0% of documents
  referenceDate: Record<string, any>; // 100.0% of documents
  contactData: Record<string, any>; // 100.0% of documents
  createdAt: Record<string, any>; // 100.0% of documents
  updatedAt: Record<string, any>; // 100.0% of documents
  __v: number; // 100.0% of documents
  errorMessage: string; // 100.0% of documents
  callId?: Record<string, any>; // 35.0% of documents
  sessionId?: string; // 35.0% of documents
  twilioCallSid?: string; // 25.0% of documents
}

export interface Groups {
  _id: Record<string, any>; // 100.0% of documents
  userId: Record<string, any>; // 100.0% of documents
  name: string; // 100.0% of documents
  description: string; // 100.0% of documents
  calls: Record<string, any>[]; // 100.0% of documents
  color: string; // 100.0% of documents
  isActive: boolean; // 100.0% of documents
  metadata: Record<string, any>; // 100.0% of documents
  createdAt: Record<string, any>; // 100.0% of documents
  updatedAt: Record<string, any>; // 100.0% of documents
  __v: number; // 100.0% of documents
}

export interface Recordings {
  _id: Record<string, any>; // 100.0% of documents
  name: string; // 100.0% of documents
  filePath: string; // 100.0% of documents
  duration: number; // 100.0% of documents
  userId: Record<string, any>; // 100.0% of documents
  signedUrl?: null; // 43.8% of documents
  createdAt: Record<string, any>; // 100.0% of documents
  isAIVoice?: boolean; // 56.3% of documents
  originalText?: string; // 56.3% of documents
  professionalPrompt?: string; // 6.3% of documents
  voiceSettings?: Record<string, any>; // 56.3% of documents
}

export interface Feedback {
  _id: Record<string, any>; // 100.0% of documents
  category: string; // 100.0% of documents
  feedback: string; // 100.0% of documents
  timestamp: Record<string, any>; // 100.0% of documents
  user: Record<string, any>; // 100.0% of documents
}

export interface Users {
  _id: Record<string, any>; // 100.0% of documents
  phoneNumber?: string; // 22.2% of documents
  isPhoneVerified?: boolean; // 22.2% of documents
  profile?: Record<string, any>; // 22.2% of documents
  preferences?: Record<string, any>; // 22.2% of documents
  aiConfig?: Record<string, any>; // 22.2% of documents
  twilioConfig?: Record<string, any>; // 22.2% of documents
  subscription?: Record<string, any>; // 22.2% of documents
  usage?: Record<string, any>; // 22.2% of documents
  settings?: Record<string, any>; // 22.2% of documents
  createdAt: Record<string, any>; // 100.0% of documents
  updatedAt?: Record<string, any>; // 55.6% of documents
  __v?: number; // 22.2% of documents
  smsVerification?: Record<string, any>; // 22.2% of documents
  freeMinutes: number; // 100.0% of documents
  name?: string; // 77.8% of documents
  email?: string; // 77.8% of documents
  password?: string; // 77.8% of documents
  timezone?: string; // 77.8% of documents
  hasActiveSubscription?: boolean; // 77.8% of documents
  preferredCallerID?: string; // 77.8% of documents
  freeCalls?: number; // 22.2% of documents
  stripeCustomerId?: string | null; // 77.8% of documents
  subscriptionStatus?: string; // 11.1% of documents
  stripePriceId?: string; // 11.1% of documents
  stripeSubscriptionId?: string; // 11.1% of documents
  stripeSubscriptionItemId?: string; // 11.1% of documents
}

export interface Automations {
  _id: Record<string, any>; // 100.0% of documents
  userId: Record<string, any>; // 100.0% of documents
  name: string; // 100.0% of documents
  description: string; // 100.0% of documents
  triggerType?: string; // 50.0% of documents
  offsetDays?: number; // 50.0% of documents
  offsetDirection?: string; // 50.0% of documents
  onDate?: string; // 50.0% of documents
  onTime?: string; // 50.0% of documents
  aiInstructions?: string; // 50.0% of documents
  callbackEnabled?: boolean; // 50.0% of documents
  callbackDelay?: string; // 50.0% of documents
  callbackCustomDay?: string; // 50.0% of documents
  isActive: boolean; // 100.0% of documents
  contactsCount?: number; // 50.0% of documents
  completedCount?: number; // 50.0% of documents
  pendingCount?: number; // 50.0% of documents
  executionHistory?: Record<string, any>[]; // 50.0% of documents
  createdAt: Record<string, any>; // 100.0% of documents
  updatedAt: Record<string, any>; // 100.0% of documents
  nextRun?: Record<string, any>; // 50.0% of documents
  __v?: number; // 50.0% of documents
  lastRun?: Record<string, any>; // 33.3% of documents
  daysOffset: number; // 100.0% of documents
  fixedDate: null | string; // 100.0% of documents
  timeOfDay: string; // 100.0% of documents
  timezone: string; // 100.0% of documents
  timingMode: string; // 100.0% of documents
  voiceAudioUrl?: string; // 33.3% of documents
  audioMessage?: string; // 50.0% of documents
  scheduledFor?: null; // 50.0% of documents
  useAIVoice?: boolean; // 50.0% of documents
  aiVoiceText?: null | string; // 50.0% of documents
  aiVoiceSettings?: null; // 50.0% of documents
  useAIResponse?: boolean; // 50.0% of documents
  contacts?: Record<string, any>[]; // 50.0% of documents
  enableCallback?: boolean; // 33.3% of documents
  callbackDelayMinutes?: number; // 33.3% of documents
  callbackMaxDelayDays?: number; // 16.7% of documents
  callbackTimeOfDay?: string; // 33.3% of documents
}

export interface Contacts {
  _id: Record<string, any>; // 100.0% of documents
  userId: Record<string, any>; // 100.0% of documents
  name: string; // 100.0% of documents
  phoneNumber: string; // 100.0% of documents
  email: string; // 100.0% of documents
  groups: any[]; // 100.0% of documents
  tags: any[]; // 100.0% of documents
  metadata: Record<string, any>; // 100.0% of documents
  isActive: boolean; // 100.0% of documents
  createdAt: Record<string, any>; // 100.0% of documents
  updatedAt: Record<string, any>; // 100.0% of documents
  __v: number; // 100.0% of documents
}

export interface Subscriptions {
  _id: Record<string, any>; // 100.0% of documents
  userId: Record<string, any>; // 100.0% of documents
  plan?: string; // 33.3% of documents
  status: string; // 100.0% of documents
  productId?: null; // 33.3% of documents
  transactionId?: null; // 33.3% of documents
  originalTransactionId?: null; // 33.3% of documents
  receiptData?: null; // 33.3% of documents
  endDate?: null; // 33.3% of documents
  renewalDate?: null; // 33.3% of documents
  callsUsedThisPeriod?: number; // 33.3% of documents
  callLimit?: number; // 33.3% of documents
  lastReceiptValidation?: null; // 33.3% of documents
  validationStatus?: string; // 33.3% of documents
  startDate?: Record<string, any>; // 33.3% of documents
  currentPeriodStart?: Record<string, any>; // 33.3% of documents
  currentPeriodEnd?: Record<string, any>; // 33.3% of documents
  createdAt: Record<string, any>; // 100.0% of documents
  updatedAt: Record<string, any>; // 100.0% of documents
  __v?: number; // 33.3% of documents
  stripeCustomerId?: string; // 66.7% of documents
  stripePriceId?: string; // 66.7% of documents
  stripeSubscriptionId?: string; // 66.7% of documents
  stripeSubscriptionItemId?: string; // 33.3% of documents
}

export interface Usage {
  _id: Record<string, any>; // 100.0% of documents
  customerId: null | string; // 100.0% of documents
  minutesUsed: number; // 100.0% of documents
  resetDate: Record<string, any>; // 100.0% of documents
  createdAt: Record<string, any>; // 100.0% of documents
  updatedAt: Record<string, any>; // 100.0% of documents
}

export interface Contactlists {
  _id: Record<string, any>; // 100.0% of documents
  userId: Record<string, any>; // 100.0% of documents
  name: string; // 100.0% of documents
  description: string; // 100.0% of documents
  color: string; // 100.0% of documents
  contacts: Record<string, any>[]; // 100.0% of documents
  contactsCount: number; // 100.0% of documents
  isSystem: boolean; // 100.0% of documents
  settings: Record<string, any>; // 100.0% of documents
  metadata: Record<string, any>; // 100.0% of documents
  createdAt: Record<string, any>; // 100.0% of documents
  updatedAt: Record<string, any>; // 100.0% of documents
  __v: number; // 100.0% of documents
}

