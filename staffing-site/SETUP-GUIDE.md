# JBI Staffing Site — Power Automate Form Setup Guide

This guide walks you through connecting the Contact and Intake forms on your website to your Microsoft 365 email using Power Automate. No coding required — just copy and paste.

---

## What You Need

- A Microsoft 365 account (you already have this)
- Access to Power Automate (included with your M365 license)
- About 15 minutes

---

## Overview

When someone submits a form on your website:

1. The form sends the data to Power Automate
2. Power Automate formats it into a nice email
3. The email arrives in your Outlook inbox

You need to create **two flows** — one for the Contact form, one for the Intake (candidate application) form.

---

## PART 1: Contact Form Flow

### Step 1: Open Power Automate

1. Go to **https://make.powerautomate.com**
2. Sign in with your Microsoft 365 account
3. Click **"+ Create"** in the left sidebar
4. Select **"Instant cloud flow"**
5. Name it: **"JBI Website - Contact Form"**
6. Under "Choose how to trigger this flow", select **"When an HTTP request is received"**
7. Click **"Create"**

### Step 2: Configure the Trigger

1. Click on the **"When an HTTP request is received"** trigger box
2. In the **"Request Body JSON Schema"** field, paste this exactly:

```json
{
  "type": "object",
  "properties": {
    "name":         { "type": "string" },
    "email":        { "type": "string" },
    "phone":        { "type": "string" },
    "company":      { "type": "string" },
    "subject":      { "type": "string" },
    "message":      { "type": "string" },
    "form":         { "type": "string" },
    "submitted_at": { "type": "string" }
  }
}
```

3. Leave "Method" as **POST**

### Step 3: Add the Email Action

1. Click **"+ New step"**
2. Search for **"Send an email (V2)"** — select the one from **Office 365 Outlook**
3. Fill in the fields:

| Field | Value |
|-------|-------|
| **To** | `info@jbisoftware.com` (or whatever email you want) |
| **Subject** | Click in the field, then select from Dynamic Content: `New Contact Form: ` then add the **subject** field, then ` from ` then add the **name** field |
| **Body** | See below |

4. For the **Body**, switch to HTML mode (click the `</>` icon) and paste:

```html
<h2>New Contact Form Submission</h2>
<table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;">
  <tr style="background:#0B213F;color:white;">
    <td style="padding:12px;font-weight:bold;" colspan="2">Contact Details</td>
  </tr>
  <tr>
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;width:120px;">Name</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['name']}</td>
  </tr>
  <tr style="background:#f9f9f9;">
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Email</td>
    <td style="padding:8px 12px;border:1px solid #ddd;"><a href="mailto:@{triggerBody()?['email']}">@{triggerBody()?['email']}</a></td>
  </tr>
  <tr>
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Phone</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['phone']}</td>
  </tr>
  <tr style="background:#f9f9f9;">
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Company</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['company']}</td>
  </tr>
  <tr>
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Subject</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['subject']}</td>
  </tr>
  <tr style="background:#f9f9f9;">
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Message</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['message']}</td>
  </tr>
  <tr>
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Submitted</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['submitted_at']}</td>
  </tr>
</table>
<br>
<p style="color:#666;font-size:12px;">This email was sent automatically from the JBI Staffing website contact form.</p>
```

### Step 4: Save and Copy the URL

1. Click **"Save"** at the top
2. Go back to the **"When an HTTP request is received"** trigger
3. You'll now see a **"HTTP POST URL"** — it looks like:
   `https://prod-XX.westus.logic.azure.com:443/workflows/...`
4. **Copy this entire URL** — you'll need it in the final step

---

## PART 2: Intake (Candidate Application) Form Flow

### Step 1: Create a New Flow

1. Go back to **https://make.powerautomate.com**
2. Click **"+ Create"** > **"Instant cloud flow"**
3. Name it: **"JBI Website - Candidate Application"**
4. Trigger: **"When an HTTP request is received"**
5. Click **"Create"**

### Step 2: Configure the Trigger

Paste this JSON schema:

```json
{
  "type": "object",
  "properties": {
    "firstName":      { "type": "string" },
    "lastName":       { "type": "string" },
    "email":          { "type": "string" },
    "phone":          { "type": "string" },
    "address":        { "type": "string" },
    "city":           { "type": "string" },
    "state":          { "type": "string" },
    "zip":            { "type": "string" },
    "position":       { "type": "string" },
    "availability":   { "type": "string" },
    "salary":         { "type": "string" },
    "skills":         { "type": "string" },
    "experience":     { "type": "string" },
    "certifications": { "type": "string" },
    "education":      { "type": "string" },
    "references":     { "type": "string" },
    "notes":          { "type": "string" },
    "form":           { "type": "string" },
    "submitted_at":   { "type": "string" }
  }
}
```

### Step 3: Add the Email Action

1. Click **"+ New step"**
2. Search for **"Send an email (V2)"** — Office 365 Outlook
3. Fill in:

| Field | Value |
|-------|-------|
| **To** | `info@jbisoftware.com` |
| **Subject** | `New Candidate Application: ` + **firstName** + ` ` + **lastName** |
| **Body** | See below (switch to HTML mode) |

