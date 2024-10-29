// Import the 'fs' module to work with the file system
const fs = require('fs'); 

// This function checks if a given file exists in the file system and returns a boolean value
const fileExists = (filename) => fs.existsSync(filename);

// This function checks if the given argument is a valid number (integer or float, positive or negative)
const validNumber = (num) => {
  const pattern = /^-?\d+(\.\d+)?$/;
  return typeof num === 'number' || (typeof num === 'string' && pattern.test(num));
};

// This function returns the dimensions of a dataframe or dataset as [rows, columns]
const dataDimensions = (data) => {
  if (!data) return [-1, -1];
  if (Array.isArray(data)) {
    const rows = data.length;
    const cols = rows > 0 && Array.isArray(data[0]) ? data[0].length : -1;
    return [rows, cols];
  }
  return [-1, -1];
};

// This function calculates the mean (average) of all valid number values in the given dataset
const calculateMean = (dataset) => {
  if (!Array.isArray(dataset) || dataset.length === 0) return 0;

  const validNums = dataset.filter(validNumber).map(Number);
  return validNums.length === 0 ? 0 : validNums.reduce((acc, val) => acc + val, 0) / validNums.length;
};

// This function calculates the total sum of all valid number values in the given dataset
const findTotal = (dataset) => {
  if (!Array.isArray(dataset) || dataset.length === 0) return 0;

  const validNums = dataset.filter(validNumber).map(Number);
  return validNums.reduce((acc, val) => acc + val, 0);
};

// This function converts valid number values in the specified column of the dataframe to number
const convertToNumber = (df, colIndex) => {
  if (!Array.isArray(df) || df.length === 0 || typeof colIndex !== 'number') return 0;

  let count = 0;
  df.forEach(row => {
    if (Array.isArray(row) && colIndex < row.length) {
      const value = row[colIndex];
      if (typeof value !== 'number' && validNumber(value)) {
        row[colIndex] = parseFloat(value);
        count++;
      }
    }
  });

  return count;
};

// This function flattens a dataframe with shape [n, 1] into a dataset (1D array)
const flatten = (df) => {
  if (!Array.isArray(df) || df.length === 0 || dataDimensions(df)[1] !== 1) return [];
  return df.map(row => row[0]);
};

// This function loads a CSV file and returns the data along with its dimensions, excluding ignored rows and columns
function loadCSV(filename, ignoreRows = [], ignoreCols = []) {
  if (!fs.existsSync(filename)) {
    return [[], -1, -1];
  }

  const data = fs.readFileSync(filename, 'utf-8')
    .split('\n')
    .filter(line => line.trim().length > 0) // Remove empty lines
    .map(line => line.split(','));

  let originalRows = data.length;
  let originalCols = originalRows > 0 ? data[0].length : 0;

  // Refine row filtering based on your specific requirements
  const filteredData = data.filter((_, rowIndex) => !ignoreRows.includes(rowIndex));

  const rows = filteredData.length+1;
  const cols = rows > 0 ? filteredData[0].length : 0;

  return [filteredData, rows, cols];
}

// This function calculates the median value of all valid number values in the given dataset
const calculateMedian = (dataset) => {
  if (!Array.isArray(dataset) || dataset.length === 0) return 0;

  const validNums = dataset.filter(validNumber).map(Number);
  if (validNums.length === 0) return 0;

  validNums.sort((a, b) => a - b);
  const mid = Math.floor(validNums.length / 2);
  return validNums.length % 2 === 0 ? (validNums[mid - 1] + validNums[mid]) / 2 : validNums[mid];
};

// This function creates a slice of the dataframe based on a specified column value and optional columns to export
const createSlice = (df, colIndex, colPattern, exportCols = []) => {
  if (!Array.isArray(df) || df.length === 0) return [];

  const rowsToInclude = colPattern === '*' ? df : df.filter(row => row[colIndex] === colPattern);
  return exportCols.length === 0 ? rowsToInclude : rowsToInclude.map(row => exportCols.map(i => row[i]));
};

module.exports = {
  fileExists,
  validNumber,
  dataDimensions,
  calculateMean,
  findTotal,
  convertToNumber,
  flatten,
  loadCSV,
  calculateMedian,
  createSlice,
};
