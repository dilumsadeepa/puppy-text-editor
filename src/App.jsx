import React, { useRef, useImperativeHandle, forwardRef } from 'react';

import './App.css';
import Toolbar from './Toolbar.jsx';

const cssCode = `
* Thumbnail */
.img-thumbnail {
    padding: 0.25rem;
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    max-width: 100%;
    height: auto;
}

/* Rounded */
.rounded {
    border-radius: 0.25rem !important;
}

/* Rounded Corners (various levels) */
.rounded-1 {
    border-radius: 0.2rem !important;
}

.rounded-2 {
    border-radius: 0.25rem !important;
}

.rounded-circle {
    border-radius: 50% !important;
}

/* Image Fluid (Responsive) */
.img-fluid {
    max-width: 100%;
    height: auto;
}

.puppy-table-responsive {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  
}

.puppy-table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
  border: 1px solid black;
}

.puppy-table .puppy-th,
.puppy-table .puppy-td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

.puppy-table .puppy-thead .puppy-th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}

.puppy-table .puppy-tbody+.puppy-tbody {
  border-top: 2px solid #dee2e6;
}

.puppy-table .puppy-table {
  background-color: #fff;
}

.puppy-table-sm .puppy-th,
.puppy-table-sm .puppy-td {
  padding: 0.3rem;
}

.puppy-table-bordered {
  border: 1px solid #dee2e6;
}

.puppy-table-bordered .puppy-th,
.puppy-table-bordered .puppy-td {
  border: 1px solid #000000;
}

.puppy-table-bordered .puppy-thead .puppy-th,
.puppy-table-bordered .puppy-thead .puppy-td {
  border-bottom-width: 2px;
}

.puppy-table-striped .puppy-tbody .puppy-tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

.puppy-table-hover .puppy-tbody .puppy-tr:hover {
  background-color: rgba(0, 0, 0, 0.075);
}

.puppy-table-dark,
.puppy-table-dark .puppy-th,
.puppy-table-dark .puppy-td {
  background-color: #343a40;
  color: #fff;
}

.puppy-table-dark .puppy-th,
.puppy-table-dark .puppy-td,
.puppy-table-dark .puppy-thead .puppy-th,
.puppy-table-dark .puppy-tbody+.puppy-tbody {
  border-color: #454d55;
}

.puppy-table-bordered .puppy-table-dark {
  border: 0;
}

.puppy-table-dark .puppy-table-striped .puppy-tbody .puppy-tr:nth-of-type(odd) {
  background-color: rgba(255, 255, 255, 0.05);
}

.puppy-table-dark .puppy-table-hover .puppy-tbody .puppy-tr:hover {
  background-color: rgba(255, 255, 255, 0.075);
}

@media (max-width: 575.98px) {
  .puppy-table-responsive-sm {
      display: block;
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      -ms-overflow-style: -ms-autohiding-scrollbar;
  }

  .puppy-table-responsive-sm>.puppy-table-bordered {
      border: 0;
  }
}

@media (max-width: 767.98px) {
  .puppy-table-responsive-md {
      display: block;
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      -ms-overflow-style: -ms-autohiding-scrollbar;
  }

  .puppy-table-responsive-md>.puppy-table-bordered {
      border: 0;
  }
}

@media (max-width: 991.98px) {
  .puppy-table-responsive {
      display: block;
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      -ms-overflow-style: -ms-autohiding-scrollbar;
       
  }
}
`;

const PuppyTextEditor = forwardRef((props, ref) => {

  const textAreaRef = useRef(null);

  const outputContent = () =>{
    const htmlContent = document.getElementById('text-area').innerHTML;
    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            ${cssCode}
          </style>
        </head>
        <body>
          <div class="container">
            <div class='row'>
              <div class='col-sm-12'>
                ${htmlContent}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    return htmlContent;
  }

  useImperativeHandle(ref, () => ({
    getContent: () => {
      return outputContent();
    },
    setContent: (content) => {
      textAreaRef.current.innerHTML = content;
    }
  }));

  const modifyText = (command, defaultUI = false, value = null) => {
    document.execCommand(command, defaultUI, value);
  }

  const exportHTMLWithCSS = () => {
    const fullHTML = outputContent();

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newTab = window.open();
    newTab.document.write('<iframe src="' + url + '" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>');
  };


  return (
    <>
      <div className='puppy-container-flude'>
        <div className="puppy-card">
          <div className="puppy-card-body" style={{ backgroundColor: '#ced4da' }}>
            <div className="puppy-row" style={{ zIndex: 1 }}>
              <div className="puppy-col-sm-12 puppy-mx-auto puppy-mt-3">
                <Toolbar onModify={modifyText} onPrev={exportHTMLWithCSS} />
              </div>
            </div>
            <br /><br />
            <div className="puppy-row" style={{ zIndex: 5 }}>
              <div className="puppy-col-sm-12 puppy-mx-auto">
                <div id='text-area' ref={textAreaRef} className='puppy-text-editor' autoFocus contentEditable={true}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default PuppyTextEditor;