```html
<h2>New Candidate Application</h2>
<table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;">
  <tr style="background:#0B213F;color:white;">
    <td style="padding:12px;font-weight:bold;" colspan="2">Personal Information</td>
  </tr>
  <tr>
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;width:140px;">Name</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['firstName']} @{triggerBody()?['lastName']}</td>
  </tr>
  <tr style="background:#f9f9f9;">
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Email</td>
    <td style="padding:8px 12px;border:1px solid #ddd;"><a href="mailto:@{triggerBody()?['email']}">@{triggerBody()?['email']}</a></td>
  </tr>
  <tr>
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Phone</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['phone']}</td>
  </tr>
  <tr style="background:#f9f9f9;">
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Address</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['address']}, @{triggerBody()?['city']}, @{triggerBody()?['state']} @{triggerBody()?['zip']}</td>
  </tr>
  <tr style="background:#0B213F;color:white;">
    <td style="padding:12px;font-weight:bold;" colspan="2">Position Details</td>
  </tr>
  <tr>
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Position</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['position']}</td>
  </tr>
  <tr style="background:#f9f9f9;">
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Availability</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['availability']}</td>
  </tr>
  <tr>
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Salary Range</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['salary']}</td>
  </tr>
  <tr style="background:#0B213F;color:white;">
    <td style="padding:12px;font-weight:bold;" colspan="2">Qualifications</td>
  </tr>
  <tr>
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Skills</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['skills']}</td>
  </tr>
  <tr style="background:#f9f9f9;">
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Experience</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['experience']}</td>
  </tr>
  <tr>
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Certifications</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['certifications']}</td>
  </tr>
  <tr style="background:#f9f9f9;">
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Education</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['education']}</td>
  </tr>
  <tr>
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">References</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['references']}</td>
  </tr>
  <tr style="background:#f9f9f9;">
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Notes</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['notes']}</td>
  </tr>
  <tr>
    <td style="padding:8px 12px;border:1px solid #ddd;font-weight:bold;">Submitted</td>
    <td style="padding:8px 12px;border:1px solid #ddd;">@{triggerBody()?['submitted_at']}</td>
  </tr>
</table>
<br>
<p style="color:#666;font-size:12px;">This email was sent automatically from the JBI Staffing website intake form.</p>
```

### Step 4: Save and Copy the URL

Same as before — save, then copy the HTTP POST URL.

---

## PART 3: Add the URLs to Your Website

You have two options:

### Option A: Edit on GitHub (easiest)

1. Go to **https://github.com/MDx-Vision/jbi-staffing-site**
2. Open **`staffing-site/contact.html`**
3. Click the pencil icon (Edit)
4. Find this line (around line 248):
   ```
   const CONTACT_WEBHOOK = 'YOUR_POWER_AUTOMATE_URL_HERE';
   ```
5. Replace `YOUR_POWER_AUTOMATE_URL_HERE` with the URL you copied from Flow #1
6. Click **"Commit changes"**
7. Do the same for **`staffing-site/intake.html`** — find:
   ```
   const INTAKE_WEBHOOK = 'YOUR_POWER_AUTOMATE_URL_HERE';
   ```
8. Replace with the URL from Flow #2
9. Commit changes

The website will auto-deploy in about 30 seconds after each commit.

### Option B: Send me the URLs

Just send Rafael the two Power Automate URLs and he'll plug them in.

---

## PART 4: Test It

1. Go to your live site's Contact page
2. Fill out the form with test data
3. Click "Send Message"
4. Check your Outlook inbox — you should see a formatted email within 30 seconds

Repeat for the Intake/Application form.

---

## Optional: Add Auto-Reply to Candidates

If you want candidates to get an automatic confirmation email after applying:

1. Open the **Candidate Application** flow
2. After the "Send email" step, click **"+ New step"**
3. Add another **"Send an email (V2)"**
4. Set **To** = the **email** dynamic content (the candidate's email)
5. Set **Subject** = `Thank you for your application — JBI Software`
6. Set **Body** to a friendly confirmation message
7. Save

---

## Optional: Log to Excel/SharePoint

Want a spreadsheet of all submissions?

1. In either flow, after the email step, click **"+ New step"**
2. Search for **"Add a row into a table"** (Excel Online)
3. Point it to an Excel file in your OneDrive or SharePoint
4. Map the columns to the form fields

This gives you a running log of every form submission alongside the email notifications.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Form submits but no email arrives | Check the flow's "Run history" in Power Automate for errors |
| "Flow is turned off" | Go to the flow and click "Turn on" |
| Email goes to spam | Add `noreply@jbisoftware.com` to your safe senders |
| Form shows error on website | Check browser console (F12) for network errors — the webhook URL may be wrong |

---

## Summary

| Form | Flow Name | What It Does |
|------|-----------|-------------|
| Contact | JBI Website - Contact Form | Sends inquiry email to info@jbisoftware.com |
| Intake | JBI Website - Candidate Application | Sends candidate details to info@jbisoftware.com |

Both flows are free on your existing M365 license. No extra subscriptions needed.
