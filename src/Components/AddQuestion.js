import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import RTE from './RTE'
import Fullscreen from '../Images/fullscreen.png'
import Normalscreen from '../Images/normalscreen.png'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'


function AddQuestion(props) {

    const navigate = useNavigate();

    const { token, subjectsData, getSubjectsData, postQuestion } = props

    // document.getElementsByClassName('ql-container').style = 'heigth: 100px'

    const [topicsData, setTopicsData] = useState()
    const [allDataFilled, setAllDataFilled] = useState(false)
    const [answers, setAnswers] = useState([])
    const [isUniqueOptions, setIsUniqueOptions] = useState(true)
    const [questionTextRTE, setQuestionTextRTE] = useState(false)
    let options = [
        { option: '', isCorrect: false, richTextEditor: false },
        { option: '', isCorrect: false, richTextEditor: false },
        { option: '', isCorrect: false, richTextEditor: false },
        { option: '', isCorrect: false, richTextEditor: false }
    ]

    const [data, setData] = useState({
        diffLevel: "",
        options: options,
        questionText: "",
        rightMarks: 1,
        subject: "",
        topic: "",
        type: "",
        wrongMarks: 0
    })

    useEffect(() => {
        getSubjectsData()
    }, [])

    useEffect(() => {
        setIsUniqueOptions((data.options.filter(CmpOption => CmpOption.option === '' ? CmpOption :
            data.options.filter(option => CmpOption.option === option.option).length === 1
        )).length === data.options.length)
    }, [data])

    function isHTML(str) {
        var a = document.createElement('div');
        a.innerHTML = str;

        for (var c = a.childNodes, i = c.length; i--;) {
            if (c[i].nodeType === 1) return true;
        }

        return false;
    }

    console.log("HTML = " + isHTML(data.questionText));

    function setTopicsBySubject(e) {
        axios.get(`http://admin.liveexamcenter.in/api/topics/subject/${e.target.value}`,
            {
                headers: {
                    'Authorization': token
                }
            })
            .then(res => setTopicsData(res.data))

        dataHandler(e)
    }

    function dataHandler(e) {
        const { name, value } = e.target

        validateData(e)

        setData(prevData => {
            return {
                ...prevData,
                [name]: name === 'rightMarks' ? parseInt(value) : value
            }

        })
    }

    function setQuestionText(value) {
        setData(prevData => {
            return {
                ...prevData,
                questionText: value
            }

        })
    }

    function optionsRTEValueHandler(value, index) {
        setData(prevData => {
            return (
                {
                    ...prevData,
                    options: prevData.options.map((option, pos) =>
                        pos === index ?
                            { option: value, isCorrect: option.isCorrect, richTextEditor: option.richTextEditor } :
                            option)
                }
            )
        })
    }

    function optionsValueHandler(e, index) {

        validateData(e)

        // console.log(data.options.filter(option => option.option === e.target.value))
        // setIsUniqueOptions(data.options.filter((option, pos) => ).length > 0 ? false : true)
        setData(prevData => {
            return (
                {
                    ...prevData,
                    options: prevData.options.map((option, pos) =>
                        pos === index ?
                            { option: e.target.value, isCorrect: option.isCorrect, richTextEditor: option.richTextEditor } :
                            option)
                }
            )
        })
    }

    function optionsCheckHandler(e, index) {
        setData(prevData => {
            return (
                {
                    ...prevData,
                    options: e.target.type === 'checkbox' ?
                        prevData.options.map((option, pos) =>
                            pos === index ?
                                { option: option.option, isCorrect: !option.isCorrect, richTextEditor: option.richTextEditor } :
                                option) :
                        prevData.options.map((option, pos) =>
                            pos === index ?
                                { option: option.option, isCorrect: true, richTextEditor: option.richTextEditor } :
                                { option: option.option, isCorrect: false, richTextEditor: option.richTextEditor })
                }
            )
        })
    }

    function OptionRTEHandler(pos) {
        setData(prevData => {
            return {
                ...prevData,
                options: prevData.options.map((option, index) => index === pos ? { ...option, richTextEditor: !option.richTextEditor } : option)
            }
        })
    }

    function removeOption(id) {
        console.log(id)
        setData(prevData => {
            return (
                {
                    ...prevData,
                    options: prevData.options.filter((option, index) => index !== id)
                }
            )
        })
    }

    function addOption() {
        console.log("ddgdfkg")
        setData(prevData => {
            return (
                {
                    ...prevData,
                    options: [...prevData.options, { option: '', isCorrect: false, richTextEditor: false }]
                }
            )
        })
    }

    function submitQuestion(e) {
        e.preventDefault()
        if (isUniqueOptions && answers.length > 0) {
            postQuestion(data)
        }
    }

    function validateData(e) {
        e = e.target.value.replace(/ /g, "").length <= 0 ? e.target.classList.add('is-invalid') : e.target.classList.remove('is-invalid')
    }

    function validateRTEOption(value, index) {
        const optEl = document.getElementById(`OptionRTE${index}`)
        value = value.replace(/ /g, "").length <= 0 ? optEl.classList.add('is-invalid') : optEl.classList.remove('is-invalid')
    }

    function submitButton() {
        setAnswers(data.options.filter(option => option.isCorrect === true))
        setAllDataFilled(true)
    }

    function cancelSubmit() {
        toast.info('Adding question cancelled!', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
        navigate(`/questions/default`)
    }

    const subjectElements = subjectsData && subjectsData.map(subject => <option key={subject._id} value={subject._id}>{subject.name}</option>)

    const topicElements = topicsData && topicsData.map(topic => <option key={topic._id} value={topic._id}>{topic.name}</option>)

    const optionElements = data.options.map((option, index) => {
        const uniqueId = uuid()
        const inputType = data.type === 'MULTIPLE RESPONSE' ? 'checkbox' : 'radio'
        return (
            <>
                <div className="input-group">
                    <div className="input-group-text">
                        <div className={`form-check`}>
                            <input className="form-check-input" type={inputType} name="exampleRadios" id={`option${index}`} value="option1" checked={option.isCorrect} onChange={(e) => optionsCheckHandler(e, index)} />
                            <label className="form-label" htmlFor={`option${index}`}>
                                Option {index + 1}
                            </label>
                        </div>
                    </div>
                    {option.richTextEditor ?
                        <div id={`OptionRTE${index}`} className={`form-control ${(allDataFilled && data.options[index].option === '') ? 'is-invalid' : ''}`} aria-describedby={uniqueId}>
                            <RTE
                                index={index}
                                value={option.option}
                                onChange={optionsRTEValueHandler}
                                onBlur={validateRTEOption}
                            />
                        </div> :

                        <textarea className={`form-control ${(allDataFilled && data.options[index].option === '') ? 'is-invalid' : ''}`} rows="3" aria-describedby={uniqueId} value={option.option}
                            onChange={
                                (e) => optionsValueHandler(e, index)
                            }
                            onBlur={(e) => validateData(e)} required>
                        </textarea>

                    }
                    <div id={uniqueId} className="invalid-feedback">
                        Option is required.
                    </div>
                </div>

                <div className='form-label' style={{ marginBottom: '25px' }}>
                    <span style={{ cursor: 'pointer' }} onClick={() => removeOption(index)}>Remove option</span>  | <span style={{ cursor: 'pointer' }} onClick={() => OptionRTEHandler(index)}>
                        {option.richTextEditor ? 'Disable' : 'Enable'} Rich text editor
                    </span>
                </div>


            </>
        )
    })

    console.log(data)
    console.log(data.options)
    console.log(answers)
    console.log(isUniqueOptions)

    return (
        <div className='border rounded-3' style={{ margin: '60px 120px' }}>
            <form /* className={`${allDataFilled ? 'was-validated' : ''}`} */ onSubmit={(e) => submitQuestion(e)} autoCorrect='off' autoComplete='off'>
                <div className='border-bottom' style={{ margin: 'auto', padding: '20px', backgroundColor: '#f1f1f1', display: 'flex', justifyContent: 'space-between' }}>
                    <h4>Add Question</h4>
                    {props.fullscreen ?
                        <img src={Normalscreen} alt='normalscreen' width='30px' height='30px' style={{ cursor: 'pointer' }} onClick={() => props.fullscreenHandler()}></img> :
                        <img src={Fullscreen} alt='fullscreen' width='30px' height='30px' style={{ cursor: 'pointer' }} onClick={() => props.fullscreenHandler()}></img>}
                </div>
                {/* <div className='container' style={{ padding: '20px' }}> */}
                <div className="row g-3" style={{ padding: '20px', color: 'rgb(106 112 112)' }}>
                    <div className="col-md-6">
                        <label htmlFor="inputEmail4" className="form-label">Select Subject</label>
                        {/* <input type="email" className="form-control" id="inputEmail4" /> */}
                        <select className={`form-select ${allDataFilled && data.subject === '' && 'is-invalid'}`} aria-label="Default select example" name='subject' aria-describedby="validationSubjectFeedback" onChange={(e) => { setTopicsBySubject(e) }} onBlur={(e) => validateData(e)} required>
                            <option value='' selected>Select Subject</option>
                            {subjectElements}
                        </select>
                        <div id="validationSubjectFeedback" className="invalid-feedback">
                            Subject is required.
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputPassword4" className="form-label">Select Topic</label>
                        {/* <input type="password" className="form-control" id="inputPassword4" /> */}
                        <select className={`form-select ${allDataFilled && data.topic === '' && 'is-invalid'}`} aria-label="Default select example" name='topic' aria-describedby="validationTopicFeedback" onChange={(e) => dataHandler(e)} onBlur={(e) => validateData(e)} required>
                            <option value='' selected>Select Topic ...</option>
                            {topicElements}
                        </select>
                        <div id="validationTopicFeedback" className="invalid-feedback">
                            Topic is required.
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="inputAddress" className="form-label">Question Type</label>
                        {/* <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" /> */}
                        <select className={`form-select ${allDataFilled && data.type === '' && 'is-invalid'}`} aria-label="Default select example" name='type' aria-describedby="validationTypeFeedback" onChange={(e) => dataHandler(e)} onBlur={(e) => validateData(e)} required>
                            <option value='' selected>Select type ...</option>
                            <option value="MULTIPLE CHOICE">MULTIPLE CHOICE</option>
                            <option value="MULTIPLE RESPONSE">MULTIPLE RESPONSE</option>
                            <option value="FILL IN BLANKS">FILL IN BLANKS</option>
                        </select>
                        <div id="validationTypeFeedback" className="invalid-feedback">
                            Question type is required.
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="inputAddress" className="form-label">Difficulty Level</label>
                        {/* <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" /> */}
                        <select className={`form-select ${allDataFilled && data.diffLevel === '' && 'is-invalid'}`} aria-label="Default select example" name='diffLevel' aria-describedby="validationDiffLevelFeedback" onChange={(e) => dataHandler(e)} onBlur={(e) => validateData(e)} required>
                            <option value='' selected>Select level ...</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                        <div id="validationDiffLevelFeedback" className="invalid-feedback">
                            Difficulty level is required.
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="inputAddress" className="form-label">Right Marks</label>
                        <input type="number" className={`form-control ${allDataFilled && data.rightMarks === '' && 'is-invalid'}`} id="inputAddress" placeholder="Enter rigth marks" name='rightMarks' aria-describedby="validationRightMarksFeedback" value={data.rightMarks} onChange={(e) => dataHandler(e)} onBlur={(e) => validateData(e)} required />
                        <div id="validationRightMarksFeedback" className="invalid-feedback">
                            Right marks is required.
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="inputAddress" className="form-label">Wrong Marks</label>
                        <input type="number" className={`form-control ${allDataFilled && data.wrongMarks === '' && 'is-invalid'}`} id="inputAddress" placeholder="Enter wrong marks" name='wrongMarks' aria-describedby="validationWrongMarksFeedback" value={data.wrongMarks} onChange={(e) => dataHandler(e)} onBlur={(e) => validateData(e)} required />
                        <div id="validationWrongMarksFeedback" className="invalid-feedback">
                            Wrong marks is required.
                        </div>
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Question</label>
                        {questionTextRTE ?
                            <div className={`form-control ${(allDataFilled && data.questionText === '') ? 'is-invalid' : ''}`} id="exampleFormControlTextarea1">
                                <RTE
                                    value={data.questionText}
                                    onChange={setQuestionText}
                                // onBlur={() => validateData(value)}
                                />
                            </div> :
                            <textarea className={`form-control ${allDataFilled && data.questionText === '' && 'is-invalid'}`} id="exampleFormControlTextarea1" rows="5" name='questionText' value={data.questionText} onChange={(e) => dataHandler(e)} onBlur={(e) => validateData(e)} required></textarea>
                        }
                        <div className='form-label' style={{ marginBottom: '25px' }}>
                            <span style={{ cursor: 'pointer' }} onClick={() => setQuestionTextRTE(prev => !prev)}>
                                {questionTextRTE ? 'Disable' : 'Enable'} Rich text editor
                            </span>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <label className='form-label'>Options</label>

                        {optionElements}

                    </div>
                    <span className='nav-link' style={{ cursor: 'pointer' }} onClick={() => addOption()}><strong>+</strong> Add option</span>
                    {
                        isUniqueOptions ?
                            allDataFilled && data.options.filter(option => option.option !== '' && option.option !== '<p><br></p>').length === data.options.length && answers.length === 0 && <div style={{ color: 'red' }}>Please select correct answer from options.</div> :
                            <div style={{ color: 'red' }}>Duplicate options are not allowed.</div>
                    }
                </div>
                <div className='border-top' style={{ margin: '0px', padding: '20px', textAlign: 'left', backgroundColor: '#f1f1f1' }}>
                    <button type="submit" className="btn btn-primary" onClick={() => submitButton()}>Save question</button>
                    <button type="button" className="btn btn-outline-secondary" style={{ marginLeft: '20px' }} onClick={() => cancelSubmit()}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default AddQuestion
