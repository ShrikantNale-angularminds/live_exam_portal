import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function MyComponent(props) {
    const { index, value, onChange, onBlur } = props
    const [state, setState] = useState(value)
    const modules = {
        toolbar: [
            ['bold','italic','code-block','blockquote','underline'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'script': 'super'}],
            [{'header': [1, 2, false]}],
            ['font',{'color': []},{'background': []},'align','link','image','video']
        ]
    }
    const formats = ['header','bold','italic','code-block','blockquote','underline','list','script','font','color','background','align','link','image','video']

    /* function handleValue(value) {
        // console.log(value);
        
        onChange(value,index)
    } */

    useEffect(() => {
        onChange(state,index)
    }, [state])

    function handleBlur(value) {
        console.log(state);
        let newVal = htmlToText(state)
        // console.log(newVal);
        
        onBlur(newVal,index)
    }
    function htmlToText(html) {
        var temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent; // Or return temp.innerText if you need to return only visible text. It's slower.
    }

    return (
        <ReactQuill theme="snow" value={state} onChange={setState} onBlur={handleBlur} placeholder='Insert text here ...' modules={modules} formats={formats} />
    );
}





/* import React, { useRef, useState } from 'react';
import JoditEditor from "jodit-react";

function RTE(props) {
    const config = {
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        minHeight: 120,
        maxHeight: 120,
        buttons: ['bold', 'italic', 'source', 'underline', 'ol', 'superscript', 'paragraph','brush', 'left', 'link', 'image', 'video']
    }
    const editor = useRef(null)
    const { index, value, onChange } = props
    // console.log(value);

    return (
        <JoditEditor
            ref={editor}
            value={value}
            config={config}
            tabIndex={1} // tabIndex of textarea
            onBlur={newContent => onChange(newContent,index)} // preferred to use only this option to update the content for performance reasons
            // onChange={newContent => onChange(newContent, index)}
        />
    );
}

export default RTE;
 */