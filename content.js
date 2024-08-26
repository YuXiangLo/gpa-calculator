// Grade conversion dictionaries
const gradeConversion4_0 = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "F": 0.0
};

const gradeConversion4_3 = {
  "A+": 4.3, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "F": 0.0
};

// Function to calculate GPA
function calculateGPA() {
  let totalCredits = 0;
  let totalWeightedGrades4_0 = 0;
  let totalWeightedGrades4_3 = 0;

  // Get all the rows containing grade information
  const rows = document.querySelectorAll('.table-rows');

  rows.forEach(row => {
    const creditsElement = row.querySelector('.table-column-credits');
    const gradeElement = row.querySelector('.table-column-grade');

    if (creditsElement && gradeElement) {
      const creditValue = parseInt(creditsElement.textContent.trim());
      const gradeValue = gradeElement.textContent.trim();

      if (gradeValue && gradeConversion4_0[gradeValue] !== undefined) {
        const weightedGrade4_0 = gradeConversion4_0[gradeValue] * creditValue;
        const weightedGrade4_3 = gradeConversion4_3[gradeValue] * creditValue;

        totalCredits += creditValue;
        totalWeightedGrades4_0 += weightedGrade4_0;
        totalWeightedGrades4_3 += weightedGrade4_3;
      } else {
        console.log(`[ERROR] Invalid or Missing Grade for course with ${creditValue} credits`);
      }
    }
  });

  const gpa4_0 = totalCredits > 0 ? (totalWeightedGrades4_0 / totalCredits).toFixed(2) : 0;
  const gpa4_3 = totalCredits > 0 ? (totalWeightedGrades4_3 / totalCredits).toFixed(2) : 0;

  return { gpa4_0, gpa4_3, totalCredits };
}

function getRowsData() {
  let rowsData = [];

  const rows = document.querySelectorAll('.table-rows');
  rows.forEach(row => {
    const creditsElement = row.querySelector('.table-column-credits');
    const gradeElement = row.querySelector('.table-column-grade');
    const courseNumberElement = row.querySelector('.table-column_course-number')
    const courseTitleElement = row.querySelector('.table-column-course-title')

    if (creditsElement && gradeElement) {
      const creditValue = creditsElement.textContent.trim();
      const gradeValue = gradeElement.textContent.trim();
      const courseNumber = courseNumberElement.textContent.trim();
      const courseTitle = courseTitleElement.textContent.trim();

      if (gradeValue) {
        rowsData.push({
          course_number: courseNumber,
          course_title: courseTitle,
          credits: creditValue,
          grade: gradeValue
        });
      }
    }
  });

  return rowsData;
}

// Send the GPA data to the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getGPA") {
    const gpaData = calculateGPA();
    sendResponse(gpaData);
  } else if (request.action === "getGPAData") {
    const rowsData = getRowsData();
    sendResponse(rowsData);
  }
});

