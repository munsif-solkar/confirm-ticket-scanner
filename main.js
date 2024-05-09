const search_form = document.querySelector('.search-form')
const container = document.querySelector('.data-container');
const source_display = document.querySelector('#source') 
const destination_display = document.querySelector('#destination') 
const date_display = document.querySelector('#date')
const quota_display = document.querySelector('#quota')



var source;
var destination;
var date_of_journey;
var quota;

window.onload = async () => {

    const urlParams = new URLSearchParams(window.location.search);
    source = urlParams.get('source');
    destination = urlParams.get('destination');
    date_of_journey = convertDateFormat(urlParams.get('date'));
    quota = urlParams.get('quota')

    const trainsData = new TrainsData(source, destination, date_of_journey,quota);

    const confirmTrains = await trainsData.findConfirmTicktes();
    source = trainsData.search_data.source.stationName;
        destination = trainsData.search_data.destination.stationName;
    if (!confirmTrains.error) {
        // Assuming source and destination are input fields
  
        renderData(confirmTrains.trainsWithConfirmTickets);
    } else {
        // Assuming container is a DOM element where you want to display the error message
        container.innerHTML = `<p class='text-center'>${confirmTrains.message}</p>`;
    }
    setSearchData()
};


const convertDateFormat = (date)=> {
    const parts = date.split("-");
    const formattedDate = parts[2] + "-" + parts[1] + "-" + parts[0];
    return formattedDate
}

const setSearchData = ()=>{
	   source_display.textContent = source;
    destination_display.textContent = destination;
    date_display.textContent = date_of_journey;
    quota_display.textContent = quota;
}

const renderData = (data) => {
    container.innerHTML = ''
    data.forEach(train => {
        const dataCard = document.createElement('div');
        dataCard.classList.add('border', 'p-4', 'sm:mb-4', 'sm:rounded', 'bg-white','sm:shadow');

        const trainName = document.createElement('h2');
        trainName.textContent = `${train.trainName} - ${train.trainNum}`;
        trainName.classList.add('text-lg', 'font-bold', 'mb-1','text-blue-600');

        const trainTime = document.createElement('p');
        trainTime.textContent = train.departureTime;
        trainTime.classList.add('mb-5');

        const availableClasses = document.createElement('ul');
        availableClasses.classList.add('flex','flex-wrap','gap-3')
        Array.from(Object.keys(train.availableClasses)).forEach(Class=>{
        	const listItem = document.createElement('li');
        	listItem.classList.add('mb-2','w-[150px]','flex','flex-row','gap-3')
        	const availableSeats = train.availableClasses[Class]['available']
        	const fare = train.availableClasses[Class]['fare']
            listItem.innerHTML = `
          	<div class='train-class flex flex-col gap-3 py-2 px-4 ring-1 ring-gray-200'>
            <p class='text-blue-800 text-sm font-medium rounded'>${Class}</p>
            <p class="text-green-800 text-sm font-medium rounded">${availableSeats}</p>
            <p class="text-gray-800 text-sm font-medium rounded">&#8377;${fare}</p>
            </div>`;
            availableClasses.appendChild(listItem);
        })
   
        

        dataCard.appendChild(trainName);
        dataCard.appendChild(trainTime);
        dataCard.appendChild(availableClasses);
        
        container.appendChild(dataCard);
    });
}

// Example


