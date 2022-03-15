import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import Options from './Options'
import Pagination from './Pagination'
import OutOfResult from './OutOfResult';
import Placeholder from './Placeholder';

function Questions(props) {

    const navigate = useNavigate()

    const [questionData, setQuestionData] = useState([])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const [term, setTerm] = useState("")
    const [topic, setTopic] = useState('')
    const [loading, setLoading] = useState(true)

    // console.log(questionData)
    useEffect(() => {
        axios.get(`https://admin.liveexamcenter.in/api/questions?page=${page}&limit=${limit}&term=${term}&topic=${topic}`,
            {
                headers: {
                    'Authorization': props.token
                }
            })
            .then(res => {
                setQuestionData(res.data.result)
                setLoading(false);
            })

        props.getQuestionData(term, topic)
        // setLoading(false)
    }, [page, limit, term, topic, loading])

    useEffect(() => {
        setPage(1)
    }, [limit, term])

    function removeQuestion(id) {
        axios.delete(`http://admin.liveexamcenter.in/api/questions/${id}`,
            {
                headers: {
                    'Authorization': props.token
                }
            })
            .then(res => res.status === 204 && axios.get(`https://admin.liveexamcenter.in/api/questions?page=${page}&limit=${limit}&term=${term}&topic=${topic}`,
                {
                    headers: {
                        'Authorization': props.token
                    }
                })
                .then(res => setQuestionData(res.data.result)))

        // setPage(page)

    }

    function handlePage(newPage) {
        setLoading(true)
        setPage(newPage)
    }

    function termHandler(newTerm) {
        setLoading(true)
        setTerm(newTerm)
    }

    function topicHandler(value) {
        console.log("topic selected")
        setLoading(true)
        setTopic(value)
    }

    /* function editQuestion(id) {
        props.getQuestion(id)
        navigate('/questions/edit')
    } */

    function confirmToDelete(id) {
        const action = window.confirm('Are you sure you want to delete the question, this can not be rolled back?')

        if (action) {
            removeQuestion(id)
        }
    }
    console.log(questionData)
    console.log(loading)
    const questionElements = questionData && questionData.map((question, index) => {
        return (
            <div key={index}>
                <hr />
                <div style={{display: 'flex', alignItems: 'baseline'}}><input type="checkbox" name='question' /> <span contentEditable='false' dangerouslySetInnerHTML={{ __html: question.questionText }} style={{marginLeft: '5px'}}></span></div>
                <div style={{ marginLeft: '20px' }}><Options question={question} /></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '110px', marginLeft: '20px', marginTop: '10px', fontSize: '13px' }}>
                    <span style={{ cursor: 'pointer', color: 'rgb(106 112 112)' }} onClick={() => navigate(`/questions/edit/${question._id}`, {state: question})}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" className="bi bi-pencil" viewBox="0 0 18 18">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                        </svg>
                        Edit
                    </span>
                    <span style={{ cursor: 'pointer', color: 'rgb(106 112 112)' }} onClick={() => confirmToDelete(question._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 17 17">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                        </svg>
                        Delete
                    </span>
                </div>
            </div>)
    })

    const topicsList = props.topicsData.result.map((topic, index) => <option key={index} value={topic._id}>{topic.name}</option>)


    return (
        <>
            <nav className="navbar navbar-expand-sm navbar-dark" style={{ background: "#2b3640", height: '43px' }}>
                <div className="container-fluid" style={{ marginLeft: "6.5%", marginRight: "3rem" }}>
                    <div className="collapse navbar-collapse" id="">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/questions/default">Questions</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/questions/subjects">Subjects</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/questions/topics">Topics</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>


            <div className="container" style={{ marginTop: '40px' }}>
                {/* <!-- Content here --> */}

                <div style={{ display: "flex", justifyContent: "space-between", margin: "20px 0px" }}>
                    <h3>Questions</h3>
                    <button type="button" className="btn btn-primary" onClick={() => navigate('/questions/add')}><b>+</b> Add Question</button>
                </div>

                <div className='rounded-1' style={{ border: "1px solid rgba(0,0,0,.125)", textAlign: 'justify', padding: "20px" }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <input type="checkbox" name='show' style={{ marginRight: '10px' }} />Show
                            <select style={{ marginLeft: '10px', marginRight: '10px' }} onChange={(e) => setLimit(e.target.value)} defaultValue={20}>
                                <option value='5'>5</option>
                                <option value='10'>10</option>
                                <option value='20'>20</option>
                                <option value='30'>30</option>
                                <option value='50'>50</option>
                            </select>
                            records per page
                        </div>

                        <div style={{ display: 'flex'/* , justifyContent: 'space-between' */, flexDirection: 'row', overflowX: 'clip', flexWrap: 'wrap', maxWidth: '40%' }}>
                            <input type="text" className="form-control" placeholder="Search Question" style={{ width: '200px' }} onChange={(e) => termHandler(e.target.value)} />

                            <div style={{ marginLeft: '10px' }}>
                                {/* <input className="form-control" list="datalistOptions" id="exampleDataList" placeholder="Choose Topic..." onSelect={topicHandler} />
                                <datalist id="datalistOptions">
                                    {dataList}
                                </datalist> */}
                                <select className="form-select" aria-label="Default select example" onChange={(e) => topicHandler(e.target.value)} style={{ color: '#6c757d' }} defaultValue={''}>
                                    <option value=''>Choose Topic...</option>
                                    {topicsList}
                                </select>
                            </div>

                        </div>
                    </div>

                    {loading ? <Placeholder /> : questionElements}

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <OutOfResult page={page} limit={limit} filteredQuestionData={props.filteredQuestionData} />
                        {props.filteredQuestionData && <Pagination setQuestionPage={handlePage} questionData={questionData} totalQuestions={props.filteredQuestionData.length} page={page} limit={limit} />}
                    </div>
                </div>



            </div>


        </>
    )
}

export default Questions
