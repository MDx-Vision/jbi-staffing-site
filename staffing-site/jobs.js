// ============================================================
// JBI Job Board — Google Sheets Integration
// ============================================================
// SETUP INSTRUCTIONS:
// 1. Create a Google Sheet with these columns (Row 1 headers):
//    Title | Department | Location | Type | Description | Requirements | Posted | Active
//
// 2. Fill in jobs. Set "Active" column to "TRUE" or "FALSE".
//    Example row:
//    Epic Analyst | Healthcare IT | New York, NY | Contract | Full description... | - Epic certified\n- 3+ years... | 2026-03-20 | TRUE
//
// 3. Publish the sheet: File → Share → Publish to web → Sheet1 → CSV → Publish
//    Copy the URL and paste it below as SHEET_CSV_URL.
//
// 4. For the apply form, create a Google Apps Script:
//    See the APPS_SCRIPT_CODE comment at the bottom of this file.
//    Deploy it as a web app and paste the URL below as APPS_SCRIPT_URL.
// ============================================================

// ── CONFIG — Replace these with your actual URLs ──
const SHEET_CSV_URL = ''; // Your published Google Sheet CSV URL
const APPS_SCRIPT_URL = ''; // Your deployed Apps Script web app URL

// ── DEMO DATA (used when SHEET_CSV_URL is empty) ──
const DEMO_JOBS = [
    {
        title: 'Epic Ambulatory Analyst',
        department: 'Healthcare IT',
        location: 'New York, NY',
        type: 'Contract',
        description: 'Support Epic Ambulatory module configuration, build, and optimization for a large health system go-live. You\'ll work directly with clinical stakeholders to translate workflow requirements into Epic build, manage change requests, and support end-user training during activation.',
        requirements: '- Epic Ambulatory certification required\n- 3+ years of Epic implementation experience\n- Experience with at least one full go-live cycle\n- Strong communication skills for clinical stakeholder interaction',
        posted: '2026-03-15'
    },
    {
        title: 'Cloud Infrastructure Engineer',
        department: 'IT Staffing',
        location: 'Remote',
        type: 'Full-time',
        description: 'Design and manage cloud infrastructure across AWS and Azure for healthcare clients. Responsible for architecture decisions, security compliance, CI/CD pipelines, and ensuring 99.99% uptime for mission-critical health system applications.',
        requirements: '- 5+ years cloud infrastructure experience (AWS or Azure)\n- Experience with HIPAA-compliant environments\n- Strong Terraform/IaC background\n- Kubernetes and container orchestration',
        posted: '2026-03-10'
    },
    {
        title: 'Travel RN — Emergency Department',
        department: 'Clinical',
        location: 'Newark, NJ',
        type: 'Travel Contract',
        description: 'Looking for an experienced ER nurse for a 13-week travel assignment at a Level II trauma center. High-acuity environment, 36 hours/week with potential for overtime. Housing stipend and travel reimbursement included.',
        requirements: '- Active RN license (NJ or compact state)\n- 2+ years emergency department experience\n- BLS, ACLS, PALS certifications\n- Trauma center experience preferred',
        posted: '2026-03-18'
    },
    {
        title: 'Senior Full-Stack Developer',
        department: 'Software Development',
        location: 'New York, NY (Hybrid)',
        type: 'Full-time',
        description: 'Join our in-house development team building HIPAA-compliant healthcare applications. You\'ll own features end-to-end — from database design to React frontend — working on AI-powered tools, patient portals, and integration platforms.',
        requirements: '- 4+ years full-stack development (React + Node.js or Python)\n- Experience building HIPAA-compliant applications\n- Familiarity with HL7/FHIR integration standards\n- PostgreSQL or similar RDBMS experience',
        posted: '2026-03-20'
    },
    {
        title: 'Epic Radiant/Cupid Analyst',
        department: 'Healthcare IT',
        location: 'Boston, MA',
        type: 'Contract-to-Hire',
        description: 'Configure and optimize Epic Radiant and Cupid modules for a multi-site academic medical center. Partner with radiology and cardiology departments on workflow design, order management, and result routing. Support ongoing optimization post-go-live.',
        requirements: '- Epic Radiant or Cupid certification required\n- 2+ years in a clinical IT analyst role\n- Understanding of radiology/cardiology workflows\n- Experience with HL7 result interfaces a plus',
        posted: '2026-03-22'
    },
    {
        title: 'TWS Translation Specialist',
        department: 'TWS Translation',
        location: 'Remote',
        type: 'Part-time',
        description: 'Support our patented Translation Worldwide Solution platform by providing real-time interpretation services for healthcare facilities. Work remotely with hospitals and clinics across the country to ensure clear provider-patient communication.',
        requirements: '- Fluent in English and at least one additional language\n- Medical interpretation certification preferred\n- Experience in healthcare settings\n- Strong internet connection and quiet workspace',
        posted: '2026-03-12'
    },
    // ── Northwell Health Positions ──
    {
        title: 'Epic Prelude Lead',
        department: 'Healthcare IT',
        location: 'New York, NY (On-site)',
        type: 'Contract',
        description: 'Implements and supports scheduling and patient access workflows in the Cadence module for Northwell Health. Duties include template design, configuration of rules, and testing system functionality. On-site required 5/30 through 6/30.',
        requirements: '- Epic Cadence & Prelude certification required\n- Healthcare scheduling experience\n- Available for on-site work 5/30–6/30',
        posted: '2026-03-25'
    },
    {
        title: 'Principal Trainer — Epic Cadence/Prelude',
        department: 'Healthcare IT',
        location: 'Remote / On-site for Go-Live',
        type: 'Contract',
        description: 'Develops the EMR training curriculum, overall training strategy, and creates and maintains the training environment for Northwell Health. Responsible for administering the EMR credentialing program to end-user trainers and evaluating their ability to conduct training programs.',
        requirements: '- Epic Cadence & Prelude certification required\n- Experience developing EMR training curricula\n- On-site availability for go-live events',
        posted: '2026-03-25'
    },
    {
        title: 'Mobile Deployment Technician — Epic Wave 2',
        department: 'Healthcare IT',
        location: 'New York, NY (On-site)',
        type: 'Contract',
        description: 'Assist with Rover deployments for Epic Wave 2 at Northwell Health — deploying phones, docks for shared devices, and charging cabinet demonstrations. Provide first-line end user support for mobile device issues and hands-on support for device depot operations.',
        requirements: '- High School Diploma or equivalent required\n- 0–2 years of relevant experience\n- Basic familiarity with mobile devices (iOS, Android)\n- Ability to work on-site',
        posted: '2026-03-25'
    },
    {
        title: 'Epic Module Analyst',
        department: 'Healthcare IT',
        location: 'New York, NY',
        type: 'Contract',
        description: 'Specializes in a specific Epic module (e.g., Orders, Cadence, Ambulatory) for Northwell Health. Responsible for system configuration, workflow design, unit testing, and end-user support during implementation and optimization phases.',
        requirements: '- Epic module certification required\n- Analytical and problem-solving skills\n- Experience with system configuration and workflow design',
        posted: '2026-03-25'
    },
    {
        title: 'Epic Project Manager — IT Security',
        department: 'Healthcare IT',
        location: 'New York, NY (Hybrid)',
        type: 'Contract',
        description: 'Plan and implement security measures to protect computer systems, networks, and data for Northwell Health Epic environment. Assess risks, identify potential security breaches, prioritize security coverage, and ensure compliance with relevant information security laws and regulations.',
        requirements: '- Solid understanding of complex IT systems\n- Current knowledge of security standards, systems, and authentication protocols\n- Experience building secure, compliant IT environments\n- Epic experience preferred',
        posted: '2026-03-25'
    },
    {
        title: 'Epic Lumens Analyst',
        department: 'Healthcare IT',
        location: 'New York, NY',
        type: 'Contract',
        description: 'Implementation, optimization, and ongoing support of the Epic Lumens application for Northwell Health, ensuring it meets the needs of Endoscopy and Gastroenterology workflows. Works closely with clinical leadership, physicians, nursing staff, and operational stakeholders.',
        requirements: '- Epic Lumens certification or experience\n- Knowledge of endoscopy/gastroenterology workflows\n- Experience with procedural documentation and revenue cycle\n- System testing and validation experience',
        posted: '2026-03-25'
    },
    {
        title: 'Epic Prelude/Cadence Analyst',
        department: 'Healthcare IT',
        location: 'New York, NY',
        type: 'Contract',
        description: 'Configure and maintain Epic Prelude and Cadence modules to support new clinic builds and operational workflows at Northwell Health. Support Community Connect initiatives by providing technical expertise and configuration support for partner organizations.',
        requirements: '- Epic Prelude/Cadence certification required\n- Experience with department settings, provider templates, and work queues\n- Testing and quality assurance experience\n- Healthcare technology background',
        posted: '2026-03-25'
    },
    {
        title: 'Senior Project Manager — Epic Revenue Cycle',
        department: 'Healthcare IT',
        location: 'New York, NY (Hybrid)',
        type: 'Contract',
        description: 'Lead large, complex initiatives for Northwell Health, partnering with executives and cross-functional teams. Step into active leadership supporting Epic revenue-cycle applications and hospital billing workflows during multiple high-intensity go-live waves. Hybrid: 4 days on-site/month, full on-site mid-May through July and mid-October through year-end.',
        requirements: '- Epic HB certification required\n- Epic Dorothy, PB, and SBO certifications preferred\n- Extensive experience managing large, cross-functional initiatives\n- Mastery of MS Project, PowerPoint, and Excel\n- Available through 12/31/2026',
        posted: '2026-03-25'
    },
    // ── Internship Positions ──
    {
        title: 'IT Staffing Intern',
        department: 'Internship',
        location: 'New York, NY / Remote',
        type: 'Internship',
        description: 'Support the IT staffing team with candidate sourcing, screening, and coordination. Gain hands-on experience in technical recruiting, applicant tracking systems, and the staffing lifecycle in a fast-paced healthcare IT environment.',
        requirements: '- Currently enrolled in a relevant degree program\n- Strong communication and organizational skills\n- Interest in IT staffing and recruiting\n- Familiarity with Microsoft Office',
        posted: '2026-03-25'
    },
    {
        title: 'Healthcare IT Intern',
        department: 'Internship',
        location: 'New York, NY / Remote',
        type: 'Internship',
        description: 'Assist the healthcare IT team with EHR implementation support, documentation, and project coordination. Learn about Epic, Cerner, and other healthcare information systems while contributing to real client engagements.',
        requirements: '- Currently enrolled in Health Informatics, IT, or related program\n- Interest in healthcare technology\n- Detail-oriented with strong writing skills\n- Basic understanding of healthcare workflows a plus',
        posted: '2026-03-25'
    },
    {
        title: 'Software Development Intern',
        department: 'Internship',
        location: 'Remote',
        type: 'Internship',
        description: 'Join our in-house development team and contribute to real projects — building features, writing tests, and participating in code reviews. Work with React, Node.js, Python, and cloud platforms in a HIPAA-compliant environment.',
        requirements: '- Currently enrolled in Computer Science or related program\n- Familiarity with JavaScript, Python, or similar\n- Basic understanding of web development (HTML/CSS/JS)\n- Eagerness to learn and contribute',
        posted: '2026-03-25'
    },
    {
        title: 'Social Media Management Intern',
        department: 'Internship',
        location: 'Remote',
        type: 'Internship',
        description: 'Help grow JBI Software\'s online presence across LinkedIn, Instagram, and other platforms. Create content, schedule posts, track engagement metrics, and support employer branding initiatives for our staffing division.',
        requirements: '- Currently enrolled in Marketing, Communications, or related program\n- Experience with social media platforms and scheduling tools\n- Strong writing and visual storytelling skills\n- Basic design skills (Canva, Adobe) a plus',
        posted: '2026-03-25'
    },
    {
        title: 'Content Creation Intern',
        department: 'Internship',
        location: 'Remote',
        type: 'Internship',
        description: 'Write blog posts, case studies, and website copy that showcases JBI Software\'s expertise in healthcare IT staffing, software development, and Epic implementations. Help build a content library that drives SEO and brand awareness.',
        requirements: '- Currently enrolled in English, Journalism, Marketing, or related program\n- Strong writing and editing skills\n- Interest in healthcare technology or B2B content\n- SEO awareness a plus',
        posted: '2026-03-25'
    },
    {
        title: 'Event Planning & Management Intern',
        department: 'Internship',
        location: 'New York, NY',
        type: 'Internship',
        description: 'Support planning and execution of JBI Software events — industry conferences, client appreciation events, recruiting fairs, and internal team events. Handle logistics, vendor coordination, and event marketing materials.',
        requirements: '- Currently enrolled in Event Management, Marketing, or related program\n- Strong organizational and multitasking skills\n- Excellent communication skills\n- Ability to work on-site for events',
        posted: '2026-03-25'
    }
];

