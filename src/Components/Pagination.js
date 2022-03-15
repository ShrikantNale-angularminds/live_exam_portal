import React, { useEffect, useRef } from 'react'
import ReactPaginate from 'react-paginate'

function Pagination(props) {

    const pagination = useRef()

    function setPage({selected}) {
        // console.log(selected === 0 ? 1 : selected + 1);
        props.setQuestionPage(selected === 0 ? 1 : selected + 1)
    }

    useEffect((e) => {
        pagination.current.setState({ selected: props.page - 1 })
    })

    return (

        <ReactPaginate
            ref={pagination}
            pageCount={Math.ceil(props.totalQuestions / props.limit)}
            pageRangeDisplayed={4}
            marginPagesDisplayed={1}
            onPageChange={setPage}
            containerClassName="pagination"
            activeClassName="active"
            pageLinkClassName="page-link"
            breakLinkClassName="page-link"
            nextLinkClassName="page-link"
            previousLinkClassName="page-link"
            pageClassName="page-item"
            breakClassName="page-item"
            nextClassName="page-item"
            previousClassName="page-item"
            previousLabel={'Prev'}
            nextLabel={'Next'}
        />
    )
}

export default Pagination

