/**
 * SAPPHIRE FITNESS GYM - OWNER LEAD MANAGEMENT (ADMIN)
 * View, Search, Filter, Call/WhatsApp, Status Toggle, and CSV Export
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminDashboard();
});

let leadsCache = [];

async function initAdminDashboard() {
  await fetchLeads();
  renderLeadsTable();
  setupAdminListeners();
}

async function fetchLeads() {
  // Step 1: Fetch from backend API
  let apiLeads = [];
  try {
    const res = await fetch('/api/enquiries');
    if (res.ok) {
      apiLeads = await res.json();
    }
  } catch (e) {
    // Backend offline / static mode
  }

  // Step 2: Fetch from localStorage
  let localLeads = [];
  try {
    localLeads = JSON.parse(localStorage.getItem('sapphire_leads') || '[]');
  } catch (e) {}

  // Merge unique by lead ID
  const map = new Map();
  [...apiLeads, ...localLeads].forEach(lead => {
    if (lead && lead.id && !map.has(lead.id)) {
      map.set(lead.id, lead);
    }
  });

  leadsCache = Array.from(map.values());

  // If completely empty (fresh project demo), populate 2 sample demo leads so the owner immediately sees how the table works
  if (leadsCache.length === 0) {
    leadsCache = [
      {
        id: "SFG-DEMO-01",
        fullName: "Rahul Verma",
        phoneNumber: "9812345678",
        displayPhone: "+91 98123 45678",
        emailAddress: "rahul.verma@example.com",
        interestedPlan: "Half-Yearly Membership",
        message: "Interested in morning weight training sessions.",
        displayDate: "Today, 10:15 AM",
        status: "New",
        source: "Homepage / Modal"
      },
      {
        id: "SFG-DEMO-02",
        fullName: "Pooja Sharma",
        phoneNumber: "9876501234",
        displayPhone: "+91 98765 01234",
        emailAddress: "pooja.s@example.com",
        interestedPlan: "Quarterly Membership",
        message: "Enquiring about female changing rooms and trainer availability.",
        displayDate: "Yesterday, 6:45 PM",
        status: "Contacted",
        source: "Contact Page"
      }
    ];
  }
}

function renderLeadsTable(searchTerm = '', filterStatus = 'all') {
  const tbody = document.getElementById('leadsTableBody');
  const countEl = document.getElementById('leadsCount');
  if (!tbody) return;

  const filtered = leadsCache.filter(lead => {
    const matchSearch = (
      (lead.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phoneNumber || '').includes(searchTerm) ||
      (lead.interestedPlan || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchStatus = (filterStatus === 'all') || (lead.status.toLowerCase() === filterStatus.toLowerCase());

    return matchSearch && matchStatus;
  });

  if (countEl) countEl.textContent = `${filtered.length} Leads`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding: 40px; color: var(--text-muted);">
          No customer enquiries match your search filter.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(lead => {
    const isContacted = lead.status === 'Contacted';
    const statusClass = isContacted ? 'contacted' : 'new';
    const waUrl = `https://wa.me/91${lead.phoneNumber}?text=${encodeURIComponent(`Hello ${lead.fullName}, thank you for contacting Sapphire Fitness Gym! Regarding your enquiry for the ${lead.interestedPlan}...`)}`;

    return `
      <tr>
        <td>
          <strong>${escapeHtml(lead.fullName)}</strong>
          <span style="display:block;font-size:0.75rem;color:var(--text-dim);">${escapeHtml(lead.id)}</span>
        </td>
        <td>
          <a href="tel:+91${lead.phoneNumber}" style="color:var(--text-light);font-weight:600;display:inline-flex;align-items:center;gap:4px;">
            📞 +91 ${escapeHtml(lead.phoneNumber)}
          </a>
        </td>
        <td>
          <span class="badge badge-sapphire">${escapeHtml(lead.interestedPlan || 'General Enquiry')}</span>
          ${lead.message ? `<span style="display:block;font-size:0.8rem;color:var(--text-muted);margin-top:4px;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHtml(lead.message)}">💬 ${escapeHtml(lead.message)}</span>` : ''}
        </td>
        <td style="font-size:0.82rem;color:var(--text-muted);">${escapeHtml(lead.displayDate || 'Recent')}</td>
        <td>
          <span class="lead-status-badge ${statusClass}" onclick="toggleLeadStatus('${lead.id}')" title="Click to change status">
            ${isContacted ? '✓ Contacted' : '● New Lead'}
          </span>
        </td>
        <td>
          <div style="display:flex;gap:8px;">
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-sapphire" style="padding:4px 10px;font-size:0.78rem;">
              WhatsApp
            </a>
            <a href="tel:+91${lead.phoneNumber}" class="btn btn-sm btn-secondary" style="padding:4px 10px;font-size:0.78rem;">
              Call
            </a>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.toggleLeadStatus = function(leadId) {
  const lead = leadsCache.find(l => l.id === leadId);
  if (!lead) return;

  lead.status = (lead.status === 'Contacted') ? 'New' : 'Contacted';
  localStorage.setItem('sapphire_leads', JSON.stringify(leadsCache));

  // Sync to backend if supported
  fetch('/api/enquiries/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: leadId, status: lead.status })
  }).catch(() => {});

  renderLeadsTable();
};

function setupAdminListeners() {
  const searchInput = document.getElementById('adminSearchInput');
  const statusFilter = document.getElementById('adminStatusFilter');
  const exportBtn = document.getElementById('exportCsvBtn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderLeadsTable(e.target.value, statusFilter ? statusFilter.value : 'all');
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      renderLeadsTable(searchInput ? searchInput.value : '', e.target.value);
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportLeadsToCsv();
    });
  }
}

function exportLeadsToCsv() {
  if (!leadsCache.length) {
    alert("No leads to export.");
    return;
  }

  const headers = ["Lead ID", "Full Name", "Phone Number", "Email", "Interested Plan", "Message", "Date Received", "Status", "Source"];
  const rows = leadsCache.map(l => [
    `"${l.id}"`,
    `"${l.fullName || ''}"`,
    `"+91${l.phoneNumber || ''}"`,
    `"${l.emailAddress || ''}"`,
    `"${l.interestedPlan || ''}"`,
    `"${(l.message || '').replace(/"/g, '""')}"`,
    `"${l.displayDate || ''}"`,
    `"${l.status || ''}"`,
    `"${l.source || ''}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `sapphire_fitness_leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
