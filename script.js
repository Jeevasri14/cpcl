

// PDF Viewer
const url = 'cpclfactbook.pdf';
let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.2,
    canvas = document.getElementById('pdf-canvas'),
    ctxPdf = canvas.getContext('2d');

pdfjsLib.getDocument(url).promise.then(function(pdf) {
  pdfDoc = pdf;
  document.getElementById('page-count').textContent = pdf.numPages;
  renderPage(pageNum);
});

function renderPage(num) {
  pageRendering = true;
  pdfDoc.getPage(num).then(function(page) {
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctxPdf,
      viewport: viewport
    };

    const renderTask = page.render(renderContext);
    renderTask.promise.then(function () {
      pageRendering = false;
      document.getElementById('page-num').textContent = num;
      if (pageNumPending !== null) {
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });
}

function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

function prevPage() {
  if (pageNum <= 1) return;
  pageNum--;
  queueRenderPage(pageNum);
}

function nextPage() {
  if (pageNum >= pdfDoc.numPages) return;
  pageNum++;
  queueRenderPage(pageNum);
}

function goToPage(num) {
  if (num < 1 || num > pdfDoc.numPages) return;
  pageNum = num;
  queueRenderPage(pageNum);
  document.getElementById("pdf-viewer").scrollIntoView({ behavior: "smooth" });
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('show');
}
