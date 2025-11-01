const url = 'cpclfactbook.pdf';
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
const scale = 1.3;
const canvas = document.getElementById('pdf-render');
const ctx = canvas.getContext('2d');

pdfjsLib.getDocument(url).promise.then(pdf => {
  pdfDoc = pdf;
  document.getElementById('page-count').textContent = pdfDoc.numPages;
  renderPage(pageNum);
}).catch(error => {
  alert('Error loading PDF: ' + error.message);
});

function renderPage(num) {
  pageRendering = true;

  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    const renderTask = page.render(renderContext);

    renderTask.promise.then(() => {
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
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('show');
}
