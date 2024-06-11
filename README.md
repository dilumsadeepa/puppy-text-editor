# Puppy Text Editor

Puppy Text Editor is a customizable rich-text editor component for React applications. It allows users to format text and export HTML content.


## Features

- Rich text editing with basic formatting options and insert image, video, tables
- Export HTML content with CSS included
- Easily get and set content programmatically


## Installation

Install the package using npm:

    npm install puppy-text-editor

  
## Usage

Here's how you can use Puppy Text Editor in your React application:

Importing the Component

    import { useRef } from  'react'
    import  PuppyTextEditor  from  'puppy-text-editor';

## Using the Package

    const  editorRef  =  useRef();
    const  handleGetContent  = () => {
	    const  content  =  editorRef.current.getContent();
	    console.log(content);
	};
	
	const  code  =  `<div style="text-align: left;"><b>fbnv</b> kl <font color="#cd2d2d">ofdpjbnog</font> bpgmob</div>`;
	
	const  handleSetContent  = () => {
		editorRef.current.setContent(code);
	};
	
	return (
		<>
			<PuppyTextEditor  ref={editorRef}  />
			<button  onClick={handleGetContent}>Get Content</button>
			<button  onClick={handleSetContent}>Set Content</button>
		</>
	)
	

### Available Methods

-   `getContent`: Get the current content of the editor.
-   `setContent(content)`: Set the content of the editor.

## License

This project is licensed under the MIT License.