// ── STATE ──
let allJobs = [];
const filterDept = document.getElementById('filterDept');
const filterLocation = document.getElementById('filterLocation');
const filterType = document.getElementById('filterType');
const jobList = document.getElementById('jobList');
const jobsCount = document.getElementById('jobsCount');
const modal = document.getElementById('jobModal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
const applyForm = document.getElementById('applyForm');
const applyPosition = document.getElementById('applyPosition');
const applySubmit = document.getElementById('applySubmit');
const fileInput = document.getElementById('applyResume');
const fileName = document.getElementById('fileName');

// ── LOAD JOBS ──
async function loadJobs() {
    if (!SHEET_CSV_URL) {
        allJobs = DEMO_JOBS;
        initBoard();
        return;
    }
    try {
        const res = await fetch(SHEET_CSV_URL);
        const csv = await res.text();
        allJobs = parseCSV(csv).filter(j => j.active && j.active.toUpperCase() === 'TRUE');
        initBoard();
    } catch (err) {
        jobList.innerHTML = '<div class="job-empty"><h3>Unable to load positions</h3><p>Please try again later or contact us at <a href="mailto:careers@jbisoftware.com">careers@jbisoftware.com</a></p></div>';
    }
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    if (lines.length < 2) return [];
    const headers = parseLine(lines[0]).map(h => h.trim().toLowerCase());
    return lines.slice(1).filter(l => l.trim()).map(line => {
        const vals = parseLine(line);
        const obj = {};
        headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
        return obj;
    });
}

function parseLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
            else { inQuotes = !inQuotes; }
        } else if (ch === ',' && !inQuotes) {
            result.push(current); current = '';
        } else {
            current += ch;
        }
    }
    result.push(current);
    return result;
}

