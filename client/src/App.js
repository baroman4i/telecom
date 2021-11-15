import React, {useState, useEffect, useMemo} from 'react'
import './App.css'

function App() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [dogs, setDogs] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [search, setSearch] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  useEffect(() => {
    fetch("/dogs")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true)
          setDogs(result)
        },
        (error) => {
          setIsLoaded(true)
          setError(error)
        }
      )
  }, [])

  const searchedDogs = useMemo(() => {
    if (search.trim() === '' && selectedOption.trim() === '') return dogs
    else if (search.trim() !== '' || selectedOption.length > 0) {
      return dogs.filter(d => d.breed.includes(selectedOption.trim()) && d.title.includes(search.trim()))
    }
    else return [{title:'нет элементов'}]
  }, [search, dogs, selectedOption])
  const pageNumbers = [];
  for (let i = 0; i <= Math.ceil(searchedDogs.length / 10)-1; i++) {
    pageNumbers.push(i);
    
  }
  function handleClick(event) {
      setCurrentPage(event.target.id)
  }
  const renderPageNumbers = pageNumbers.map(number => {
    return (
      <li
        key={number}
        id={number}
        onClick={(e) => handleClick(e)}
      >
        {number+1}
      </li>
    )
  })
  if (error) {
    return <div>Ошибка: {error.message}</div>
  } else if (!isLoaded) {
    return <div>Загрузка...</div>
  } else {
    return (
      <>
        <nav>
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            type="text" 
            placeholder="Search..." 
            className="search"
          >
          </input>
          <select value={selectedOption} onChange={e => setSelectedOption(e.target.value)}>
            <option value="">all breeds</option>
            {dogs.map(d => (
              <option key={d.id} value={d.breed}>{d.breed}</option>
            ))}
          </select>
        </nav>
        <table border="1">
          <thead>
            <tr>
             <th>Заголовок</th>
             <th>Картинка</th>
             <th>Порода</th>
           </tr>
          </thead>
          <tbody>
           {searchedDogs.map((item, index) => index >= currentPage*10 && index < currentPage*10+10? (<tr key={item.id}>
               <td>{item.title}</td>
               <td>{item.image}</td>
               <td>{item.breed}</td>
             </tr>) : null)}
          </tbody>
        </table>
        <div className="pagination">{renderPageNumbers}</div>
      </>
    );
  }
}

export default App
