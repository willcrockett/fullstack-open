const Filter = ({value, onChange}) => {
  return (
    <div>
      Search: <input value={value} onChange={onChange}/>
    </div>
  )
}
export default Filter