// ── INIT ──
function initBoard() {
    populateFilters();
    renderJobs();
    filterDept.addEventListener('change', renderJobs);
    filterLocation.addEventListener('change', renderJobs);
    filterType.addEventListener('change', renderJobs);
}

function populateFilters() {
    const depts = [...new Set(allJobs.map(j => j.department).filter(Boolean))].sort();
    const locations = [...new Set(allJobs.map(j => j.location).filter(Boolean))].sort();
    const types = [...new Set(allJobs.map(j => j.type).filter(Boolean))].sort();

    depts.forEach(d => filterDept.add(new Option(d, d)));
    locations.forEach(l => filterLocation.add(new Option(l, l)));
    types.forEach(t => filterType.add(new Option(t, t)));
}

// ── RENDER ──
function renderJobs() {
    const dept = filterDept.value;
    const loc = filterLocation.value;
    const type = filterType.value;

    const filtered = allJobs.filter(j =>
        (!dept || j.department === dept) &&
        (!loc || j.location === loc) &&
        (!type || j.type === type)
    );

    jobsCount.textContent = `${filtered.length} position${filtered.length !== 1 ? 's' : ''} available`;

    if (filtered.length === 0) {
        jobList.innerHTML = '<div class="job-empty"><h3>No positions match your filters</h3><p>Try broadening your search or <a href="intake.html">submit your profile</a> and we\'ll contact you when something opens up.</p></div>';
        return;
    }

    jobList.innerHTML = filtered.map((job, i) => `
        <div class="job-card reveal" data-index="${allJobs.indexOf(job)}" tabindex="0" role="button" aria-label="View details for ${escapeHtml(job.title)}">
            <div class="job-card-header">
                <h3>${escapeHtml(job.title)}</h3>
                <div class="job-card-meta">
                    <span class="job-pill dept">${escapeHtml(job.department)}</span>
                    <span class="job-pill type">${escapeHtml(job.type)}</span>
                </div>
            </div>
            <div class="job-card-meta" style="margin-bottom:8px;">
                <span class="job-pill location">${escapeHtml(job.location)}</span>
                ${job.posted ? `<span style="font-size:.8rem;color:var(--gray-400);">Posted ${formatDate(job.posted)}</span>` : ''}
            </div>
            <div class="job-card-desc">${escapeHtml(truncate(job.description, 160))}</div>
            <button class="btn btn-primary btn-sm job-apply-btn" onclick="event.stopPropagation();openModal(${allJobs.indexOf(job)})">Apply Now</button>
        </div>
    `).join('');

    // Attach click handlers
    jobList.querySelectorAll('.job-card').forEach(card => {
        card.addEventListener('click', () => openModal(parseInt(card.dataset.index)));
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openModal(parseInt(card.dataset.index)); });
    });

    // Trigger reveal animations for new cards
    jobList.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
}

