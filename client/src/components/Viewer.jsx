function Viewer(pdf_src) {
  return (
    <iframe
        src={`https://docs.google.com/gview?url=${pdf_src}&embedded=true`}
    >
    </iframe>
  )
}
export default Viewer
