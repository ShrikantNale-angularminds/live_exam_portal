import React from 'react'

function OutOfResult(props) {
    const { page, limit } = props
    return (
        <span style={{ color: '#6c757d' }}>
            Showing {1 + (page - 1) * limit} to {page * limit <= props.filteredQuestionData.length ? page * limit : props.filteredQuestionData.length} of {props.filteredQuestionData.length} entries
        </span>
    )
}

export default OutOfResult
