# Database Schema Documentation

Generated on: 2025-09-21T21:36:48.586Z

## Collections Overview

### verifiedNumbers
- **Total Documents**: 7
- **Sample Size**: 7
- **Fields**: 6
- **Indexes**: _id_

#### Fields

| Field | Type | Required | Frequency | Examples |
|-------|------|----------|-----------|----------|
| _id | object | ✅ | 100.0% | [object] |
| userId | object | ✅ | 100.0% | [object] |
| phoneNumber | string | ✅ | 100.0% | +14845712062, +16105291544 |
| verified | boolean | ✅ | 100.0% | true |
| createdAt | object | ✅ | 100.0% | [object] |
| updatedAt | object | ✅ | 100.0% | [object] |

### calls
- **Total Documents**: 1395
- **Sample Size**: 100
- **Fields**: 18
- **Indexes**: _id_, automationId_1_createdAt_-1, userId_1_automationId_1, sessionId_1, automationId_1, analysis.category_1, analysis.followUpNeeded_1, userId_1_createdAt_-1, twilioCallSid_1, status_1, userId_1_status_1, elevenLabsData.conversation_id_1, isInbound_1_createdAt_-1, participants.phoneNumber_1, callerNumber_1, from_1, analysis.category_1_createdAt_-1, userId_1_analysis.followUpNeeded_1, userId_1_analysis.category_1_createdAt_-1

#### Fields

| Field | Type | Required | Frequency | Examples |
|-------|------|----------|-----------|----------|
| _id | object | ✅ | 100.0% | [object] |
| userId | object | ✅ | 100.0% | [object] |
| sessionId | string | ✅ | 100.0% | c6b4fa6e-c052-40c0-8062-968c74030016, 4e9bba35-ffd5-46e6-b104-ef826f045769 |
| status | string | ✅ | 100.0% | initiated, completed |
| callMode | string | ✅ | 100.0% | ai-only |
| participants | array | ✅ | 100.0% | [1 items] |
| transcription | array | ✅ | 100.0% | [0 items], [3 items] |
| aiConfig | object | ✅ | 100.0% | [object] |
| startedAt | object | ✅ | 100.0% | [object] |
| isInbound | boolean | ✅ | 100.0% | false |
| inboundData | object | ✅ | 100.0% | [object] |
| createdAt | object | ✅ | 100.0% | [object] |
| updatedAt | object | ✅ | 100.0% | [object] |
| __v | number | ✅ | 100.0% | 0 |
| twilioCallSid | string | ❌ | 29.0% | CA1e62f1323a930c7d32480048ae5fda4b, CA9bbe123036c1c4fd4f8ffdeac56529a6 |
| endedAt | object | ❌ | 29.0% | [object] |
| metrics | object | ❌ | 29.0% | [object] |
| analysis | object | ❌ | 94.0% | [object] |

### scheduledcalls
- **Total Documents**: 252
- **Sample Size**: 100
- **Fields**: 18
- **Indexes**: _id_, automationId_1_status_1, userId_1_automationId_1, automationId_1, scheduledTime_1_status_1, userId_1_status_1, createdAt_1

#### Fields

