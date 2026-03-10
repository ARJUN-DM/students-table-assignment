import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setStudents([]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !age) {
      alert("All fields are required");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      alert("Enter a valid email");
      return;
    }

    const studentData = { name, email, age };

    if (editIndex !== null) {
      const updatedStudents = [...students];
      updatedStudents[editIndex] = studentData;
      setStudents(updatedStudents);
      setEditIndex(null);
    } else {
      setStudents([...students, studentData]);
    }

    setName("");
    setEmail("");
    setAge("");
  };

  const deleteStudent = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents);
  };

  const editStudent = (index) => {
    const student = students[index];

    setName(student.name);
    setEmail(student.email);
    setAge(student.age);

    setEditIndex(index);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    XLSX.writeFile(workbook, "students.xlsx");
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading students...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">Students Management</h1>

      <button className="downloadBtn" onClick={downloadExcel}>
        Download Excel
      </button>

      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          placeholder="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <button className="addBtn" type="submit">
          {editIndex !== null ? "Update Student" : "Add Student"}
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th className="th">Name</th>
            <th className="th">Email</th>
            <th className="th">Age</th>
            <th className="th">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td className="td" colSpan="4">No students added yet</td>
            </tr>
          ) : (
            students.map((student, index) => (
              <tr key={index}>
                <td className="td">{student.name}</td>
                <td className="td">{student.email}</td>
                <td className="td">{student.age}</td>

                <td className="td">
                  <button className="editBtn" onClick={() => editStudent(index)}>
                    Edit
                  </button>

                  <button className="deleteBtn" onClick={() => deleteStudent(index)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;