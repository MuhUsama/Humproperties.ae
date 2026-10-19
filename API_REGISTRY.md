# API & Third-Party Services Registry

This document tracks all external APIs and third-party services used in the Mohd. Alfalasi Real Estate website. Keeping this updated ensures the project remains easy to maintain as it grows.

---

## 1. FormSubmit.co (Contact Form)

**Purpose**: Handles background email submissions for the Contact Form without exposing email servers or needing SMTP setup.

**Location Used**: `src/app/page.tsx`

**Setup & Authentication**: 
- **Keys Required**: None
- **Activation**: One-Time Verification Only. The very first time this API is used, an activation email is sent to `info@mfreuae.com`. Once the owner clicks "Activate" on that single email, all future submissions are delivered instantly and automatically.

### Connection Details
- **URL Endpoint**: `https://formsubmit.co/ajax/info@mfreuae.com`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
  - `Accept: application/json`

### Payloads & Responses

**Request Payload (JSON):**
```json
{
  "Name": "String",
  "Email": "String",
  "Phone": "String",
  "Message": "String",
  "_subject": "String"
}
```

**Expected Success (200 OK):**
```json
{
  "success": "true",
  "message": "The form was submitted successfully."
}
```

**Expected Error (400 Bad Request):**
```json
{
  "success": "false",
  "message": "Configuration error."
}
```

---

*Note: Any future APIs (like Google Maps, Mailchimp, CRM integrations, etc.) will be appended as new sections below.*