| Field | Type | Required | Frequency | Examples |
|-------|------|----------|-----------|----------|
| _id | object | ✅ | 100.0% | [object] |
| userId | object | ✅ | 100.0% | [object] |
| recipients | array | ✅ | 100.0% | [1 items] |
| notes | string | ✅ | 100.0% | ee, say her |
| scheduledTime | object | ✅ | 100.0% | [object] |
| status | string | ✅ | 100.0% | processing |
| retryCount | number | ✅ | 100.0% | 1 |
| callMode | string | ✅ | 100.0% | ai-only |
| automationId | object | ✅ | 100.0% | [object] |
| referenceDate | null | object | ✅ | 100.0% | [object] |
| contactData | object | ✅ | 100.0% | [object] |
| createdAt | object | ✅ | 100.0% | [object] |
| updatedAt | object | ✅ | 100.0% | [object] |
| __v | number | ✅ | 100.0% | 0 |
| errorMessage | string | ✅ | 100.0% | Caller ID is required. Please add and verify a caller ID before making calls., ScheduledCall validation failed: scheduledTime: Scheduled time must be in the future for manual calls |
| callId | object | ❌ | 35.0% | [object] |
| sessionId | string | ❌ | 35.0% | 35ac4c04-2047-49ed-8bb3-a2e86e8cd21e, 4199795e-7fcd-42ab-88bb-7962d1a96867 |
| twilioCallSid | string | ❌ | 25.0% | CAa90f638a4e58cf3c4b3f27960cf3bfff, CA775441b8dc3735260b3c38649925825f |

### groups
- **Total Documents**: 5
- **Sample Size**: 5
- **Fields**: 11
- **Indexes**: _id_

#### Fields

| Field | Type | Required | Frequency | Examples |
|-------|------|----------|-----------|----------|
| _id | object | ✅ | 100.0% | [object] |
| userId | object | ✅ | 100.0% | [object] |
| name | string | ✅ | 100.0% | test, tsan |
| description | string | ✅ | 100.0% |  |
| calls | array | ✅ | 100.0% | [1 items], [0 items] |
| color | string | ✅ | 100.0% | #3b82f6 |
| isActive | boolean | ✅ | 100.0% | true |
| metadata | object | ✅ | 100.0% | [object] |
| createdAt | object | ✅ | 100.0% | [object] |
| updatedAt | object | ✅ | 100.0% | [object] |
| __v | number | ✅ | 100.0% | 1, 0 |

### recordings
- **Total Documents**: 16
- **Sample Size**: 16
- **Fields**: 11
- **Indexes**: _id_

#### Fields

| Field | Type | Required | Frequency | Examples |
|-------|------|----------|-----------|----------|
| _id | object | ✅ | 100.0% | [object] |
| name | string | ✅ | 100.0% | test 1, recording 9_17_2025_ 5_45_10 pm |
| filePath | string | ✅ | 100.0% | gs://heyway-voice-recordings/recording-1758130558380.mp3, gs://heyway-voice-recordings/recording-1758145528518.mp3 |
| duration | number | ✅ | 100.0% | 6, 17 |
| userId | object | ✅ | 100.0% | [object] |
| signedUrl | null | ❌ | 43.8% |  |
| createdAt | object | ✅ | 100.0% | [object] |
| isAIVoice | boolean | ❌ | 56.3% | true |
| originalText | string | ❌ | 56.3% | test, hey its randy |
| professionalPrompt | string | ❌ | 6.3% | You are a professional AI assistant for a business calling system. Your role is to respond professionally and helpfully to callers after they hear a recorded message.

CONTEXT: automation
ORIGINAL MESSAGE: "test"

INSTRUCTIONS:
- Always respond professionally and courteously
- Be helpful and informative
- Keep responses concise but complete
- Use a warm but professional tone
- If you don't have specific information, offer to connect them with the right person
- Always end with a clear next step or call to action
- Maintain a business-appropriate demeanor at all times

RESPONSE GUIDELINES:
- Greet the caller professionally
- Acknowledge their interest or concern
- Provide helpful information or next steps
- Offer to connect them with the appropriate team member if needed
- End with a clear call to action

Remember: You represent a professional business, so maintain high standards of communication and helpfulness. |
| voiceSettings | object | null | ❌ | 56.3% | [object] |

### feedback
- **Total Documents**: 2
- **Sample Size**: 2
- **Fields**: 5
- **Indexes**: _id_

#### Fields

| Field | Type | Required | Frequency | Examples |
|-------|------|----------|-----------|----------|
| _id | object | ✅ | 100.0% | [object] |
| category | string | ✅ | 100.0% | bug, general |
| feedback | string | ✅ | 100.0% | test , test |
| timestamp | object | ✅ | 100.0% | [object] |
| user | object | ✅ | 100.0% | [object] |

