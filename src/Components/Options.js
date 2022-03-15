import React from 'react'

function Options(props) {

    const { question } = props

    const inputType = question.type === 'MULTIPLE RESPONSE' ? 'checkbox' : 'radio'

    const optionElements = question.options.map((item, index) => {
        return (

            <div className="form-check" key={index}>
                <input className="form-check-input" type={inputType} name={question._id} id={index} value={item.option} checked={item.isCorrect} disabled />
                <div className="form-check-label" contentEditable='false' dangerouslySetInnerHTML={{ __html: item.option }}></div>
            </div>
        )
    })
    return (
        <div>
            {optionElements}
        </div>
    )
}

export default Options
