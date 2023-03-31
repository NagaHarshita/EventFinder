import React, {useState} from 'react';
import NavBar from '../navbar/navbar';
import './favorites.css'

function Favourites(){
  const [favList, setFavList] = useState(JSON.parse(sessionStorage.getItem('Favorites')));

  const deleteFav = (ind) => {
    const k = {...favList};
    delete k[ind];
    setFavList(k);
    sessionStorage.setItem('Favorites', JSON.stringify(k));
    window.confirm("Removed from favorites!"); 
  }
  

  return(
    <div className='fav'>
      <div>
        <NavBar/>
        
          {
            favList && Object.keys(favList).length !== 0 ? 
            (
              <>
              <div className='list'>List of your favorite events</div>
              <table className='fav_table'>

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Event</th>
                    <th>Category</th>
                    <th>Venue</th>
                    <th>Favorite</th>
                  </tr>
                </thead>

                <tbody>
                  {
                  
                  Object.entries(favList)?.map(([ind, { date, time, icon, event_name, genre, venue, id }], index) => {
                      return <tr key={index}>
                                  <td >{index+1}</td>
                                  <td >{date}</td>
                                  <td >{event_name}</td>
                                  <td >{genre}</td>
                                  <td >{venue}</td>
                                  <td><span className="material-symbols-outlined" onClick={()=> deleteFav(ind)}>delete</span></td>
                              </tr>})
                  }
                </tbody>
            </table>
            </>
            ): <div className='empty-fav'>No favorite events to show</div>
          }
          

      </div>
    </div>
  );
}


export default Favourites;