### users
- **Total Documents**: 9
- **Sample Size**: 9
- **Fields**: 27
- **Indexes**: _id_, email_1, twilioConfig.verifiedCallerIds.phoneNumber_1_twilioConfig.verifiedCallerIds.verified_1, phoneNumber_1_sparse

#### Fields

| Field | Type | Required | Frequency | Examples |
|-------|------|----------|-----------|----------|
| _id | object | ✅ | 100.0% | [object] |
| phoneNumber | string | ❌ | 22.2% | +14845712062, +16105291544 |
| isPhoneVerified | boolean | ❌ | 22.2% | true |
| profile | object | ❌ | 22.2% | [object] |
| preferences | object | ❌ | 22.2% | [object] |
| aiConfig | object | ❌ | 22.2% | [object] |
| twilioConfig | object | ❌ | 22.2% | [object] |
| subscription | object | ❌ | 22.2% | [object] |
| usage | object | ❌ | 22.2% | [object] |
| settings | object | ❌ | 22.2% | [object] |
| createdAt | object | ✅ | 100.0% | [object] |
| updatedAt | object | ❌ | 55.6% | [object] |
| __v | number | ❌ | 22.2% | 1, 0 |
| smsVerification | object | ❌ | 22.2% | [object] |
| freeMinutes | number | ✅ | 100.0% | 238, 0 |
| name | string | ❌ | 77.8% | Adam Chain, Mike bernicker |
| email | string | ❌ | 77.8% | achain123@gmail.com, ADAM@GETCARMATE.COM |
| password | string | ❌ | 77.8% | $2b$10$ewd0OP8vkTJ68ZNRCq3e5uJuUZY.UEikN7Ru5XYGlffccqetcJu2., $2b$10$rM6kWu8sRIzeoHm25gcdMu7cNH4vm8Cr/DwYTLR9GAUYcVMC1l.Ye |
| timezone | string | ❌ | 77.8% | America/New_York |
| hasActiveSubscription | boolean | ❌ | 77.8% | true, false |
| preferredCallerID | string | ❌ | 77.8% | +16109552420,  |
| freeCalls | number | ❌ | 22.2% | 3, 0 |
| stripeCustomerId | string | null | ❌ | 77.8% | cus_T5VS2a8giGV1As, cus_T5jllSZ7pIHhk8 |
| subscriptionStatus | string | ❌ | 11.1% | active |
| stripePriceId | string | ❌ | 11.1% | price_1RNyq2KgPZjMtkgjvrZQdFy3 |
| stripeSubscriptionId | string | ❌ | 11.1% | sub_1S9KRtKgPZjMtkgj7wK9b05w |
| stripeSubscriptionItemId | string | ❌ | 11.1% | si_T5VSROwRG8rfYy |

### automations
- **Total Documents**: 6
- **Sample Size**: 6
- **Fields**: 40
- **Indexes**: _id_, userId_1, userId_1_isActive_1, userId_1_nextRun_1, isActive_1_nextRun_1

#### Fields

