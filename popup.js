document.addEventListener('DOMContentLoaded', () => {
  // Fetch GPA data and update the popup
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getGPA" }, response => {
      if (response) {
        document.getElementById('gpa4_0').textContent = response.gpa4_0;
        document.getElementById('gpa4_3').textContent = response.gpa4_3;
        document.getElementById('totalCredits').textContent = response.totalCredits;
      }
    });
  });

  // Add event listener to the export button
  document.getElementById('exportCSV').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      // Send a message to get the data for each row
      chrome.tabs.sendMessage(tabs[0].id, { action: "getGPAData" }, rowsData => {
        if (rowsData) {
          // Convert data to CSV
          const csvContent = convertToCSV(rowsData);
          // Trigger CSV download
          downloadCSV(csvContent, 'gpa_data.csv');
        }
      });
    });
  });
});

// Function to convert data to CSV format
function convertToCSV(rows) {
  let csvContent = "Course,Number,Credits,Grade,4.0 scale,4.3 scale\n"; // CSV header
  rows.forEach(row => {
    csvContent += `${row.course_title},${row.course_number},${row.credits},${row.grade},${row.gpa4_0},${row.gpa4_3}\n`; // Append each row's data
  });
  return csvContent;
}

// Function to trigger CSV download
function downloadCSV(csvContent, fileName) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

