export const loadSensors = () => {
    Promise
        .all([
            d3.json("http://localhost:8000/data.json")
        ])
        .then(
            
        )
}