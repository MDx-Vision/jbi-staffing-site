# Microsoft Backend Setup — JBISOFTWARE Staffing Site

Two things to set up:
1. **Power Automate** — receives form submissions, emails Billy, posts to Teams, logs to SharePoint
2. **Microsoft Bookings** — calendar booking link embedded on the contact page

---

## Part 1 — Power Automate: Contact Form Flow

### What this does
Every time someone submits the contact form at `/contact.html`, Power Automate:
- Sends a formatted email to `b.duc@jbisoftware.com`
- Posts a card to a Teams channel
- Logs the submission to a SharePoint Excel file

### Steps

**1. Create the flow**
1. Go to [make.powerautomate.com](https://make.powerautomate.com) and sign in with Billy's account
2. Click **+ Create** → **Instant cloud flow**
3. Name it: `JBI Contact Form`
4. Trigger: search for **"When an HTTP request is received"** → select it → click **Create**

**2. Configure the HTTP trigger**
1. In the trigger card, click **"Use sample payload to generate schema"**
2. Paste this JSON and click Done:

```json
{
  "name": "John Smith",
  "email": "john@hospital.org",
  "phone": "212-555-0100",
  "company": "Yale New Haven Health",
  "subject": "Epic Staffing",
  "message": "We need three Epic analysts for a go-live in Q3.",
  "form": "contact",
  "submitted_at": "2026-05-20T12:00:00.000Z"
}
```

**3. Add email notification**
1. Click **+ New step** → search **"Send an email (V2)"** → select the Outlook 365 version
2. Fill in:
   - **To:** `b.duc@jbisoftware.com`
   - **Subject:** `New Contact: ` then click dynamic content → **subject**, then ` from ` then **name**
   - **Body** (switch to HTML, paste this):

```html
<h2>New Contact Form Submission</h2>
<table>
  <tr><td><b>Name</b></td><td>@{triggerBody()?['name']}</td></tr>
  <tr><td><b>Email</b></td><td>@{triggerBody()?['email']}</td></tr>
  <tr><td><b>Phone</b></td><td>@{triggerBody()?['phone']}</td></tr>
  <tr><td><b>Company</b></td><td>@{triggerBody()?['company']}</td></tr>
  <tr><td><b>Subject</b></td><td>@{triggerBody()?['subject']}</td></tr>
  <tr><td><b>Submitted</b></td><td>@{triggerBody()?['submitted_at']}</td></tr>
</table>
<hr/>
<p><b>Message:</b></p>
<p>@{triggerBody()?['message']}</p>
```

**4. Add Teams notification**
1. Click **+ New step** → search **"Post a message in a chat or channel"** → select Teams version
2. Fill in:
   - **Post as:** Flow bot
   - **Post in:** Channel
   - **Team:** select JBI's team
   - **Channel:** select the relevant channel (e.g. "Leads" or "General")
   - **Message:** 
     ```
     📋 New contact from @{triggerBody()?['name']} (@{triggerBody()?['company']})
     Subject: @{triggerBody()?['subject']}
     Email: @{triggerBody()?['email']}
     ```

**5. Add SharePoint log** *(optional but recommended)*
1. Make sure a SharePoint Excel file exists at a known location (e.g. `Sites/JBI/Shared Documents/Leads.xlsx`) with columns: `Date`, `Name`, `Email`, `Phone`, `Company`, `Subject`, `Message`
2. Click **+ New step** → search **"Add a row into a table"** (Excel Online Business)
3. Connect to the file and map each column to the matching dynamic content field

**6. Save and get the URL**
1. Click **Save** (top right)
2. Click back on the **"When an HTTP request is received"** trigger card
3. Copy the **HTTP POST URL** — it looks like:
   ```
   https://prod-xx.westus.logic.azure.com:443/workflows/abc123.../triggers/manual/paths/invoke?api-version=2016-06-01&sp=...
   ```
4. Open `contact.html` in a text editor, find line:
   ```javascript
   const CONTACT_WEBHOOK = 'YOUR_POWER_AUTOMATE_CONTACT_URL_HERE';
   ```
5. Replace `YOUR_POWER_AUTOMATE_CONTACT_URL_HERE` with the URL you copied

---

## Part 2 — Power Automate: Intake Form Flow

Repeat exactly the same steps above, but:
- Name: `JBI Intake Form`
- Sample payload — paste this instead:

```json
{
  "firstName": "Sarah",
  "lastName": "Chen",
  "email": "s.chen@hospital.org",
  "phone": "212-555-0200",
  "specialty": "Epic Ambulatory",
  "experience": "5+ years",
  "availability": "2026-07-01",
  "certifications": "Epic Ambulatory, Epic Tapestry",
  "form": "intake",
  "submitted_at": "2026-05-20T12:00:00.000Z"
}
```

- Email subject: `New Intake: ` + **firstName** + ` ` + **lastName**
- After saving, copy the URL and replace `YOUR_POWER_AUTOMATE_URL_HERE` in `intake.html`

---

## Part 3 — Microsoft Bookings: Calendar Link

### What this does
Adds a "Schedule a Consultation" booking link to the contact page and the epic/about CTAs — visitors can book directly into Billy's calendar.

### Steps

**1. Create a Bookings page**
1. Go to [outlook.office.com/bookings](https://outlook.office.com/bookings)
2. Click **Get it now** (first time) → name the business: `JBISOFTWARE`
3. Click **+ New booking page** or use the default one created
4. Set up:
   - **Business name:** JBISOFTWARE
   - **Business type:** Professional Services
   - **Logo:** upload the JBI logo

**2. Create a service: "Schedule a Consultation"**
1. Go to **Services** → **+ Add service**
2. Fill in:
   - **Name:** Schedule a Consultation
   - **Duration:** 30 minutes
   - **Buffer time:** 15 minutes after
   - **Staff:** assign Billy (b.duc@jbisoftware.com)
3. Save

**3. Get your booking link**
1. Go to **Booking page** → **Publish**
2. Copy the link — it looks like:
   `https://outlook.office365.com/owa/calendar/JBISOFTWARE@jbisoftware.com/bookings/`

**4. Add the link to the website**
Open `contact.html` and find the section that says `<!-- BOOKINGS_LINK_PLACEHOLDER -->` and replace it with a button pointing to your booking URL.

Or just send me the URL and I'll embed it properly with the right button style.

---

## Quick Checklist

- [ ] Part 1 done — Contact flow created, URL pasted into `contact.html`
- [ ] Part 2 done — Intake flow created, URL pasted into `intake.html`
- [ ] Test: submit the contact form on the live site, confirm email arrives and Teams card appears
- [ ] Part 3 done — Bookings page published, link embedded
- [ ] Commit and push final URLs to GitHub Pages

---

## Testing a Flow

After pasting the URL, submit a test from the live site (or localhost).
If no email arrives within 2 minutes:
1. Go to Power Automate → **My flows** → click the flow → **28-day run history**
2. Look for a failed run — click it to see which step errored
3. Most common issues: Outlook connector not authenticated, Teams channel permissions

