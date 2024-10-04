const apiUrl = 'http://localhost:8000/api/students'; // backend api

// Fetch and display students in a table
async function fetchStudents() {
    const response = await fetch(apiUrl);
    const students = await response.json();
    const studentTableBody = document.getElementById('studentList');
    studentTableBody.innerHTML = ''; // Clear existing data

    students.forEach(student => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${student.studentId}</td>
            <td>${student.name}</td>
            <td>${student.dob}</td>
            <td>${student.address}</td>
            <td>
                <button class="edit" onclick="loadStudent(${student.studentId})">Edit</button>
                <button class="delete" onclick="deleteStudent(${student.studentId})">Delete</button>
            </td>
        `;
        studentTableBody.appendChild(tr);
    });
}

// Show the "Create Student" popup form
function showPopup(isUpdate) {
    const popup = document.getElementById('studentModal');
    popup.style.display = 'block';
    if (isUpdate) {
        popup.querySelector("#editSubmit").style.display = 'block'
    } else {
        popup.querySelector("#addSubmit").style.display = 'block'
    }
}

// Hide the "Create Student" popup form
function hidePopup() {
    const popup = document.getElementById('studentModal');
    popup.style.display = 'none';
    popup.querySelector("#addSubmit").style.display = 'none'
    popup.querySelector("#editSubmit").style.display = 'none'
    document.getElementById('studentForm').reset();
}

// Load student data into the form for editing
async function loadStudent(id) {
    const response = await fetch(`${apiUrl}/${id}`);
    const student = await response.json();
    document.getElementById('studentId').value = student.studentId;
    document.getElementById('name').value = student.name;
    document.getElementById('dob').value = student.dob;
    document.getElementById('address').value = student.address;
    showPopup(true); // Show the form in popup when editing
}

// Add or update student
document.getElementById('studentForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    console.log(document.getElementById('update'))
    const isUpdate = event.submitter.id == "addSubmit" ? false : true
    const method = isUpdate ? 'PATCH' : 'POST'
    const url = apiUrl;

    const studentData = {
        studentId: document.getElementById('studentId').value,
        name: document.getElementById('name').value,
        dob: document.getElementById('dob').value,
        address: document.getElementById('address').value
    };


    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            hidePopup(); // Hide the popup after saving
            await fetchStudents();
        } else {
            const errorResponse = await response.json();
            alert("Error: ", errorResponse)
        }
    } catch (error) {
        console.error('Error adding/updating student: ', error)
    }
});

// Delete student
async function deleteStudent(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    await fetchStudents();
}

// Initial fetch of students
fetchStudents();

// Event listener for the "Add Student" button to show the popup
document.getElementById('addStudentBtn').addEventListener('click', () => { showPopup(false) });

// Event listener to close the modal
document.getElementById('closeModal').addEventListener('click', hidePopup)
