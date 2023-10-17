import { useEffect, useState } from 'react';

// Define the base URL for your API
const api_base = 'http://localhost:3001';

function App() {
    // Initialize state variables for cars, popup, newCarName, and newSpeed
	const [cars, setCars] = useState([]);
	const [popupActive, setPopupActive] = useState(false);
	const [newCarName, setNewCarName] = useState("Default Car Name");
	const [newSpeed, setNewSpeed] = useState("100");

    // Fetch cars from the API when the component mounts
	useEffect(() => {
		GetCars();
	}, []);

    // Function to fetch cars from the API and update the state
	const GetCars = () => {
		fetch(api_base + '/cars')
			.then(res => res.json())
			.then(data => setCars(data))
			.catch((err) => console.error("Error: ", err));
	};

    // Function to toggle the "choose" property of a car
	const chooseCar = async (id) => {
		const data = await fetch(api_base + '/car/choose/' + id).then((res) =>
		  res.json()
		);
	  
		setCars((cars) =>
		  cars.map((car) => {
			if (car._id === data._id) {
			  car.choose = data.choose;
			}
	  
			return car;
		  })
		);
	};

    // Function to add a new car to the inventory
	const addCar = async () => {
		const data = await fetch(api_base + "/car/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json" 
			},
			body: JSON.stringify({
				carName: newCarName,
				speed: newSpeed
			})
		}).then(res => res.json());

		setCars([...cars, data]);

		setPopupActive(false);
		setNewCarName("Default Car Name");
		setNewSpeed("100");
	};

    // Function to sort cars by speed
	const sortCarsBySpeed = async () => {
		try {
			const sortedCars = await fetch(api_base + '/cars/sortCarsBySpeed')
				.then(res => res.json());
	
			setCars(sortedCars);
		} catch (err) {
			console.error("Error sorting by speed: ", err);
		}
	};

    // Function to delete a car by its ID
	const deleteCar = async (id) => {
		const data = await fetch(api_base + '/car/delete/' + id, {
			method: 'DELETE'
		}).then(res => res.json());

		setCars(cars => cars.filter(car => car._id !== data._id))
	};

	return (
		<div className="App">
			<h1>Car Inventory</h1>
			<h4>Your cars</h4>

			<button className="sort-cars-by-speed-button" onClick={sortCarsBySpeed}>Sort cars by Speed</button>

			<div className="cars">
				{cars.length > 0 ? cars.map(car => (
					<div className={
						"car" + (car.choose ? " is-chosen" : "")
					} key={car._id} onClick={() => chooseCar(car._id)}>
						<div className="checkbox"></div>
						<div className="text">{car.carName}</div>
						<div className="speed">Speed: {car.speed}</div>
						<div className="delete-car" onClick={() => deleteCar(car._id)}>x</div>
					</div>
				)) : (
					<p>You currently have no cars in your inventory</p>
				)}
			</div>

			<div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

			{popupActive ? (
				<div className="popup">
					<div className="closePopup" onClick={() => setPopupActive(false)}>X</div>
					<div className="content">
						<h3>Name of the car</h3>
						<input type="text" className="add-car-input" onChange={e => setNewCarName(e.target.value)} value={newCarName} />
						<h2>Speed (km/h)</h2>
						<input type="text" className="add-car-input" onChange={e => setNewSpeed(e.target.value)} value={newSpeed} />
						<div className="button" onClick={addCar}>New Car</div>
					</div>
				</div>
			) : ''}
		</div>
	);
}

export default App;