"use strict";

const db = require("../db");
const Student = require("../models/student");
const { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } = require('firebase/firestore');

const addStudent = async (req, res, next) => {
  try {
    const data = req.body;
    await addDoc(collection(db, "students"), data);
    res.send("Record saved successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const studentsCollection = collection(db, "students");
    const studentsSnapshot = await getDocs(studentsCollection);
    const studentsArray = [];
    if (studentsSnapshot.empty) {
      res.status(404).send("No student record found");
    } else {
      studentsSnapshot.forEach(doc => {
        const student = new Student(
          doc.id,
          doc.data().firstName,
          doc.data().lastName,
          doc.data().fatherName,
          doc.data().classEnrolled,
          doc.data().age,
          doc.data().phoneNumber,
          doc.data().subject,
          doc.data().year,
          doc.data().semester,
          doc.data().status
        );
        studentsArray.push(student);
      });
      res.send(studentsArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getStudent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const studentDoc = doc(db, "students", id);
    const student = await getDoc(studentDoc);
    if (!student.exists()) {
      res.status(404).send('Student with the given ID not found');
    } else {
      res.send(student.data());
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const studentDoc = doc(db, "students", id);
    await updateDoc(studentDoc, data);
    res.send('Student record updated successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const studentDoc = doc(db, "students", id);
    await deleteDoc(studentDoc);
    res.send('Record deleted successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent
}
