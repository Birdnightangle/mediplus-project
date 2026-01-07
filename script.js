 const uploadForm = document.getElementById("uploadForm");
const uploadBtn = document.getElementById("uploadBtn");
const popupOverlay = document.getElementById("popupOverlay");
const analyzingView = document.getElementById("analyzingView");
const resultView = document.getElementById("resultView");
const fileMeta = document.getElementById("fileMeta");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const riskBadge = document.getElementById("riskBadge");
const resultMeta = document.getElementById("resultMeta");
const summaryText = document.getElementById("summaryText");
const conditionsList = document.getElementById("conditionsList");
const findingsList = document.getElementById("findingsList");
const stepsList = document.getElementById("stepsList");
const closePopup = document.getElementById("closePopup");
const analyzeAnother = document.getElementById("analyzeAnother");
const fileInput = document.getElementById("fileUpload");
const previewImg = document.getElementById("previewImg");
const previewCanvas = document.getElementById("previewCanvas");
const previewPlaceholder = document.getElementById("previewPlaceholder");
const previewName = document.getElementById("previewName");
const previewInfo = document.getElementById("previewInfo");
if (window.pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

const scenarios = [
  {
    risk: "Low",
    summary: "No acute abnormalities detected. Findings are consistent with a normal study.",
    conditions: [
      { name: "Normal Study", confidence: 0.94 },
      { name: "Minor Artefacts", confidence: 0.21 }
    ],
    findings: [
      "Clear lung fields with normal cardiomediastinal contours",
      "No focal consolidation, effusion, or pneumothorax",
      "Bone structures intact without acute fracture"
    ],
    steps: [
      "Maintain regular checkups",
      "Continue balanced diet and exercise",
      "Re-evaluate if symptoms persist"
    ]
  },
  {
    risk: "Medium",
    summary: "Patchy opacities noted in lower lobes suggesting early infectious process.",
    conditions: [
      { name: "Atypical Pneumonia", confidence: 0.78 },
      { name: "Viral Bronchitis", confidence: 0.52 }
    ],
    findings: [
      "Bilateral basal ground-glass pattern",
      "No pleural effusion",
      "Trachea central; cardiac silhouette within normal limits"
    ],
    steps: [
      "Consult a physician within 24–48 hours",
      "Hydration and rest; monitor temperature",
      "Consider CBC and CRP if symptoms worsen"
    ]
  },
  {
    risk: "High",
    summary: "Findings suspicious for active infection requiring urgent clinical correlation.",
    conditions: [
      { name: "Bacterial Pneumonia", confidence: 0.86 },
      { name: "Lung Infection", confidence: 0.63 }
    ],
    findings: [
      "Right middle lobe consolidation with air bronchograms",
      "Mild volume loss with silhouetting of right heart border",
      "No pneumothorax detected"
    ],
    steps: [
      "Immediate evaluation by a clinician",
      "Start empiric antibiotics as prescribed",
      "Repeat imaging in 48–72 hours"
    ]
  }
];

function fmtBytes(bytes) {
  const units = ["B","KB","MB","GB"]; let i = 0; let n = bytes;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return n.toFixed(1) + " " + units[i];
}

function setRiskBadge(level) {
  let cls = "px-3 py-1 rounded-full text-sm font-semibold ";
  if (level === "High") cls += "bg-red-100 text-red-700";
  else if (level === "Medium") cls += "bg-amber-100 text-amber-700";
  else cls += "bg-emerald-100 text-emerald-700";
  riskBadge.className = cls;
  riskBadge.textContent = level + " Risk";
}

function populateResults(file, scenario) {
  const now = new Date();
  const overall = (0.82 + Math.random() * 0.14).toFixed(2);
  resultMeta.innerHTML = "File: " + file.name + " • Size: " + fmtBytes(file.size) + " • Type: " + (file.type || "unknown") + " • Analyzed: " + now.toLocaleString() + " • Confidence: " + overall;
  summaryText.textContent = scenario.summary;
  conditionsList.innerHTML = "";
  scenario.conditions.forEach(c => {
    const li = document.createElement("li");
    li.textContent = c.name + " — " + Math.round(c.confidence * 100) + "%";
    conditionsList.appendChild(li);
  });
  findingsList.innerHTML = "";
  scenario.findings.forEach(f => {
    const li = document.createElement("li");
    li.textContent = f;
    findingsList.appendChild(li);
  });
  stepsList.innerHTML = "";
  scenario.steps.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    stepsList.appendChild(li);
  });
  setRiskBadge(scenario.risk);
}