| Field | Type | Required | Frequency | Examples |
|-------|------|----------|-----------|----------|
| _id | object | ✅ | 100.0% | [object] |
| userId | object | ✅ | 100.0% | [object] |
| name | string | ✅ | 100.0% | Test audio, test with voice |
| description | string | ✅ | 100.0% | , 8pm monday |
| triggerType | string | ❌ | 50.0% | on_date |
| offsetDays | number | ❌ | 50.0% | 0 |
| offsetDirection | string | ❌ | 50.0% | after |
| onDate | string | ❌ | 50.0% | 2025-09-15 |
| onTime | string | ❌ | 50.0% | 10:00, 18:00 |
| aiInstructions | string | ❌ | 50.0% | ask how the car loaner is going, hows the new car |
| callbackEnabled | boolean | ❌ | 50.0% | true, false |
| callbackDelay | string | ❌ | 50.0% | 15min, 2hr |
| callbackCustomDay | string | ❌ | 50.0% | today |
| isActive | boolean | ✅ | 100.0% | true, false |
| contactsCount | number | ❌ | 50.0% | 1, 2 |
| completedCount | number | ❌ | 50.0% | 0 |
| pendingCount | number | ❌ | 50.0% | 1, 0 |
| executionHistory | array | ❌ | 50.0% | [1 items], [2 items] |
| createdAt | object | ✅ | 100.0% | [object] |
| updatedAt | object | ✅ | 100.0% | [object] |
| nextRun | object | ❌ | 50.0% | [object] |
| __v | number | ❌ | 50.0% | 1, 2 |
| lastRun | object | ❌ | 33.3% | [object] |
| daysOffset | number | ✅ | 100.0% | 7 |
| fixedDate | null | string | ✅ | 100.0% | 2025-09-17T00:00:00.000-04:00, 2025-09-20T00:00:00.000-04:00 |
| timeOfDay | string | ✅ | 100.0% | 09:00, 18:12 |
| timezone | string | ✅ | 100.0% | America/New_York |
| timingMode | string | ✅ | 100.0% | after, on_date |
| voiceAudioUrl | string | ❌ | 33.3% | https://storage.googleapis.com/heyway-voice-recordings/recordings/68adcc5c260379b1fd9a2614/1346e549-2945-4fcd-a5db-74b976336563-1757973251867.webm, https://storage.googleapis.com/heyway-voice-recordings/recordings/68adcc5c260379b1fd9a2614/3f21d844-6fcb-4eae-87d0-430ea3cf9414-1757980071180.webm |
| audioMessage | string | ❌ | 50.0% | 68cb2bf86279c0b4f77b4057, 68ced68e7341987a3f337f9c |
| scheduledFor | null | ❌ | 50.0% |  |
| useAIVoice | boolean | ❌ | 50.0% | false |
| aiVoiceText | null | string | ❌ | 50.0% |  |
| aiVoiceSettings | null | ❌ | 50.0% |  |
| useAIResponse | boolean | ❌ | 50.0% | true |
| contacts | array | ❌ | 50.0% | [1 items] |
| enableCallback | boolean | ❌ | 33.3% | true |
| callbackDelayMinutes | number | ❌ | 33.3% | 30, 15 |
| callbackMaxDelayDays | number | ❌ | 16.7% | 7 |
| callbackTimeOfDay | string | ❌ | 33.3% | 09:00 |

### contacts
- **Total Documents**: 9265
- **Sample Size**: 100
- **Fields**: 12
- **Indexes**: _id_, userId_1_phoneNumber_1, userId_1_name_text_phoneNumber_text, userId_1_groups_1, userId_1_isActive_1

#### Fields

| Field | Type | Required | Frequency | Examples |
|-------|------|----------|-----------|----------|
| _id | object | ✅ | 100.0% | [object] |
| userId | object | ✅ | 100.0% | [object] |
| name | string | ✅ | 100.0% | Adam 2, Aaron Bdale |
| phoneNumber | string | ✅ | 100.0% | 4845712062, +12152061035 |
| email | string | ✅ | 100.0% | achain123@gmail.com,  |
| groups | array | ✅ | 100.0% | [0 items] |
| tags | array | ✅ | 100.0% | [0 items] |
| metadata | object | ✅ | 100.0% | [object] |
| isActive | boolean | ✅ | 100.0% | true |
| createdAt | object | ✅ | 100.0% | [object] |
| updatedAt | object | ✅ | 100.0% | [object] |
| __v | number | ✅ | 100.0% | 0 |

### subscriptions
- **Total Documents**: 3
- **Sample Size**: 3
- **Fields**: 24
- **Indexes**: _id_, userId_1, status_1, currentPeriodEnd_1

