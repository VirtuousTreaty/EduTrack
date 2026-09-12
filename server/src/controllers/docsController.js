export function getApiDocs(req, res) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EduTrack API Documentation</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    body { background-color: #0f172a; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; }
    .method-post { background-color: #1e3a8a; color: #60a5fa; }
    .method-get { background-color: #064e3b; color: #34d399; }
    .method-patch { background-color: #78350f; color: #fbbf24; }
    .method-put { background-color: #581c87; color: #c084fc; }
  </style>
</head>
<body class="p-6 md:p-12">
  <div class="max-w-5xl mx-auto space-y-8">
    <div class="border-b border-slate-700 pb-6 flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-extrabold text-white">EduTrack API Specification</h1>
        <p class="text-slate-400 mt-2">RESTful API documentation and endpoint testing specification</p>
      </div>
      <span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-sm font-medium">
        v1.0.0 Active
      </span>
    </div>

    <!-- Auth Section -->
    <div class="bg-slate-800/80 rounded-xl border border-slate-700 p-6 space-y-4">
      <h2 class="text-2xl font-bold text-slate-100 flex items-center gap-2">🔑 Authentication APIs</h2>
      
      <div class="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 font-mono text-xs font-bold rounded method-post">POST</span>
          <span class="font-mono text-sm text-slate-200">/api/auth/signup</span>
        </div>
        <p class="text-slate-400 text-sm mt-2">Register a new Student, University, or Company account with hashed password & role assignment.</p>
      </div>

      <div class="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 font-mono text-xs font-bold rounded method-post">POST</span>
          <span class="font-mono text-sm text-slate-200">/api/auth/login</span>
        </div>
        <p class="text-slate-400 text-sm mt-2">Authenticate user, validate password, and issue JWT Bearer token.</p>
      </div>

      <div class="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 font-mono text-xs font-bold rounded method-get">GET</span>
          <span class="font-mono text-sm text-slate-200">/api/auth/me</span>
        </div>
        <p class="text-slate-400 text-sm mt-2">Fetch current authenticated user profile & role specific details (Requires JWT).</p>
      </div>
    </div>

    <!-- Student Section -->
    <div class="bg-slate-800/80 rounded-xl border border-slate-700 p-6 space-y-4">
      <h2 class="text-2xl font-bold text-slate-100 flex items-center gap-2">🎓 Student APIs</h2>
      
      <div class="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 font-mono text-xs font-bold rounded method-get">GET</span>
          <span class="font-mono text-sm text-slate-200">/api/students/profile</span>
        </div>
        <p class="text-slate-400 text-sm mt-2">Fetch logged-in student profile including GPA, academic records, certificates, and activities.</p>
      </div>

      <div class="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 font-mono text-xs font-bold rounded method-put">PUT</span>
          <span class="font-mono text-sm text-slate-200">/api/students/profile</span>
        </div>
        <p class="text-slate-400 text-sm mt-2">Update student skills, course, year, and avatar.</p>
      </div>

      <div class="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 font-mono text-xs font-bold rounded method-post">POST</span>
          <span class="font-mono text-sm text-slate-200">/api/students/academic-records</span>
        </div>
        <p class="text-slate-400 text-sm mt-2">Add new semester academic record with subject credits and grades.</p>
      </div>

      <div class="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 font-mono text-xs font-bold rounded method-post">POST</span>
          <span class="font-mono text-sm text-slate-200">/api/certificates/upload</span>
        </div>
        <p class="text-slate-400 text-sm mt-2">Upload certificate file with multipart/form-data, file type check, and metadata recording.</p>
      </div>
    </div>

    <!-- University Section -->
    <div class="bg-slate-800/80 rounded-xl border border-slate-700 p-6 space-y-4">
      <h2 class="text-2xl font-bold text-slate-100 flex items-center gap-2">🏛️ University Verification APIs</h2>
      
      <div class="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 font-mono text-xs font-bold rounded method-get">GET</span>
          <span class="font-mono text-sm text-slate-200">/api/university/students</span>
        </div>
        <p class="text-slate-400 text-sm mt-2">Fetch student list with filtering by course, year, and search keywords.</p>
      </div>

      <div class="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 font-mono text-xs font-bold rounded method-patch">PATCH</span>
          <span class="font-mono text-sm text-slate-200">/api/certificates/:id/status</span>
        </div>
        <p class="text-slate-400 text-sm mt-2">Approve or reject student certificate submission.</p>
      </div>

      <div class="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 font-mono text-xs font-bold rounded method-get">GET</span>
          <span class="font-mono text-sm text-slate-200">/api/university/analytics</span>
        </div>
        <p class="text-slate-400 text-sm mt-2">University-level metrics, certificate approval stats, course distributions, and GPA averages.</p>
      </div>
    </div>

    <!-- Company Section -->
    <div class="bg-slate-800/80 rounded-xl border border-slate-700 p-6 space-y-4">
      <h2 class="text-2xl font-bold text-slate-100 flex items-center gap-2">💼 Company Search & Recommendation APIs</h2>
      
      <div class="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 font-mono text-xs font-bold rounded method-get">GET</span>
          <span class="font-mono text-sm text-slate-200">/api/company/students</span>
        </div>
        <p class="text-slate-400 text-sm mt-2">Search student talent pool with multi-field filters (skills, GPA range, course, year).</p>
      </div>

      <div class="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 font-mono text-xs font-bold rounded method-post">POST</span>
          <span class="font-mono text-sm text-slate-200">/api/company/recommendations</span>
        </div>
        <p class="text-slate-400 text-sm mt-2">Smart candidate recommendation engine scoring candidates (0-100%) against job skill criteria.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
  return res.send(html);
}
