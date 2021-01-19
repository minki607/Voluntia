//JS to search events in all_event template
//initially fetches search bar element in all_event page and adds a event listener
window.onload = () => {
  let eventInput = document.getElementById("search-events");
  eventInput.addEventListener('input', sendReq)
}

//setting the timer so window does not renew so fast (give some time before search word is input)
let timer;
function sendReq(e) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    fetch(`/search?search=${e.target.value}`)
    .then(data => {
      return data.json()
    })
    .then(({isOrganisation, result}) => {
      let events = document.getElementById('events');
      //clear all displayed element
      events.innerHTML = '';
      let months = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUNE","JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
      //append event that matches search criteria ( this disables pagination )
      for (let event of result) {
        let orgActions = isOrganisation ? `
        <li class="edit" style="width:30%;">
          <a href="/edit/event/${event.id || event._id}">
            <button class="btn fill-div fa fa-pencil-square-o"></button>
          </a>
        </li>
        <li class="delete" style="width:30%;">
          <form action="/delete/event/${event.id || event._id}" method="POST">
            <button class="btn fill-div fa fa-trash-o" type="submit" onclick="return confirm('Are you sure you want to delete?')"> </button>   
          </form>
        </li>
        
        ` : '';
        events.innerHTML += `
        <div class="col-md-6">
          <ul class="event-list">
            <li>
              <time>
                <span class="day">${new Date(event.date).getDate()}</span>
                <span class="month">${months[new Date(event.date).getMonth()]}</span>
                <span class="year">${new Date(event.date).getYear()}</span>
              </time>
              <div class="info text-center">
                <h5 class="title heading-primary-sub mt-2" style="font-size:20px">${event.name}
                <ul>
                  <li class="view" style="width:${orgActions ? 31 : 100}% ; font-size: 35px">
                    <a href="/event/${event.id || event._id}">
                      <button class="btn fill-div fa fa-search"></button>
                    </a>
                  </li>
                  ${orgActions}
                </ul>
                </h5>
              </div>
            </li>
          </ul>
        </div>
        `;
      }
      
    })
    .catch(err => {
      console.log(err, 'error')
    })
  }, 1000)

}