#### Fields

| Field | Type | Required | Frequency | Examples |
|-------|------|----------|-----------|----------|
| _id | object | ✅ | 100.0% | [object] |
| userId | object | ✅ | 100.0% | [object] |
| plan | string | ❌ | 33.3% | free |
| status | string | ✅ | 100.0% | active |
| productId | null | ❌ | 33.3% |  |
| transactionId | null | ❌ | 33.3% |  |
| originalTransactionId | null | ❌ | 33.3% |  |
| receiptData | null | ❌ | 33.3% |  |
| endDate | null | ❌ | 33.3% |  |
| renewalDate | null | ❌ | 33.3% |  |
| callsUsedThisPeriod | number | ❌ | 33.3% | 0 |
| callLimit | number | ❌ | 33.3% | 5 |
| lastReceiptValidation | null | ❌ | 33.3% |  |
| validationStatus | string | ❌ | 33.3% | pending |
| startDate | object | ❌ | 33.3% | [object] |
| currentPeriodStart | object | ❌ | 33.3% | [object] |
| currentPeriodEnd | object | ❌ | 33.3% | [object] |
| createdAt | object | ✅ | 100.0% | [object] |
| updatedAt | object | ✅ | 100.0% | [object] |
| __v | number | ❌ | 33.3% | 0 |
| stripeCustomerId | string | ❌ | 66.7% | cus_T5VS2a8giGV1As, cus_T5jllSZ7pIHhk8 |
| stripePriceId | string | ❌ | 66.7% | price_1RNyq2KgPZjMtkgjvrZQdFy3, price_1S9UfpKgPZjMtkgjPYzLw4ZG |
| stripeSubscriptionId | string | ❌ | 66.7% | sub_1S9KRtKgPZjMtkgj7wK9b05w, sub_1S9YHxKgPZjMtkgjaMHnKda9 |
| stripeSubscriptionItemId | string | ❌ | 33.3% | si_T5VSROwRG8rfYy |

### feedbacks
- **Status**: Empty collection

### usage
- **Total Documents**: 4
- **Sample Size**: 4
- **Fields**: 6
- **Indexes**: _id_

#### Fields

| Field | Type | Required | Frequency | Examples |
|-------|------|----------|-----------|----------|
| _id | object | ✅ | 100.0% | [object] |
| customerId | null | string | ✅ | 100.0% | cus_T5U6XauQS9JZqi, cus_T5jllSZ7pIHhk8 |
| minutesUsed | number | ✅ | 100.0% | 0, 1.1099999999999999 |
| resetDate | object | ✅ | 100.0% | [object] |
| createdAt | object | ✅ | 100.0% | [object] |
| updatedAt | object | ✅ | 100.0% | [object] |

### contactlists
- **Total Documents**: 204
- **Sample Size**: 100
- **Fields**: 13
- **Indexes**: _id_, userId_1, userId_1_name_1, userId_1_metadata.lastUsed_-1, contacts.contactId_1

#### Fields

| Field | Type | Required | Frequency | Examples |
|-------|------|----------|-----------|----------|
| _id | object | ✅ | 100.0% | [object] |
| userId | object | ✅ | 100.0% | [object] |
| name | string | ✅ | 100.0% | new list, ss |
| description | string | ✅ | 100.0% | , Contact list for automation: test call back |
| color | string | ✅ | 100.0% | blue, purple |
| contacts | array | ✅ | 100.0% | [1 items], [0 items] |
| contactsCount | number | ✅ | 100.0% | 1, 0 |
| isSystem | boolean | ✅ | 100.0% | false, true |
| settings | object | ✅ | 100.0% | [object] |
| metadata | object | ✅ | 100.0% | [object] |
| createdAt | object | ✅ | 100.0% | [object] |
| updatedAt | object | ✅ | 100.0% | [object] |
| __v | number | ✅ | 100.0% | 1, 0 |