function simulateProgress(stages, cb) {
  let p = 0; let i = 0;
  const id = setInterval(() => {
    p += 2 + Math.random() * 3;
    if (i < stages.length - 1 && p >= stages[i+1].at) i++;
    const pct = Math.min(100, Math.floor(p));
    progressBar.style.width = pct + "%";
    progressText.textContent = stages[i].label + " (" + pct + "%)";
    if (pct >= 100) { clearInterval(id); cb(); }
  }, 60);
}

uploadForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const fileInput = document.getElementById("fileUpload");
  const file = fileInput.files[0];
  if (!file) { alert("⚠️ Please upload a report first!"); return; }

  uploadBtn.disabled = true;
  uploadBtn.textContent = "Analyzing...";

  fileMeta.textContent = file.name + " • " + fmtBytes(file.size);
  analyzingView.classList.remove("hidden");
  resultView.classList.add("hidden");
  progressBar.style.width = "0%";
  progressText.textContent = "Initializing...";
  popupOverlay.style.display = "flex";

  const stages = [
    { at: 0, label: "Uploading file" },
    { at: 25, label: "Preprocessing" },
    { at: 55, label: "Extracting features" },
    { at: 80, label: "Running models" },
    { at: 95, label: "Generating report" },
    { at: 100, label: "Finalizing" }
  ];

  simulateProgress(stages, () => {
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    populateResults(file, scenario);
    analyzingView.classList.add("hidden");
    resultView.classList.remove("hidden");
    uploadBtn.disabled = false;
    uploadBtn.textContent = "Upload & Analyze";
    uploadForm.reset();
  });
});

closePopup.addEventListener("click", () => {
  popupOverlay.style.display = "none";
});

if (analyzeAnother) {
  analyzeAnother.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });
}

if (fileInput) {
  fileInput.addEventListener("change", () => {
    const f = fileInput.files[0];
    if (!f) return;
    previewName && (previewName.textContent = f.name);
    previewInfo && (previewInfo.textContent = fmtBytes(f.size) + " • " + (f.type || "unknown"));
    if (previewImg) previewImg.classList.add("hidden");
    if (previewCanvas) previewCanvas.classList.add("hidden");
    if (previewPlaceholder) previewPlaceholder.classList.remove("hidden");
    if (f.type && f.type.startsWith("image/")) {
      const r = new FileReader();
      r.onload = () => {
        if (previewImg) {
          previewImg.src = r.result;
          previewPlaceholder && previewPlaceholder.classList.add("hidden");
          previewImg.classList.remove("hidden");
        }
      };
      r.readAsDataURL(f);
    } else if (f.type === "application/pdf" && window.pdfjsLib && previewCanvas) {
      const r = new FileReader();
      r.onload = async () => {
        try {
          const pdf = await pdfjsLib.getDocument({ data: r.result }).promise;
          const page = await pdf.getPage(1);
          const vw = 80, vh = 96;
          const viewport = page.getViewport({ scale: 1 });
          const scale = Math.min(vw / viewport.width, vh / viewport.height);
          const vp = page.getViewport({ scale });
          const canvas = previewCanvas;
          canvas.width = vp.width;
          canvas.height = vp.height;
          const ctx = canvas.getContext("2d");
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          previewPlaceholder && previewPlaceholder.classList.add("hidden");
          canvas.classList.remove("hidden");
        } catch {}
      };
      r.readAsArrayBuffer(f);
    }
  });
}
