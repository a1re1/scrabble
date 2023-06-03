// Create the grid and the dropdowns
const grid = document.getElementById('grid');
console.log(grid)
const options = [
    "a",
    "x",
    "z",
    "j",
    "e",
    "y",
    "g"
];
const optionsElList = [];
for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
        const dropdown = document.createElement('select');
        dropdown.className = 'dropdown';
        dropdown.id = 'dropdown-' + i + '-' + j;

        for (let opt of options) {
            const option = document.createElement('option');
            option.value = opt;
            option.text = opt;
            optionsElList.push(option);
            dropdown.appendChild(option);
        }

        grid.appendChild(dropdown);
    }
}