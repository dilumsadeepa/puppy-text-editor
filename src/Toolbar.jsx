import React, { useState, useEffect } from 'react';
import PuppyModal from './PuppyModal';



const Toolbar = ({
  onModify,
  onPrev
}) => {

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [inputData, setInputData] = useState(null);
  const [savedSelection, setSavedSelection] = useState(null);

  const [showImagePropertyBox, setShowImagePropertyBox] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageProps, setImageProps] = useState({ width: '', height: '', className: '' });

  const [showVideoPropertyBox, setShowVideoPropertyBox] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoProps, setVideoProps] = useState({ width: '', height: '', url: '', controls: false });

  const [tableProps, setTableProps] = useState({ className: '', rows: 3, columns: 3 });
  const [showTablePropertyBox, setShowTablePropertyBox] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);



  const handleModal = (title) => {
    return new Promise((resolve) => {
      setModalTitle(title);
      setShowModal(true);
      const handleModalInput = (data) => {
        resolve(data);
      };
      const closeModal = () => {
        setShowModal(false);
      };
      window.handleModalInput = handleModalInput;
      window.closeModal = closeModal;
    })
  }

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0));
    }
  };

  const restoreSelection = () => {
    if (savedSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection);
    }
  };

  const getCursorPos = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preRange = range.cloneRange();
      preRange.selectNodeContents(document.getElementById('text-area'));
      preRange.setEnd(range.endContainer, range.endOffset);
      return preRange.toString().length;
    }
    return 0;
  };

  const setCursorPos = (position) => {
    const element = document.getElementById('text-area');
    const range = document.createRange();
    const selection = window.getSelection();
    let charCount = 0, foundStart = false;

    const nodeStack = [element];
    while (nodeStack.length > 0) {
      const node = nodeStack.pop();
      if (node.nodeType === Node.TEXT_NODE) {
        const textLength = node.textContent.length;
        if (!foundStart && charCount + textLength >= position) {
          range.setStart(node, position - charCount);
          foundStart = true;
        }
        if (foundStart && charCount + textLength >= position) {
          range.setEnd(node, position - charCount);
          break;
        }
        charCount += textLength;
      } else {
        let childNodes = Array.from(node.childNodes);
        childNodes.reverse();
        for (let i = 0; i < childNodes.length; i++) {
          nodeStack.push(childNodes[i]);
        }
      }
    }

    selection.removeAllRanges();
    selection.addRange(range);
  };



  const createLink = async () => {

    saveSelection();
    let url = await handleModal("Enter the URL :");
    // document.getElementById("text-area").focus();
    restoreSelection();
    // let url = prompt("Entert the Link");

    if (url !== null) {

      if (/http/i.test(url)) {
        onModify('createLink', false, url);
      } else {
        url = "http://" + url;
        onModify('createLink', false, url);
      }
    }
    setSavedSelection(null);

  }

  const addImage = async () => {

    const pos = getCursorPos();
    const url = await handleModal("Enter the URL :");
    const imgwidth = await handleModal("Enter the Width :");
    const imgheight = await handleModal("Enter the Height :");
    setCursorPos(pos);
    if (url) {
      const imageCode = `<br><img src='${url}' style="width:${imgwidth}px; height:${imgheight}px;" alt='image' />`;
      document.execCommand('insertHTML', false, imageCode);
    }
  };

  const isYouTubeUrl = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const extractYouTubeVideoId = (url) => {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v') || url.split('/').pop();
  };


  const addVideo = async () => {
    const pos = getCursorPos();
    const url = await handleModal('Enter the Video URL :');
    const videowidth = await handleModal('Enter the Width :');
    const videoheight = await handleModal('Enter the Height :');
    const controls = await handleModal('Show Controls (yes/no) :') === 'yes';
    setCursorPos(pos);
    if (url) {
      let videoCode;
      if (isYouTubeUrl(url)) {
        const videoId = extractYouTubeVideoId(url);
        videoCode = `<br><iframe width="${videowidth}" height="${videoheight}" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
      } else {
        videoCode = `<br><video src="${url}" style="width:${videowidth}px; height:${videoheight}px;" ${controls ? 'controls' : ''}></video>`;
      }
      document.execCommand('insertHTML', false, videoCode);
    }
  };


  const addTable = async () => {
    const pos = getCursorPos();
    const rows = await handleModal('Enter the number of rows:');
    const columns = await handleModal('Enter the number of columns:');
    const className = await handleModal('Select Table Style: [table-bordered, table-hover, table-striped, table-dark, table-borderless]');

    setCursorPos(pos);
    if (rows && columns) {
      let tableCode = '<div class="table-responsive">';

      tableCode += `<table class="table ${className}" style="border: 1px solid black;" >`;
      for (let i = 0; i < rows; i++) {
        tableCode += '<tr style="border: 1px solid black;">';
        for (let j = 0; j < columns; j++) {
          tableCode += '<td style="border: 1px solid black;">Cell</td>';
        }
        tableCode += '</tr>';
      }
      tableCode += '</table>';

      tableCode += '</div>';

      document.execCommand('insertHTML', false, tableCode);
    }
  };






  // property
  const handleImageClick = (e) => {
    const img = e.target;
    setSelectedImage(img);
    setImageProps({ width: img.style.width, height: img.style.height, className: img.className });
    setShowImagePropertyBox(true);
  };

  const handleImagePropChange = (prop, value) => {
    setImageProps({ ...imageProps, [prop]: value });
    if (selectedImage) {
      selectedImage.style[prop] = value;
      if (prop === 'className') {
        selectedImage.className = value;
      }
    }
  };

  const handleVideoClick = (e) => {
    const video = e.target;
    setSelectedVideo(video);
    setVideoProps({
      width: video.style.width,
      height: video.style.height,
      url: video.src,
      controls: video.controls,
    });
    setShowVideoPropertyBox(true);
    setShowImagePropertyBox(false);
  };

  const handleVideoPropChange = (prop, value) => {
    setVideoProps({ ...videoProps, [prop]: value });
    if (selectedVideo) {
      if (prop === 'url') {
        selectedVideo.src = value;
      } else if (prop === 'controls') {
        selectedVideo.controls = value === 'true';
      } else {
        selectedVideo.style[prop] = value;
      }
    }
  };




  useEffect(() => {
    const textArea = document.getElementById('text-area');
    textArea.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        handleImageClick(e);
      } else if (e.target.tagName === 'VIDEO') {
        handleVideoClick(e);
      } else {
        setShowImagePropertyBox(false);
        setShowVideoPropertyBox(false);
        setShowTablePropertyBox(false);
      }
    });
  }, []);




  return (
    <div id="toolbar">


      <div className="puppy-btn-group" style={{ margin: 10 }}>
        <button id="boldBtn" title="Bold" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('bold')}>
          <i className="fa-solid fa-bold"></i>
        </button>
        <button id="italicBtn" title="Italic" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('italic')}>
          <i className="fa-solid fa-italic"></i>
        </button>
        <button id="underlineBtn" title="Underline" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('underline')}>
          <i className="fa-solid fa-underline"></i>
        </button>
        <button id="strikethroughBtn" title="Strikethrough" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('strikethrough')}>
          <i className="fa-solid fa-strikethrough"></i>
        </button>
        <button id="superscriptBtn" title="Superscript" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('superscript')}>
          <i className="fa-solid fa-superscript"></i>
        </button>
        <button id="subscriptBtn" title="Subscript" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('subscript')}>
          <i className="fa-solid fa-subscript"></i>
        </button>
      </div>

      <div className="puppy-btn-group" style={{ margin: 10 }}>
        <button id="leftAlignBtn" title="Align Left" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('justifyLeft')}>
          <i className="fa-solid fa-align-left"></i>
        </button>
        <button id="centerAlignBtn" title="Align Center" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('justifyCenter')}>
          <i className="fa-solid fa-align-center"></i>
        </button>
        <button id="rightAlignBtn" title="Align Right" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('justifyRight')}>
          <i className="fa-solid fa-align-right"></i>
        </button>
        <button id="justifyAlignBtn" title="Align justify" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('justifyFull')}>
          <i className="fa-solid fa-align-justify"></i>
        </button>
        <button id="indentBtn" title="Indent" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('indent')}>
          <i className="fa-solid fa-indent"></i>
        </button>
        <button id="outdentBtn" title="Outdent" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('outdent')}>
          <i className="fa-solid fa-outdent"></i>
        </button>
      </div>

      <div className="puppy-btn-group" style={{ margin: 10 }}>
        <button id="orderedListBtn" title="Numbered List" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('insertOrderedList')}>
          <i className="fa-solid fa-list-ol"></i>
        </button>
        <button
          id="unorderedListBtn"
          title="Bullet List" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('insertUnorderedList')}
        >
          <i className="fa-solid fa-list-ul"></i>
        </button>
      </div>

      <div className="puppy-btn-group" style={{ margin: 10 }}>
        <button id="linkBtn" title="Add Link" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => createLink()}>
          <i className="fa-solid fa-link"></i>
        </button>
        <button id="unlinkBtn" title="Remove Link" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('unlink')}>
          <i className="fa-solid fa-unlink"></i>
        </button>
      </div>

      <div className="puppy-btn-group" style={{ margin: 10 }}>
        <button id="imageBtn" title="Add Image" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => addImage()}>
          <i className="fa-solid fa-image"></i>
        </button>
        <button id="videoBtn" title="Add Video" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => addVideo()}>
          <i className="fa-solid fa-video"></i>
        </button>
        <button id="insertTableBtn" title="Insert Table" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => addTable()}>
          <i className="fa-solid fa-table"></i>
        </button>
      </div>

      <div className="puppy-btn-group" style={{ margin: 10 }}>
        <button id="undoBtn" title="Undo" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('undo')}>
          <i className="fa-solid fa-undo"></i>
        </button>
        <button id="redoBtn" title="Redo" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('redo')}>
          <i className="fa-solid fa-redo"></i>
        </button>
      </div>

      <div className="puppy-btn-group" style={{ margin: 10 }}>
        
        <input
          type="color"
          title='Font Color'
          style={{width:80}}
          className='puppy-form-text'
          onChange={(e) => onModify('foreColor', false, e.target.value)}
        />
        <input
          type="color"
          title='Font Highlight'
          style={{width:80}}
          className='puppy-form-text'
          onChange={(e) => onModify('backColor', false, e.target.value)}
        />
        {/* <button id="fontColorBtn" title="Font" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('undo')}>
          <i className="fa-solid fa-undo"></i>
        </button>
        <button id="redoBtn" title="Redo" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onModify('redo')}>
          <i className="fa-solid fa-redo"></i>
        </button> */}
      </div>

      <div className="puppy-btn-group" style={{ margin: 10 }}>
        <select id="fontNameSelect" className='puppy-form-select' onClick={(e) => onModify('fontName', false, e.target.value)}>
          <option value="Arial">Arial</option>
          <option value="Courier">Courier</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Georgia">Georgia</option>
          <option value="Impact">Impact</option>
          <option value="Trebuchet MS">Trebuchet MS</option>
        </select>

        <select id="fontNameSelect" className='puppy-form-select' onClick={(e) => onModify('fontSize', false, e.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>
      </div>

      <div className="puppy-btn-group" style={{ margin: 10 }}>
        <button id="linkBtn" title="Add Link" className='puppy-btn puppy-btn-secondary'
          onClick={(e) => onPrev()}>
          preview
        </button>
        
      </div>



      {/* <div className="btn-group" style={{ margin: 10 }}>
        <input type="text" id="searchText" placeholder="Find" className='form-control' />
        <input type="text" id="replaceText" placeholder="Replace" className='form-control' />
        <button id="findReplaceBtn" title="Replace" className='btn btn-secondary'>
          <i className="fa-solid fa-search-replace"></i>
        </button>
      </div> */}

      {showImagePropertyBox && (
        <div className="puppy-modal-overlay">
          <div className="puppy-modal-body">
            <div className="puppy-modal-head">
              <h3>Image Properties</h3>
            </div>
            <div className="puppy-modal-content">
              <label>
                Width:
                <input
                  type="text"
                  value={imageProps.width}
                  className='puppy-form-text'
                  onChange={(e) => handleImagePropChange('width', e.target.value)}
                />
              </label>
              <label>
                Height:
                <input
                  type="text"
                  value={imageProps.height}
                  className='puppy-form-text'
                  onChange={(e) => handleImagePropChange('height', e.target.value)}
                />
              </label>
              <br />
              <label>
                Class Name:
                <select id="imageClasses" className="form-control" value={imageProps.className}
                  onChange={(e) => handleImagePropChange('className', e.target.value)}>
                  <option value="img-thumbnail">Thumbnail</option>
                  <option value="rounded">Rounded</option>
                  <option value="rounded-1">Rounded-1</option>
                  <option value="rounded-2">Rounded-2</option>
                  <option value="rounded-circle">Rounded Circle</option>
                  <option value="img-fluid">Fluid</option>
                </select>
                {/* <input
                  type="text"
                  className='puppy-form-text'
                  value={imageProps.className}
                  onChange={(e) => handleImagePropChange('className', e.target.value)}
                /> */}
              </label>
            </div>
          </div>
        </div>
      )}

      {/* video property */}

      {showVideoPropertyBox && (
        <div className="puppy-modal-overlay">
          <div className="puppy-modal-body">
            <div className="puppy-modal-head">
              <h3>Video Properties</h3>
            </div>
            <div className="puppy-modal-content">
              <label>
                Width:
                <input
                  type="text"
                  value={videoProps.width}
                  className="puppy-form-text"
                  onChange={(e) => handleVideoPropChange('width', e.target.value)}
                />
              </label>
              <label>
                Height:
                <input
                  type="text"
                  value={videoProps.height}
                  className="puppy-form-text"
                  onChange={(e) => handleVideoPropChange('height', e.target.value)}
                />
              </label>
              <label>
                URL:
                <input
                  type="text"
                  value={videoProps.url}
                  className="puppy-form-text"
                  onChange={(e) => handleVideoPropChange('url', e.target.value)}
                />
              </label>
              <br />
              <label>
                Controls:
                <select
                  value={videoProps.controls}
                  className="form-control"
                  onChange={(e) => handleVideoPropChange('controls', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      )}

      {showTablePropertyBox && (
        <div className="puppy-modal-overlay">
          <div className="puppy-modal-body">
            <div className="puppy-modal-head">
              <h3>Table Properties</h3>
              {/* Add a close button for the modal if needed */}
              <button onClick={() => setShowTablePropertyBox(false)} className="close-button">
                {/* Add a close icon or text here */}
              </button>
            </div>
            <div className="puppy-modal-content">
              <label>
                Class Name:
                <select
                  id="tableClasses"
                  className="form-control"
                  value={tableProps.className}
                  onChange={(e) => handleTablePropChange('className', e.target.value)}
                >
                  {/* Add your table class options here */}
                  <option value="puppy-table">Normal Table</option>
                  <option value="puppy-table-sm">Small Table</option>
                  <option value="puppy-table-bordered">Bordered Table</option>
                  <option value="puppy-table-striped">Striped Table</option>
                  <option value="puppy-table-hover">Hover Table</option>
                  <option value="puppy-table-dark">Dark Table</option>
                </select>
              </label>
              <br />
              <button onClick={addNewRow}>Add New Row</button>
              <button onClick={addNewColumn}>Add New Column</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <PuppyModal
          title={modalTitle}
          onSubmit={window.handleModalInput}
          display={window.closeModal}
        />
      )}

    </div>
  );
};

export default Toolbar;