import { useState, useEffect } from "react";
import "./Home.css";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import EditIcon from "@mui/icons-material/Edit";

import Modal from "@mui/material/Modal";
import { Delete } from "@mui/icons-material";
const firebaseConfig = {
  apiKey: "AIzaSyAqTABnzoQWZgfRsm4uVM-M8d4flJWgZhY",
  authDomain: "note-app-8158c.firebaseapp.com",
  databaseURL: "https://note-app-8158c-default-rtdb.firebaseio.com",
  projectId: "note-app-8158c",
  storageBucket: "note-app-8158c.appspot.com",
  messagingSenderId: "902103871661",
  appId: "1:902103871661:web:a7cba14fcc5f332e3ed624",
};
const Home = () => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState();
  const [allNotes, setAllNotes] = useState([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isViewingNote, setIsViewingNote] = useState(false);
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  const ref = database.ref("Notes");
  useEffect(() => {
    // Fetch data from Firebase database
    const fetchData = async () => {
      const snapshot = await firebase.database().ref("Notes").once("value");
      console.log(snapshot);
      if (snapshot.exists()) {
        // Convert Firebase snapshot to an array of objects
        const dataArray = [];
        snapshot.forEach((childSnapshot) => {
          const dataItem = childSnapshot.val();
          dataArray.push(dataItem);
        });
        setAllNotes(dataArray);
      }
    };

    fetchData();
  }, [allNotes]);
  const addNote = () => {
    // setAllNotes((prevState) => {
    //   return [...prevState, note];
    // });

    let generateId = () => {
      const alphanumeric =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let id = "NO";
      for (let i = 0; i < 4; i++) {
        id += alphanumeric.charAt(
          Math.floor(Math.random() * alphanumeric.length)
        );
      }
      return id;
    };
    let _id = generateId();
    ref
      .push({ noteId: _id, note })
      .then(() => {
        console.log("Data added successfully!");
      })
      .catch((error) => {
        console.error("Error adding data:", error);
      });
    setOpen(false);
  };
  console.log(allNotes);
  console.log(note);
  const handleOpen = () => {
    setOpen(true);
    setIsAddingNote(true);
  };
  const handleClose = () => {
    setOpen(false);
    setIsAddingNote(false);
  };

  // const pastels = ["#F3CEA8", "#F7C084", "#F69F84", "#9F83BC", "#E1BABC"];

  return (
    <>
      <div className="main">
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="Write Your Note"
          aria-describedby="modal-modal-description"
        >
          <div className="note-input">
            <h1>Add your note</h1>
            <textarea
              rows={10}
              cols={50}
              onChange={(e) => {
                setNote(e.target.value);
              }}
            />
            <div className="add-btn2" onClick={addNote}>
              +
            </div>
          </div>
        </Modal>
        <aside className="side-bar">
          <div className="add-btn" onClick={handleOpen}>
            +
          </div>
        </aside>
        <div className="main-content">
          <h1 className="notes-h1">Notes</h1>
          <div className="notes-tiles-group">
            {allNotes.map((notes) => {
              return (
                <>
                  <div
                    className="note"
                    onClick={() => {
                      setIsViewingNote(true);
                    }}
                  >
                    <p>{notes.note.slice(0, 100)}...</p>
                    <EditIcon
                      style={{
                        transform: "translate(8px,90px)",
                      }}
                    />
                    <Delete
                      style={{
                        transform: "translate(141px, 92px)",
                      }}
                    />
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
