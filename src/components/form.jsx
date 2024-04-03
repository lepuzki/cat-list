import {
    Alert,
    Button,
    Grid,
    List,
    ListItem,
    Snackbar,
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import React from "react";

const test = {
    message: "",
    severity: "info",
};

function Form() {
    const [newKitty, setNewKitty] = useState("");
    const [kitties, setKitties] = useState([]);
    const [catIsEdit, setCatIsEdit] = useState(null);
    const [toggle, setToggle] = useState(true);
    const [snackProperties, setSnackProperties] = useState(test);
    const [openCreate, setOpenCreate] = useState(false);

    function DigitsNumber(num) {
        return num.toString().padStart(2, "0");
    }

    function formatDate(date) {
        return (
            [
                DigitsNumber(date.getDate()),
                DigitsNumber(date.getMonth() + 1),
                date.getFullYear(),
            ].join(".") +
            " / " +
            [
                DigitsNumber(date.getHours()),
                DigitsNumber(date.getMinutes()),
                DigitsNumber(date.getSeconds()),
            ].join(":")
        );
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch("http://localhost:3001", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
                        "Access-Control-Allow-Headers":
                            "contet-Type, Access-Control-Allow_headers, Authorization, X-Requested-With",
                    },
                });
                const b = await response.json();
                const list = b.list.map((kitten) => {
                    return {
                        ...kitten,
                        time: formatDate(kitten?.time ? new Date(kitten.time) : new Date()),
                    };
                });
                setKitties(list);
            } catch (error) { }
        })();
    }, []);

    const addKitty = async () => {
        try {
            if (!newKitty) {
                alert("add a kitty 🐈");
                return;
            } else if (newKitty && !toggle) {
                setKitties(
                    kitties.map((kitten) => {
                        if (kitten.id === catIsEdit) {
                            return { ...kitties, name: newKitty };
                        }
                        return kitten;
                    })
                );
            } else {
                const response = await fetch("http://localhost:3001/", {
                    method: "POST",
                    body: JSON.stringify({ name: newKitty }),
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
                        "Access-Control-Allow-Headers":
                            "contet-Type, Access-Control-Allow_headers, Authorization, X-Requested-With",
                    },
                });

                const y = await response.json();
                console.log("🚀 ~ file: index.jsx ~ line 99 ~ addKitty ~ y", y);
                const cat = {
                    id: y.kitten.id,
                    name: y.kitten.name,
                    time: formatDate(
                        y?.kitten?.time ? new Date(y.kitten.time) : new Date()
                    ),
                };

                setKitties([...kitties, cat]);
                setNewKitty("");
                setCatIsEdit(null);
                setToggle(true);
                setSnackProperties({
                    message: `${cat.name} on luotu`,
                    severity: "success",
                });
                setOpenCreate(true);
            }
        } catch (error) {
            console.error("🚀 ~ file: index.jsx ~ line 119 ~ addKitty ~ error", error);
        }
    };

    const handleCreate = (event, reason) => {
        if (reason === "clickcreate") {
            return;
        }
        setOpenCreate(false);
        setSnackProperties(test);
    };

    const deleteKitty = (id) => async () => {
        const deleteKittyID = kitties.filter((cat) => cat.id !== id);

        console.log(
            "🚀 ~ file: index.jsx ~ line 135 ~ deleteKitty ~ deleteKittyID",
            deleteKittyID
        );

        try {
            await fetch(`http://localhost:3001/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers":
                        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
                },
            });
        } catch (error) {
            console.log("Delete: ", error);
        }

        setSnackProperties({
            message: `kissa on poistettu`,
            severity: "error",
        });

        setKitties(deleteKittyID);
        setOpenCreate(true);
    };

    

    
    const editCat = (id) => async () => {
        console.log("🚀 ~ file: form.jsx ~ line 167 ~ editCat ");

        try {
            await fetch(`http://localhost:3001/${id}/${newKitty}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS, PATCH",
                    "Access-Control-Allow-Headers":
                        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
                },
            });
        } catch (error) {
            console.log("Error occured: ", error);
        }
        setSnackProperties({
            message: `kissa on päivitetty`,
            severity: "info",
        });

        const kitten2 = kitties.find((kitten) => kitten.id === id);

        const kissa = { 
            id: kitten2.id,
            name: newKitty,
            time: kitten2.time
         }

        setKitties(kitties.map((kitten) => {
            if (kitten.id !== id) {
                return kitten;
            } else {
                return kissa;
            }
        }));
        setOpenCreate(true);
    };

    return (
        <div>
            <Grid item xs={12}>
                <TextField
                    style={{ backgroundColor: "grey"}}
                    variant="outlined"
                    label="Add a new kitty!"
                    type={"text"}
                    value={newKitty}
                    onChange={(e) => setNewKitty(e.target.value)}
                />
                {toggle ? (
                    <Button
                        className="TextfieldStyle"
                        variant={"contained"}
                        color="success"
                        onClick={addKitty}
                        id="add"
                    >
                        lisää
                    </Button>
                ) : (
                    <Button onClick={addKitty}>Päivitä</Button>
                )}
            </Grid>
            {kitties.map((cat, index) => (
                <Grid item xs={3} key={index}>
                    <List xs={3}>
                        <ListItem className="styleTest">
                            <p>
                                {" "}
                                😽 {cat.name} <br /> {cat.time}
                            </p>
                            <Button
                                variant={"contained"}
                                color={"error"}
                                onClick={deleteKitty(cat.id)}
                            >
                                delete
                            </Button>
                            <Button
                                variant={"contained"}
                                color={"warning"}
                                onClick={editCat(cat.id)}
                            >
                                Edit
                            </Button>
                        </ListItem>
                    </List>
                </Grid>
            ))}
            <Snackbar
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            open={openCreate}
            autoHideDuration={5000}
            onClose={handleCreate}
            >
                <Alert
                    onClose={handleCreate}
                    severity={snackProperties.severity}
                    sx={{ width: "100%" }}
                >
                    {snackProperties.message}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Form;
