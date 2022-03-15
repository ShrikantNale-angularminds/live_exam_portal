import './App.css';
import Container from './Components/Container';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Questions from './Components/Questions';
import { useEffect, useState } from 'react';
import axios from 'axios'
import AddQuestion from './Components/AddQuestion';
import Placeholder from './Components/Placeholder';
import EditQuestion from './Components/EditQuestion';
import Toast from './Components/Toast';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Components/Login';

function App() {

  const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')))
  const [userData, setUserData] = useState(localStorage.getItem('user'))
  const [questionData, setQuestionData] = useState()
  const [topicsData, setTopicsData] = useState()
  const [subjectsData, setSubjectsData] = useState()
  const [fullscreen, setFullscreen] = useState(false)


  useEffect(() => {
    if (token) {
      getQuestionData()
      getTopicsData()
    }
  }, [token])

  function getQuestionData(term = '', topic = '') {
    console.log(term, topic)
    axios.get(`http://admin.liveexamcenter.in/api/questions?page=1&limit=&term=${term}&topic=${topic}`,
      {
        headers: {
          'Authorization': token
        }
      })
      .then(res => setQuestionData(res.data.result))

  }

  function getTopicsData() {
    axios.get(`http://admin.liveexamcenter.in/api/topics?page=1&limit=&term=`,
      {
        headers: {
          'Authorization': token
        }
      })
      .then(res => setTopicsData(res.data))
  }

  function getSubjectsData() {
    axios.get(`http://admin.liveexamcenter.in/api/subjects?term=`,
      {
        headers: {
          'Authorization': token
        }
      })
      .then(res => setSubjectsData(res.data.result))
  }

  function postQuestion(question) {
    axios('http://admin.liveexamcenter.in/api/question', {
      method: 'POST',
      data: question,
      headers: {
        'Authorization': token,

        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res);
        res.status === 200 ?
          toast.success('Successfully added !!!', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }) :
          toast.error(`${res.statusText}!`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
      })
      .catch(error =>
        toast.error(`${error}!`,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        )
      )
  }

  /* function getQuestion(id) {
    axios.get(`http://admin.liveexamcenter.in/api/questions/${id}`,
      {
        headers: {
          'Authorization': token
        }
      })
      .then(res => setQuestion(res.data))
  } */

  function putQuestion(id, question) {
    let result = false
    axios(`http://admin.liveexamcenter.in/api/questions/${id}`, {
      method: 'PUT',
      data: question,
      headers: {
        'Authorization': token,

        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        console.log(res);
        res.status === 204 ?
          result = true :
          toast.error(`${res.statusText}!`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
      })
      .catch(error =>
        toast.error(`${error}!`,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        )
      )

    return result
  }

  function fullscreenHandler() {
    setFullscreen(!fullscreen)
  }


  /* function removeQuestion(id) {
    axios.delete(`http://admin.liveexamcenter.in/api/questions/${id}`,
      {
        headers: {
          'Authorization': token
        }
      })
      .then(res => console.log(res.status))
  
    setQuestionData(questionData)
      
  } */

  // console.log(question)

  // toast("Wow so easy!");


  return (
    <div className="App">
      {/* {!userData ? <Login setUserData={setUserData} setToken={setToken}/> : */}
      <Router>
        {!fullscreen && userData && <Navbar setUserData={setUserData} />}
        <Routes>
          {!userData ?
            <Route path='/auth/login' element={<Login setUserData={setUserData} setToken={setToken} />}></Route>
            :
            <>
              <Route path='/' element={<Container />}></Route>
              <Route path='/questions/default' element={(questionData && topicsData) ? <Questions token={token} filteredQuestionData={questionData} getQuestionData={getQuestionData} topicsData={topicsData} /> : <Placeholder />}></Route>
              <Route path='/questions/add' element={<AddQuestion token={token} subjectsData={subjectsData} getSubjectsData={getSubjectsData} postQuestion={postQuestion} fullscreen={fullscreen} fullscreenHandler={fullscreenHandler} />}></Route>
              <Route path='/questions/edit/:id' element={<EditQuestion token={token} subjectsData={subjectsData} getSubjectsData={getSubjectsData} putQuestion={putQuestion} fullscreen={fullscreen} fullscreenHandler={fullscreenHandler} />}></Route>
            </>
          }
        </Routes>
        {!fullscreen && <Footer />}

      </Router>

      <Toast />
    </div>
  );
}

export default App;
