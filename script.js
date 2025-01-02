const arrayContainer = document.getElementById('array-container');
const visualizeButton = document.getElementById('visualize');
const randomizeButton = document.getElementById('randomize');
const sizeSlider = document.getElementById('size');
const speedSlider = document.getElementById('speed');
const algorithmSelect = document.getElementById('algorithm');
const timerDisplay = document.getElementById('timer');

let array = [];
let delay = 200;
let arraySize = 50;

// Generate random array
function generateArray() {
    array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 400) + 10);
    displayArray();
}

// Display array bars
function displayArray() {
    arrayContainer.innerHTML = '';
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${value}px`;
        bar.style.width = `${Math.floor(600 / arraySize)}px`;
        arrayContainer.appendChild(bar);
    });
}

// Sleep for animation delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start timer
function startTimer() {
    startTime = performance.now();
}

// Stop timer and display
function stopTimer() {
    endTime = performance.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
    timerDisplay.innerText = `${timeTaken} sec`;
}

// Disable/Enable controls
function disableControls(disable) {
    visualizeButton.disabled = disable;
    randomizeButton.disabled = disable;
    sizeSlider.disabled = disable;
    speedSlider.disabled = disable;
    algorithmSelect.disabled = disable;
}

// Bubble Sort
async function bubbleSort() {
    const bars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].classList.add('compare');
            bars[j + 1].classList.add('compare');
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${array[j]}px`;
                bars[j + 1].style.height = `${array[j + 1]}px`;
            }
            await sleep(delay);
            bars[j].classList.remove('compare');
            bars[j + 1].classList.remove('compare');
        }
    }
}

// Selection Sort
async function selectionSort() {
    const bars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        bars[minIndex].classList.add('compare');
        for (let j = i + 1; j < array.length; j++) {
            bars[j].classList.add('compare');
            if (array[j] < array[minIndex]) {
                bars[minIndex].classList.remove('compare');
                minIndex = j;
                bars[minIndex].classList.add('compare');
            }
            await sleep(delay);
            bars[j].classList.remove('compare');
        }
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            bars[i].style.height = `${array[i]}px`;
            bars[minIndex].style.height = `${array[minIndex]}px`;
        }
        bars[minIndex].classList.remove('compare');
    }
}

// Insertion Sort
// Insertion Sort
async function insertionSort() {
    const bars = document.getElementsByClassName('array-bar');
    
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        // Highlight the current key being compared
        bars[i].classList.add('compare');

        // Move elements that are greater than `key` one position ahead
        while (j >= 0 && array[j] > key) {
            bars[j].classList.add('compare');
            
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j + 1]}px`;

            await sleep(delay);

            bars[j].classList.remove('compare');
            j--;
        }

        // Insert the key into its correct position
        array[j + 1] = key;
        bars[j + 1].style.height = `${array[j + 1]}px`;

        // Remove highlight from the key after placement
        bars[i].classList.remove('compare');
    }
}


// Merge Sort
// Merge Sort
async function mergeSortHelper(left, right) {
    if (left >= right) return;

    const middle = Math.floor((left + right) / 2);

    // Recursively sort the left and right halves
    await mergeSortHelper(left, middle);
    await mergeSortHelper(middle + 1, right);

    // Merge the sorted halves
    await merge(left, middle, right);
}

async function merge(left, middle, right) {
    const bars = document.getElementsByClassName('array-bar');
    const temp = [];
    let i = left, j = middle + 1;

    // Visualize the comparison and merge process
    for (let k = left; k <= right; k++) {
        bars[k].classList.add('compare');
    }

    // Merge the two halves into a temporary array
    while (i <= middle && j <= right) {
        if (array[i] <= array[j]) {
            temp.push(array[i++]);
        } else {
            temp.push(array[j++]);
        }
        await sleep(delay);
    }

    // Add any remaining elements from the left half
    while (i <= middle) {
        temp.push(array[i++]);
        await sleep(delay);
    }

    // Add any remaining elements from the right half
    while (j <= right) {
        temp.push(array[j++]);
        await sleep(delay);
    }

    // Copy the sorted elements back into the original array and update the DOM
    for (let k = left; k <= right; k++) {
        array[k] = temp[k - left];
        bars[k].style.height = `${array[k]}px`;
        bars[k].classList.remove('compare');
    }
}


// Quick Sort
async function quickSortHelper(low, high) {
    if (low < high) {
        const pivotIndex = await partition(low, high);
        await quickSortHelper(low, pivotIndex - 1);
        await quickSortHelper(pivotIndex + 1, high);
    }
}

async function partition(low, high) {
    const bars = document.getElementsByClassName('array-bar');
    const pivot = array[high];
    let i = low - 1;
    bars[high].classList.add('compare');
    for (let j = low; j < high; j++) {
        bars[j].classList.add('compare');
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            bars[i].style.height = `${array[i]}px`;
            bars[j].style.height = `${array[j]}px`;
        }
        await sleep(delay);
        bars[j].classList.remove('compare');
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    bars[i + 1].style.height = `${array[i + 1]}px`;
    bars[high].style.height = `${array[high]}px`;
    bars[high].classList.remove('compare');
    return i + 1;
}

// Randomize button logic
randomizeButton.addEventListener('click', generateArray);

// Visualize Sorting
visualizeButton.addEventListener('click', async () => {
    delay = 1000 - speedSlider.value;
    disableControls(true);
    startTimer();

    switch (algorithmSelect.value) {
        case 'bubble': await bubbleSort(); break;
        case 'selection': await selectionSort(); break;
        case 'insertion': await insertionSort(); break;
        case 'merge': await mergeSortHelper(0, array.length - 1); break;
        case 'quick': await quickSortHelper(0, array.length - 1); break;
    }

    stopTimer();
    disableControls(false);
});

// Update array size
sizeSlider.addEventListener('input', (e) => {
    arraySize = e.target.value;
    generateArray();
});

// Initial array
generateArray();