// ── MODAL ──
function openModal(index) {
    const job = allJobs[index];
    if (!job) return;

    applyPosition.value = job.title;
    applyForm.style.display = 'block';
    document.getElementById('applySuccess').classList.remove('active');
    document.getElementById('applyError').classList.remove('active');
    applyForm.reset();
    fileName.textContent = '';

    const reqList = (job.requirements || '').split('\n')
        .map(r => r.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean)
        .map(r => `<li>${escapeHtml(r)}</li>`)
        .join('');

    modalContent.innerHTML = `
        <h2>${escapeHtml(job.title)}</h2>
        <div class="modal-meta">
            <span class="job-pill dept">${escapeHtml(job.department)}</span>
            <span class="job-pill type">${escapeHtml(job.type)}</span>
            <span class="job-pill location">${escapeHtml(job.location)}</span>
        </div>
        <div class="modal-section">
            <h4>About this role</h4>
            <p>${escapeHtml(job.description)}</p>
        </div>
        ${reqList ? `<div class="modal-section"><h4>Requirements</h4><ul>${reqList}</ul></div>` : ''}
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal').scrollTop = 0;
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ── FILE UPLOAD ──
fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file.size > 5 * 1024 * 1024) {
            alert('File is too large. Maximum size is 5MB.');
            fileInput.value = '';
            fileName.textContent = '';
            return;
        }
        fileName.textContent = file.name;
    } else {
        fileName.textContent = '';
    }
});

// ── APPLY FORM SUBMIT ──
applyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    applySubmit.classList.add('loading');
    applySubmit.textContent = 'Submitting...';

    try {
        const formData = {
            name: document.getElementById('applyName').value,
            email: document.getElementById('applyEmail').value,
            phone: document.getElementById('applyPhone').value,
            best_contact_time: document.getElementById('applyContactTime').value,
            position: applyPosition.value,
            cover_letter: document.getElementById('applyCover').value,
            submitted: new Date().toISOString()
        };

        // Convert resume to base64 if present
        if (fileInput.files.length > 0) {
            formData.resume_name = fileInput.files[0].name;
            formData.resume_data = await fileToBase64(fileInput.files[0]);
        }

        if (!APPS_SCRIPT_URL) {
            // Demo mode — simulate success
            await new Promise(r => setTimeout(r, 1500));
            showApplySuccess();
            return;
        }

        const res = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'text/plain' }
        });

        if (res.ok) {
            showApplySuccess();
        } else {
            throw new Error('Submission failed');
        }
    } catch (err) {
        applyForm.style.display = 'none';
        document.getElementById('applyError').classList.add('active');
    }

    applySubmit.classList.remove('loading');
    applySubmit.textContent = 'Submit Application';
});

function showApplySuccess() {
    applyForm.style.display = 'none';
    document.getElementById('applySuccess').classList.add('active');
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ── HELPERS ──
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function truncate(str, len) {
    if (!str || str.length <= len) return str || '';
    return str.substring(0, len).replace(/\s+\S*$/, '') + '...';
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
}

// ── INIT ──
loadJobs();

// ============================================================
// GOOGLE APPS SCRIPT CODE (deploy this in your Google Sheet)
// ============================================================
// Go to Extensions → Apps Script → paste this → Deploy → Web app
// Set "Execute as: Me" and "Who has access: Anyone"
//
// function doPost(e) {
//   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Applications');
//   var data = JSON.parse(e.postData.contents);
//
//   // Save resume to Google Drive if present
//   var resumeUrl = '';
//   if (data.resume_data && data.resume_name) {
//     var blob = Utilities.newBlob(
//       Utilities.base64Decode(data.resume_data),
//       'application/octet-stream',
//       data.resume_name
//     );
//     var folder = DriveApp.getFolderById('YOUR_FOLDER_ID'); // Create a folder, paste its ID
//     var file = folder.createFile(blob);
//     resumeUrl = file.getUrl();
//   }
//
//   sheet.appendRow([
//     data.name,
//     data.email,
//     data.phone,
//     data.position,
//     resumeUrl,
//     data.cover_letter,
//     data.submitted
//   ]);
//
//   return ContentService.createTextOutput(
//     JSON.stringify({ status: 'ok' })
//   ).setMimeType(ContentService.MimeType.JSON);
// }
